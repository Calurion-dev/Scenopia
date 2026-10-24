"use client";

import {
  ArrowDown,
  ArrowUp,
  Clapperboard,
  Copy,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  EmptyState,
  Field,
  IconButton,
  PageHeader,
  Pill,
  ProgressBar,
  Segmented,
  Select,
  Textarea,
  cn,
  type PillTone,
} from "@/components/ui";
import {
  formatDuration,
  SHOT_STATUS_LABELS,
  shotProgress,
  totalShotsDuration,
} from "@/lib/format";
import { uid } from "@/lib/room";
import type { Shot, ShotStatus } from "@/lib/types";
import { moveItem, type ProjectViewProps } from "./shared";

type Filter = "tous" | "a_tourner" | "tourne" | "a_refaire";

const SHOT_SIZES = ["Large", "Moyen", "Américain", "Gros", "Très gros", "Insert"];
const ANGLES = ["Face", "3/4", "Profil", "Plongée", "Contre-plongée", "Dos"];
const MOVEMENTS = ["Fixe", "Panoramique", "Travelling", "Zoom", "Épaule"];

const statusTone: Record<ShotStatus, PillTone> = {
  a_tourner: "neutral",
  tourne: "green",
  a_refaire: "amber",
  abandonne: "red",
};

function renumber(shots: Shot[]): Shot[] {
  return shots.map((shot, index) => ({ ...shot, number: index + 1 }));
}

export function PlansView({ project, update }: ProjectViewProps) {
  const [filter, setFilter] = useState<Filter>("tous");
  const progress = shotProgress(project.shots);
  const duration = totalShotsDuration(project.shots);
  const cameras = project.room.elements.filter((element) => element.kind === "camera");

  const visible = useMemo(() => {
    if (filter === "tous") return project.shots;
    return project.shots.filter((shot) => shot.status === filter);
  }, [filter, project.shots]);

  function patchShot(id: string, patch: Partial<Shot>) {
    update((current) => ({
      ...current,
      shots: current.shots.map((shot) => (shot.id === id ? { ...shot, ...patch } : shot)),
    }));
  }

  function addShot() {
    update((current) => ({
      ...current,
      shots: [
        ...current.shots,
        {
          id: uid(),
          number: current.shots.length + 1,
          description: "Nouveau plan",
          sectionId: current.sections[0]?.id ?? null,
          questionId: null,
          shotSize: "Moyen",
          angle: "Face",
          movement: "Fixe",
          lensMm: 50,
          durationMin: 2,
          cameraElementId: null,
          status: "a_tourner",
          notes: "",
        },
      ],
    }));
  }

  function duplicateShot(shot: Shot) {
    update((current) => {
      const index = current.shots.findIndex((item) => item.id === shot.id);
      const copy: Shot = {
        ...shot,
        id: uid(),
        number: current.shots.length + 1,
        description: `${shot.description} (copie)`,
        status: "a_tourner",
      };
      const next = [...current.shots];
      next.splice(index + 1, 0, copy);
      return { ...current, shots: renumber(next) };
    });
  }

  function deleteShot(shot: Shot) {
    update((current) => ({
      ...current,
      shots: renumber(current.shots.filter((item) => item.id !== shot.id)),
      blocks: current.blocks.map((block) =>
        block.shotId === shot.id ? { ...block, shotId: null } : block,
      ),
    }));
  }

  function moveShot(index: number, direction: -1 | 1) {
    update((current) => ({
      ...current,
      shots: renumber(moveItem(current.shots, index, index + direction)),
    }));
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Plans"
        title="Liste de plans"
        description="Ce que tu dois filmer, dans l'ordre. Chaque plan est lié à une question et, si tu veux, à une caméra du plan de salle."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer size={15} />
              Imprimer
            </Button>
            <Button variant="primary" onClick={addShot}>
              <Plus size={15} />
              Plan
            </Button>
          </>
        }
      />

      <div className="mt-5 border border-line bg-white/40 px-4 py-3.5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-end gap-5">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                Progression
              </div>
              <div className="font-display text-2xl font-extrabold tracking-tight">
                {progress.done}
                <span className="text-muted"> / {progress.total}</span>
              </div>
            </div>
            <div className="pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {progress.percent}% tourné
            </div>
            <div className="pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {formatDuration(duration)} de matière
            </div>
          </div>
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "tous", label: "Tous" },
              { value: "a_tourner", label: "À tourner" },
              { value: "tourne", label: "Tournés" },
              { value: "a_refaire", label: "À refaire" },
            ]}
          />
        </div>
        <ProgressBar
          value={progress.percent}
          tone={progress.percent === 100 ? "green" : "orange"}
          className="mt-3"
        />
      </div>

      <div className="mt-6 space-y-3 print:hidden">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Clapperboard size={22} />}
            title={project.shots.length === 0 ? "Aucun plan" : "Aucun plan dans ce filtre"}
            description={
              project.shots.length === 0
                ? "Ajoute ton premier plan : une valeur de plan, un axe, une optique, une durée."
                : "Change de filtre ou ajoute un nouveau plan."
            }
            action={
              <Button variant="primary" onClick={addShot}>
                <Plus size={15} />
                Ajouter un plan
              </Button>
            }
          />
        ) : null}

        {visible.map((shot) => {
          const index = project.shots.findIndex((item) => item.id === shot.id);
          const section = project.sections.find((item) => item.id === shot.sectionId);
          const questions = section?.questions ?? [];

          return (
            <article key={shot.id} className="border border-line bg-white/45">
              <div className="flex items-start gap-3 p-3.5 sm:p-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center bg-ink text-paper">
                  <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-paper/40">
                    Plan
                  </span>
                  <span className="slate-number text-lg font-semibold leading-none">
                    {String(shot.number).padStart(2, "0")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <input
                    value={shot.description}
                    onChange={(event) =>
                      patchShot(shot.id, { description: event.target.value })
                    }
                    aria-label="Description du plan"
                    className="w-full bg-transparent font-display text-base font-bold tracking-tight outline-none placeholder:text-muted/40 sm:text-lg"
                    placeholder="Décrire le plan"
                  />
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Pill tone={statusTone[shot.status]}>
                      {SHOT_STATUS_LABELS[shot.status]}
                    </Pill>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                      {shot.shotSize} · {shot.angle} · {shot.lensMm} mm ·{" "}
                      {formatDuration(shot.durationMin)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Select
                    value={shot.status}
                    onChange={(event) =>
                      patchShot(shot.id, { status: event.target.value as ShotStatus })
                    }
                    aria-label="Statut du plan"
                    className={cn(
                      "hidden h-8 w-28 sm:block",
                      shot.status === "tourne" && "border-success/40 text-success",
                      shot.status === "a_refaire" && "border-amber/50 text-[#9A6618]",
                    )}
                  >
                    {Object.entries(SHOT_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                  <div className="flex items-center">
                    <IconButton
                      label="Monter le plan"
                      className="h-8 w-8"
                      disabled={index === 0}
                      onClick={() => moveShot(index, -1)}
                    >
                      <ArrowUp size={13} />
                    </IconButton>
                    <IconButton
                      label="Descendre le plan"
                      className="h-8 w-8"
                      disabled={index === project.shots.length - 1}
                      onClick={() => moveShot(index, 1)}
                    >
                      <ArrowDown size={13} />
                    </IconButton>
                    <IconButton
                      label="Dupliquer le plan"
                      className="h-8 w-8"
                      onClick={() => duplicateShot(shot)}
                    >
                      <Copy size={13} />
                    </IconButton>
                    <IconButton
                      label="Supprimer le plan"
                      className="h-8 w-8 hover:text-danger"
                      onClick={() => deleteShot(shot)}
                    >
                      <Trash2 size={13} />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-line/60 px-3.5 py-3 sm:grid-cols-4 sm:px-4">
                <Field label="Valeur">
                  <Select
                    value={shot.shotSize}
                    onChange={(event) => patchShot(shot.id, { shotSize: event.target.value })}
                  >
                    {SHOT_SIZES.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Angle">
                  <Select
                    value={shot.angle}
                    onChange={(event) => patchShot(shot.id, { angle: event.target.value })}
                  >
                    {ANGLES.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Mouvement">
                  <Select
                    value={shot.movement}
                    onChange={(event) =>
                      patchShot(shot.id, { movement: event.target.value })
                    }
                  >
                    {MOVEMENTS.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Optique">
                    <div className="relative">
                      <input
                        type="number"
                        min={8}
                        max={400}
                        value={shot.lensMm}
                        onChange={(event) =>
                          patchShot(shot.id, {
                            lensMm: Math.max(1, Number(event.target.value) || 0),
                          })
                        }
                        className="h-9 w-full border border-line bg-white/60 px-2 pr-7 font-mono text-xs outline-none focus:border-ink"
                      />
                      <span className="pointer-events-none absolute right-2 top-2.5 font-mono text-[9px] text-muted">
                        mm
                      </span>
                    </div>
                  </Field>
                  <Field label="Durée">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={shot.durationMin}
                        onChange={(event) =>
                          patchShot(shot.id, {
                            durationMin: Math.max(0, Number(event.target.value) || 0),
                          })
                        }
                        className="h-9 w-full border border-line bg-white/60 px-2 pr-7 font-mono text-xs outline-none focus:border-ink"
                      />
                      <span className="pointer-events-none absolute right-2 top-2.5 font-mono text-[9px] text-muted">
                        min
                      </span>
                    </div>
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 border-t border-line/60 px-3.5 py-3 sm:grid-cols-3 sm:px-4">
                <Field label="Section">
                  <Select
                    value={shot.sectionId ?? ""}
                    onChange={(event) =>
                      patchShot(shot.id, {
                        sectionId: event.target.value || null,
                        questionId: null,
                      })
                    }
                  >
                    <option value="">Non rattaché</option>
                    {project.sections.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Question">
                  <Select
                    value={shot.questionId ?? ""}
                    onChange={(event) =>
                      patchShot(shot.id, { questionId: event.target.value || null })
                    }
                    disabled={!section}
                  >
                    <option value="">Toute la section</option>
                    {questions.map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.text || "Question sans texte"}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Caméra">
                  <Select
                    value={shot.cameraElementId ?? ""}
                    onChange={(event) =>
                      patchShot(shot.id, { cameraElementId: event.target.value || null })
                    }
                  >
                    <option value="">Non assignée</option>
                    {cameras.map((camera) => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="border-t border-line/60 px-3.5 py-3 sm:px-4">
                <Textarea
                  value={shot.notes}
                  onChange={(event) => patchShot(shot.id, { notes: event.target.value })}
                  placeholder="Note de mise en scène, accessoire, lumière, point de vigilance…"
                  className="min-h-14 bg-transparent text-xs"
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden print:block">
        <div className="mb-5 border-b border-black pb-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Scenopia — Liste de plans
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold">{project.title}</h2>
          <div className="mt-1 font-mono text-[10px]">
            {project.shootDate} · {progress.done}/{progress.total} tournés ·{" "}
            {formatDuration(duration)}
          </div>
        </div>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1 pr-2 font-mono">N°</th>
              <th className="py-1 pr-2 font-mono">Plan</th>
              <th className="py-1 pr-2 font-mono">Valeur</th>
              <th className="py-1 pr-2 font-mono">Optique</th>
              <th className="py-1 pr-2 font-mono">Durée</th>
              <th className="py-1 font-mono">Statut</th>
            </tr>
          </thead>
          <tbody>
            {project.shots.map((shot) => (
              <tr key={shot.id} className="border-b border-neutral-300 align-top">
                <td className="py-1.5 pr-2 font-mono">
                  {String(shot.number).padStart(2, "0")}
                </td>
                <td className="py-1.5 pr-2">
                  {shot.description}
                  {shot.notes ? (
                    <div className="text-[10px] text-neutral-500">{shot.notes}</div>
                  ) : null}
                </td>
                <td className="py-1.5 pr-2">{shot.shotSize}</td>
                <td className="py-1.5 pr-2">{shot.lensMm} mm</td>
                <td className="py-1.5 pr-2">{shot.durationMin} min</td>
                <td className="py-1.5">{SHOT_STATUS_LABELS[shot.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
