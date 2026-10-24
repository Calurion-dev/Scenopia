"use client";

import {
  CalendarClock,
  Check,
  ChevronRight,
  Clock,
  Map,
  Play,
  Plus,
  Radio,
  Square,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Pill, Segmented, Textarea, cn } from "@/components/ui";
import {
  BLOCK_TYPE_LABELS,
  formatClock,
  formatDateLong,
  formatDuration,
  minutesToTime,
  scheduleWithTimes,
  shotProgress,
  timeToMinutes,
  todayISO,
} from "@/lib/format";
import { uid } from "@/lib/room";
import type {
  ElementKind,
  ScheduleBlock,
  Shot,
} from "@/lib/types";
import type { ProjectViewProps } from "./shared";

const DOT_COLORS: Record<ElementKind, string> = {
  camera: "bg-orange",
  light: "bg-amber",
  mic: "bg-cyan",
  person: "bg-paper",
  prop: "bg-paper/40",
  other: "bg-paper/40",
};

function nowMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function TodayView({
  project,
  update,
  onNavigate,
}: ProjectViewProps & {
  onNavigate: (tab: "conducteur" | "plans" | "salle" | "planning") => void;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [shotFilter, setShotFilter] = useState<"restants" | "tous">("restants");
  const [note, setNote] = useState("");

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timed = scheduleWithTimes(project.blocks, project.dayStart);
  const current = project.blocks.find((block) => block.status === "en_cours") ?? null;
  const next = project.blocks.find((block) => block.status === "a_venir") ?? null;
  const focus = current ?? next;
  const focusTimed = focus
    ? timed.find((entry) => entry.block.id === focus.id)
    : undefined;
  const focusSection = project.sections.find(
    (section) => section.id === focus?.sectionId,
  );

  const total = project.blocks.reduce(
    (sum, block) => sum + Math.max(0, block.durationMin),
    0,
  );
  const endMin = timeToMinutes(project.dayStart) + total;
  const dayEndMin = timeToMinutes(project.dayEnd);
  const overrun = Math.max(0, endMin - dayEndMin);

  const shootDay = new Date(`${project.shootDate}T00:00:00`);
  const thisDay = new Date(`${todayISO()}T00:00:00`);
  const dayOffset = Math.round(
    (shootDay.getTime() - thisDay.getTime()) / 86_400_000,
  );

  const progress = shotProgress(project.shots);
  const remaining = project.shots.filter(
    (shot) => shot.status !== "tourne" && shot.status !== "abandonne",
  );
  const visibleShots =
    shotFilter === "tous" ? project.shots : remaining;
  const sortedShots = [...visibleShots].sort((a, b) => {
    const aFocus = a.sectionId === focus?.sectionId ? 0 : 1;
    const bFocus = b.sectionId === focus?.sectionId ? 0 : 1;
    return aFocus - bFocus || a.number - b.number;
  });

  function countdown(): { value: string; label: string } {
    if (!now || !focus || !focusTimed) {
      return { value: "--:--", label: "Aucun bloc" };
    }
    if (!project.shootDate) {
      return { value: "--:--", label: "Date à définir" };
    }
    if (dayOffset > 0) {
      return { value: `J-${dayOffset}`, label: "Avant le tournage" };
    }
    if (dayOffset < 0) {
      return { value: "—", label: "Tournage passé" };
    }
    if (current && current.startedAt) {
      const elapsed = Math.floor(
        (now.getTime() - new Date(current.startedAt).getTime()) / 1000,
      );
      const remainingSeconds = current.durationMin * 60 - elapsed;
      const absolute = Math.abs(remainingSeconds);
      const minutes = String(Math.floor(absolute / 60)).padStart(2, "0");
      const seconds = String(absolute % 60).padStart(2, "0");
      return {
        value: `${remainingSeconds < 0 ? "+" : ""}${minutes}:${seconds}`,
        label: remainingSeconds < 0 ? "Dépassement" : "Restant",
      };
    }
    const difference = Math.round(focusTimed.start - nowMinutes(now));
    if (difference <= 0) return { value: "00:00", label: "À démarrer" };
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;
    return {
      value:
        hours > 0
          ? `${hours} h ${String(minutes).padStart(2, "0")}`
          : `${minutes} min`,
      label: "Avant le bloc",
    };
  }

  const clock = countdown();

  function startBlock(block: ScheduleBlock) {
    const stamp = new Date().toISOString();
    update((currentProject) => ({
      ...currentProject,
      blocks: currentProject.blocks.map((item) =>
        item.id === block.id
          ? { ...item, status: "en_cours", startedAt: stamp, endedAt: null }
          : item.status === "en_cours"
            ? { ...item, status: "termine", endedAt: stamp }
            : item,
      ),
    }));
  }

  function finishBlock(block: ScheduleBlock) {
    const stamp = new Date().toISOString();
    update((currentProject) => ({
      ...currentProject,
      blocks: currentProject.blocks.map((item) =>
        item.id === block.id
          ? { ...item, status: "termine", endedAt: stamp }
          : item,
      ),
    }));
  }

  function toggleShot(shot: Shot) {
    update((currentProject) => ({
      ...currentProject,
      shots: currentProject.shots.map((item) =>
        item.id === shot.id
          ? {
              ...item,
              status: item.status === "tourne" ? "a_tourner" : "tourne",
            }
          : item,
      ),
    }));
  }

  function addNote() {
    const content = note.trim();
    if (!content) return;
    update((currentProject) => ({
      ...currentProject,
      dayNotes: [
        ...currentProject.dayNotes,
        { id: uid(), content, createdAt: new Date().toISOString() },
      ],
    }));
    setNote("");
  }

  return (
    <div className="min-h-screen bg-monitor text-paper">
      <header className="border-b border-monitorline px-5 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-paper/45">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rec opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rec" />
              </span>
              Mode plateau
            </div>
            <h1 className="mt-2 font-display text-3xl font-black tracking-[-0.03em] text-paper sm:text-4xl">
              {project.title}
            </h1>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
              {formatDateLong(project.shootDate)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-medium tabular-nums text-paper">
              {now ? formatClock(now) : "--:--:--"}
            </div>
            <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper/35">
              Heure locale
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-1 flex-1 bg-monitorline">
            <div
              className="h-full bg-orange transition-[width] duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/45">
            {progress.done}/{progress.total} plans
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          {focus && focusTimed ? (
            <section className="border border-monitorline bg-monitor2">
              <div className="flex items-center justify-between border-b border-monitorline px-4 py-2">
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-orange">
                  {current ? (
                    <>
                      <Radio size={11} />
                      En cours
                    </>
                  ) : (
                    <>
                      <Clock size={11} />
                      Prochain bloc
                    </>
                  )}
                </span>
                <span className="font-mono text-[10px] text-paper/40">
                  {minutesToTime(focusTimed.start)} → {minutesToTime(focusTimed.end)}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-paper">
                      {focus.title}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/45">
                      <span>{BLOCK_TYPE_LABELS[focus.type]}</span>
                      <span>{formatDuration(focus.durationMin)}</span>
                      {focusSection ? <span>{focusSection.title}</span> : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-3xl font-medium tabular-nums text-orange">
                      {clock.value}
                    </div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper/35">
                      {clock.label}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {current ? (
                    <Button variant="primary" onClick={() => finishBlock(current)}>
                      <Square size={13} />
                      Terminer le bloc
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => startBlock(focus)}>
                      <Play size={14} />
                      Démarrer
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-paper/25 text-paper hover:bg-white/10"
                    onClick={() => onNavigate("salle")}
                  >
                    <Map size={14} />
                    Plan de salle
                  </Button>
                  <Button
                    variant="outline"
                    className="border-paper/25 text-paper hover:bg-white/10"
                    onClick={() => onNavigate("planning")}
                  >
                    <CalendarClock size={14} />
                    Planning
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            <section className="border border-monitorline bg-monitor2 p-5">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-success">
                <Check size={13} />
                Journée terminée
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-paper">
                Tout est bouclé.
              </h2>
              <p className="mt-1 text-sm text-paper/50">
                Plus aucun bloc à venir. Tu peux encore cocher un plan ou ajouter une
                note de journée.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-paper/25 text-paper hover:bg-white/10"
                onClick={() => onNavigate("planning")}
              >
                <CalendarClock size={14} />
                Revoir le planning
              </Button>
            </section>
          )}

          <section className="border border-monitorline">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-monitorline px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
                  Plans
                </span>
                <span className="font-mono text-[10px] text-paper/30">
                  {remaining.length} restants
                </span>
              </div>
              <Segmented
                value={shotFilter}
                onChange={setShotFilter}
                options={[
                  { value: "restants", label: "Restants" },
                  { value: "tous", label: "Tous" },
                ]}
                className="border-paper/20 bg-transparent"
              />
            </div>

            {sortedShots.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center border border-success/50 text-success">
                  <Check size={18} />
                </div>
                <p className="mt-3 text-sm text-paper/55">
                  {project.shots.length === 0
                    ? "Aucun plan pour ce tournage."
                    : "Tous les plans sont tournés."}
                </p>
              </div>
            ) : (
              <div>
                {sortedShots.map((shot) => (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={() => toggleShot(shot)}
                    className="flex w-full items-center gap-3 border-b border-monitorline px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center border transition-colors",
                        shot.status === "tourne"
                          ? "border-success bg-success text-white"
                          : "border-paper/30 text-transparent",
                      )}
                    >
                      <Check size={15} />
                    </span>
                    <span className="w-6 shrink-0 font-mono text-[10px] text-paper/30">
                      {String(shot.number).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm",
                          shot.status === "tourne"
                            ? "text-paper/35 line-through"
                            : "text-paper",
                        )}
                      >
                        {shot.description}
                      </span>
                      <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-paper/35">
                        {shot.shotSize} · {shot.lensMm} mm ·{" "}
                        {formatDuration(shot.durationMin)}
                      </span>
                    </span>
                    {shot.status === "a_refaire" ? (
                      <Pill tone="amber">À refaire</Pill>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="grid grid-cols-2 gap-px border border-monitorline bg-monitorline">
            <div className="bg-monitor2 p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">
                Fin prévue
              </div>
              <div className="mt-0.5 font-mono text-lg text-paper">
                {minutesToTime(endMin)}
              </div>
            </div>
            <div className="bg-monitor2 p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">
                {overrun > 0 ? "Dépassement" : "Marge"}
              </div>
              <div
                className={cn(
                  "mt-0.5 font-mono text-lg",
                  overrun > 0 ? "text-danger" : "text-success",
                )}
              >
                {overrun > 0
                  ? `+${formatDuration(overrun)}`
                  : formatDuration(dayEndMin - endMin)}
              </div>
            </div>
            <div className="bg-monitor2 p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">
                Blocs restants
              </div>
              <div className="mt-0.5 font-mono text-lg text-paper">
                {
                  project.blocks.filter((block) => block.status !== "termine")
                    .length
                }
              </div>
            </div>
            <div className="bg-monitor2 p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">
                Progression
              </div>
              <div className="mt-0.5 font-mono text-lg text-paper">
                {progress.percent}%
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("salle")}
            className="group block w-full border border-monitorline bg-[#0B1418] text-left"
          >
            <div className="flex items-center justify-between border-b border-monitorline px-3 py-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper/45">
                Plan de salle
              </span>
              <ChevronRight
                size={13}
                className="text-paper/30 transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              {project.room.image ? (
                <img
                  src={project.room.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
                  Aucun plan importé
                </div>
              )}
              {project.room.elements.map((element) => (
                <span
                  key={element.id}
                  className={cn(
                    "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/40",
                    DOT_COLORS[element.kind],
                  )}
                  style={{
                    left: `${element.x * 100}%`,
                    top: `${element.y * 100}%`,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-paper/35">
              <span>{project.room.elements.length} éléments</span>
              <span>{project.room.name}</span>
            </div>
          </button>

          <section className="border border-monitorline">
            <div className="flex items-center justify-between border-b border-monitorline px-3 py-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper/45">
                Notes de journée
              </span>
              <span className="font-mono text-[9px] text-paper/25">
                {project.dayNotes.length}
              </span>
            </div>
            <div className="space-y-3 p-3">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Imprévu, idée, chose à refaire…"
                className="min-h-16 !border-paper/15 !bg-monitor !text-xs !text-paper placeholder:!text-paper/25 focus:!border-orange"
              />
              <Button
                size="sm"
                variant="outline"
                className="w-full border-paper/20 text-paper hover:bg-white/10"
                onClick={addNote}
              >
                <Plus size={13} />
                Ajouter la note
              </Button>

              {project.dayNotes.length > 0 ? (
                <div className="space-y-2 border-t border-monitorline pt-3">
                  {project.dayNotes.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-start gap-2 border-l border-paper/15 pl-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-paper/30">
                          {new Date(entry.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-paper/75">
                          {entry.content}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Supprimer la note"
                        onClick={() =>
                          update((currentProject) => ({
                            ...currentProject,
                            dayNotes: currentProject.dayNotes.filter(
                              (item) => item.id !== entry.id,
                            ),
                          }))
                        }
                        className="mt-2 text-paper/20 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-paper/25">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Enregistré sur cet appareil
          </div>
        </aside>
      </div>
    </div>
  );
}
