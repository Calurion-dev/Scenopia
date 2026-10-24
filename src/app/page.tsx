"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Clapperboard,
  Copy,
  Database,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  EmptyState,
  Field,
  IconButton,
  Input,
  Modal,
  Pill,
  ProgressBar,
  cn,
  type PillTone,
} from "@/components/ui";
import {
  formatDate,
  formatDuration,
  PROJECT_STATUS_LABELS,
  shotProgress,
  todayISO,
  totalShotsDuration,
} from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Project, ProjectStatus, RoomElement } from "@/lib/types";

const statusTone: Record<ProjectStatus, PillTone> = {
  brouillon: "neutral",
  preparation: "orange",
  pret: "cyan",
  tourne: "green",
  termine: "neutral",
};

function elementColor(kind: RoomElement["kind"]): string {
  switch (kind) {
    case "camera":
      return "bg-orange";
    case "light":
      return "bg-amber";
    case "mic":
      return "bg-cyan";
    case "person":
      return "bg-paper";
    default:
      return "bg-muted";
  }
}

function MiniPlan({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden border-y border-line bg-[#0D171B]">
      {project.room.image ? (
        <img
          src={project.room.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
      ) : (
        <div className="blueprint-grid absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D171B]/70 via-transparent to-transparent" />
      {project.room.elements.slice(0, 40).map((element) => (
        <span
          key={element.id}
          className={cn(
            "absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/40",
            elementColor(element.kind),
          )}
          style={{ left: `${element.x * 100}%`, top: `${element.y * 100}%` }}
        />
      ))}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 border border-cyan/40 bg-[#0D171B]/80 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-cyan">
        <span className="h-1 w-1 rounded-full bg-cyan" />
        {project.room.elements.length} éléments
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: (project: Project) => void;
}) {
  const router = useRouter();
  const { duplicateProject } = useStore();
  const progress = shotProgress(project.shots);
  const duration = totalShotsDuration(project.shots);
  const isNext = project.shootDate >= todayISO();

  return (
    <article className="group relative flex flex-col border border-line bg-white/50 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_16px_40px_rgba(20,23,25,0.08)]">
      <Link
        href={`/project/${project.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Ouvrir ${project.title}`}
      />
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={statusTone[project.status]}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Pill>
          {isNext ? (
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              {project.shootDate === todayISO() ? "Aujourd'hui" : formatDate(project.shootDate)}
            </span>
          ) : null}
        </div>
        <div className="relative z-20 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <IconButton
            label="Dupliquer"
            className="h-7 w-7"
            onClick={() => {
              const id = duplicateProject(project.id);
              if (id) router.push(`/project/${id}`);
            }}
          >
            <Copy size={14} />
          </IconButton>
          <IconButton
            label="Supprimer"
            className="h-7 w-7 hover:text-danger"
            onClick={() => onDelete(project)}
          >
            <Trash2 size={14} />
          </IconButton>
        </div>
      </div>

      <div className="px-4 pb-4">
        <h2 className="font-display text-xl font-extrabold leading-tight tracking-[-0.03em]">
          {project.title}
        </h2>
        <div className="mt-1.5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={11} />
            {project.shootDate ? formatDate(project.shootDate) : "Date à définir"}
          </span>
          <span>{project.sections.length} sections</span>
        </div>
      </div>

      <MiniPlan project={project} />

      <div className="mt-auto px-4 pb-4 pt-3">
        <div className="mb-1.5 flex items-end justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {progress.done}/{progress.total} plans tournés
          </span>
          <span className="font-mono text-[10px] text-muted">
            {formatDuration(duration)}
          </span>
        </div>
        <ProgressBar value={progress.percent} tone={progress.percent === 100 ? "green" : "orange"} />
        <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            {project.room.scaleMode === "echelle" ? "Plan à l'échelle" : "Plan indicatif"}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink">
            Ouvrir <ArrowUpRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { data, createProject, deleteProject } = useStore();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const sorted = useMemo(() => {
    const today = todayISO();
    return [...data.projects].sort((a, b) => {
      const aUpcoming = a.shootDate >= today;
      const bUpcoming = b.shootDate >= today;
      if (aUpcoming && bUpcoming) return a.shootDate.localeCompare(b.shootDate);
      if (!aUpcoming && !bUpcoming) return b.shootDate.localeCompare(a.shootDate);
      return aUpcoming ? -1 : 1;
    });
  }, [data.projects]);

  const next = sorted.find((project) => project.shootDate >= todayISO());

  return (
    <div className="min-h-screen bg-paper">
      <header className="no-print border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-7 w-7 items-center justify-center border border-ink">
              <span className="h-2 w-2 bg-orange" />
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-rec" />
            </span>
            <span className="font-display text-sm font-black tracking-[0.16em]">
              SCENOPIA
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/materiel"
              className="inline-flex h-9 items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
            >
              <Clapperboard size={13} />
              Matériel
            </Link>
            <Link
              href="/reglages"
              className="inline-flex h-9 items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
            >
              <Settings2 size={13} />
              Données
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Tableau de bord
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              Tournages
            </h1>
            <p className="mt-2 text-sm text-muted">
              {data.projects.length === 0
                ? "Tout commence par un premier tournage."
                : `${data.projects.length} tournage${data.projects.length > 1 ? "s" : ""} dans ton second cerveau.`}
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setCreating(true)}>
            <Plus size={16} />
            Nouveau tournage
          </Button>
        </div>

        {next ? (
          <Link
            href={`/project/${next.id}?tab=aujourdhui`}
            className="group mt-8 flex flex-col justify-between gap-4 border border-ink bg-ink px-5 py-4 text-paper transition-colors hover:bg-graphite sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center border border-paper/20">
                <CalendarDays size={18} className="text-orange" />
              </span>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/50">
                  Prochain tournage
                </div>
                <div className="font-display text-lg font-bold tracking-tight">
                  {next.title}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-6 sm:justify-end">
              <div className="text-right">
                <div className="font-mono text-sm text-orange">
                  {next.shootDate === todayISO() ? "Aujourd'hui" : formatDate(next.shootDate)}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">
                  Ouvrir le mode plateau
                </div>
              </div>
              <ArrowUpRight
                size={18}
                className="text-paper/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange"
              />
            </div>
          </Link>
        ) : null}

        {sorted.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<Clapperboard size={22} />}
              title="Aucun tournage pour l'instant"
              description="Crée ton premier tournage : tu y mettras tes questions, tes plans, ta salle et ta journée."
              action={
                <Button variant="primary" onClick={() => setCreating(true)}>
                  <Plus size={16} />
                  Créer mon premier tournage
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={setToDelete} />
            ))}
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex min-h-56 flex-col items-center justify-center gap-2 border border-dashed border-line text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <Plus size={20} />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                Nouveau tournage
              </span>
            </button>
          </div>
        )}

        <footer className="mt-16 flex flex-col gap-2 border-t border-line pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Database size={11} />
            Données enregistrées sur cet appareil
          </span>
          <span>Scenopia — le second cerveau du tournage</span>
        </footer>
      </main>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Nouveau tournage"
        eyebrow="Créer"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const id = createProject(title, date);
                setCreating(false);
                setTitle("");
                setDate("");
                router.push(`/project/${id}`);
              }}
            >
              Créer le tournage
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Titre">
            <Input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Portrait de métier — épisode 2"
            />
          </Field>
          <Field label="Date de tournage" hint="Tu pourras la modifier plus tard.">
            <Input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Supprimer ce tournage ?"
        eyebrow="Action définitive"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (toDelete) deleteProject(toDelete.id);
                setToDelete(null);
              }}
            >
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          « {toDelete?.title} » sera supprimé de cet appareil. Cette action ne peut pas
          être annulée.
        </p>
      </Modal>
    </div>
  );
}
