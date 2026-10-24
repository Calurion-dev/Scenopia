"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarClock,
  Check,
  Clapperboard,
  Coffee,
  MoreHorizontal,
  PackageOpen,
  Play,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  Button,
  EmptyState,
  Field,
  IconButton,
  Input,
  PageHeader,
  Pill,
  Select,
  Textarea,
  cn,
  type PillTone,
} from "@/components/ui";
import {
  BLOCK_TYPE_LABELS,
  formatDuration,
  minutesToTime,
  scheduleWithTimes,
  timeToMinutes,
} from "@/lib/format";
import { uid } from "@/lib/room";
import type {
  BlockStatus,
  BlockType,
  Project,
  ScheduleBlock,
} from "@/lib/types";
import { moveItem, type ProjectViewProps } from "./shared";

const TYPE_ICONS: Record<BlockType, LucideIcon> = {
  installation: Wrench,
  tournage: Clapperboard,
  pause: Coffee,
  repas: Utensils,
  demontage: PackageOpen,
  autre: MoreHorizontal,
};

const TYPE_STYLES: Record<BlockType, string> = {
  installation: "border-cyan/40 bg-cyan/10 text-[#2E7A8C]",
  tournage: "border-orange/40 bg-orange/10 text-orange",
  pause: "border-amber/40 bg-amber/10 text-[#9A6618]",
  repas: "border-amber/40 bg-amber/10 text-[#9A6618]",
  demontage: "border-line bg-paper2 text-muted",
  autre: "border-line bg-paper2 text-muted",
};

const TYPE_BARS: Record<BlockType, string> = {
  installation: "bg-cyan",
  tournage: "bg-orange",
  pause: "bg-amber",
  repas: "bg-[#C98A2E]",
  demontage: "bg-[#8C948F]",
  autre: "bg-[#B7BDB6]",
};

const STATUS_TONES: Record<BlockStatus, PillTone> = {
  a_venir: "neutral",
  en_cours: "orange",
  termine: "green",
};

export function PlanningView({ project, update }: ProjectViewProps) {
  const timed = scheduleWithTimes(project.blocks, project.dayStart);
  const total = project.blocks.reduce(
    (sum, block) => sum + Math.max(0, block.durationMin),
    0,
  );
  const startMin = timeToMinutes(project.dayStart);
  const endMin = startMin + total;
  const dayEndMin = timeToMinutes(project.dayEnd);
  const overrun = Math.max(0, endMin - dayEndMin);
  const span = Math.max(endMin, dayEndMin, startMin + 1) - startMin;

  function patchProject(patch: Partial<Project>) {
    update((current) => ({ ...current, ...patch }));
  }

  function patchBlock(id: string, patch: Partial<ScheduleBlock>) {
    update((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === id ? { ...block, ...patch } : block,
      ),
    }));
  }

  function addBlock() {
    const block: ScheduleBlock = {
      id: uid(),
      type: "tournage",
      title: "Nouveau bloc",
      durationMin: 15,
      sectionId: project.sections[0]?.id ?? null,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    };
    update((current) => ({ ...current, blocks: [...current.blocks, block] }));
  }

  function deleteBlock(block: ScheduleBlock) {
    update((current) => ({
      ...current,
      blocks: current.blocks.filter((item) => item.id !== block.id),
    }));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    update((current) => ({
      ...current,
      blocks: moveItem(current.blocks, index, index + direction),
    }));
  }

  function toggleStatus(block: ScheduleBlock) {
    const now = new Date().toISOString();
    if (block.status === "a_venir") {
      patchBlock(block.id, { status: "en_cours", startedAt: now, endedAt: null });
    } else if (block.status === "en_cours") {
      patchBlock(block.id, { status: "termine", endedAt: now });
    } else {
      patchBlock(block.id, { status: "a_venir", startedAt: null, endedAt: null });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Planning"
        title="La journée"
        description="Une seule journée, heure par heure. Les heures se recalculent quand tu changes une durée."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer size={15} />
              Imprimer
            </Button>
            <Button variant="primary" onClick={addBlock}>
              <Plus size={15} />
              Bloc
            </Button>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-1 divide-y divide-line border border-line bg-white/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <label className="flex items-center gap-3 px-4 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            Date
          </span>
          <input
            type="date"
            value={project.shootDate}
            onChange={(event) => patchProject({ shootDate: event.target.value })}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none"
          />
        </label>
        <label className="flex items-center gap-3 px-4 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            Début
          </span>
          <input
            type="time"
            value={project.dayStart}
            onChange={(event) => patchProject({ dayStart: event.target.value })}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none"
          />
        </label>
        <label className="flex items-center gap-3 px-4 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            Fin
          </span>
          <input
            type="time"
            value={project.dayEnd}
            onChange={(event) => patchProject({ dayEnd: event.target.value })}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none"
          />
        </label>
      </div>

      <div className="mt-4 border border-line bg-white/40 px-4 py-3.5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-end gap-5">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                Fin prévue
              </div>
              <div className="font-display text-2xl font-extrabold tracking-tight">
                {minutesToTime(endMin)}
              </div>
            </div>
            <div className="pb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {formatDuration(total)} de journée
            </div>
            <div
              className={cn(
                "pb-1 font-mono text-[10px] uppercase tracking-[0.1em]",
                overrun > 0 ? "text-danger" : "text-success",
              )}
            >
              {overrun > 0
                ? `+${formatDuration(overrun)} de dépassement`
                : `${formatDuration(dayEndMin - endMin)} de marge`}
            </div>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            {project.blocks.length} blocs
          </div>
        </div>

        <div className="mt-3 flex h-3 w-full overflow-hidden border border-line bg-white/70">
          {timed.map(({ block, start, end }) => (
            <div
              key={block.id}
              className={cn("h-full border-r border-white/50", TYPE_BARS[block.type])}
              style={{ width: `${((end - start) / span) * 100}%` }}
              title={`${block.title} — ${formatDuration(block.durationMin)}`}
            />
          ))}
          {overrun > 0 ? (
            <div
              className="h-full bg-danger/30"
              style={{ width: `${(overrun / span) * 100}%` }}
              title="Dépassement"
            />
          ) : null}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
          <span>{project.dayStart}</span>
          <span>{minutesToTime(Math.max(endMin, dayEndMin))}</span>
        </div>

        {overrun > 0 ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border border-danger/25 bg-danger/[0.06] px-3 py-2">
            <div className="text-xs text-danger">
              La journée dépasse de {formatDuration(overrun)}.
            </div>
            <button
              type="button"
              onClick={() => patchProject({ dayEnd: minutesToTime(endMin) })}
              className="font-mono text-[9px] uppercase tracking-[0.1em] text-danger underline underline-offset-2"
            >
              Prolonger la journée
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 print:hidden">
        {project.blocks.length === 0 ? (
          <EmptyState
            icon={<CalendarClock size={22} />}
            title="La journée est vide"
            description="Commence par l'installation, puis les blocs de tournage, les pauses et le démontage."
            action={
              <Button variant="primary" onClick={addBlock}>
                <Plus size={15} />
                Premier bloc
              </Button>
            }
          />
        ) : (
          <div>
            {timed.map(({ block, start, end }, index) => {
              const Icon = TYPE_ICONS[block.type];
              const section = project.sections.find((item) => item.id === block.sectionId);
              const shotOptions = block.sectionId
                ? project.shots.filter((shot) => shot.sectionId === block.sectionId)
                : project.shots;

              return (
                <div key={block.id} className="flex gap-2 sm:gap-3">
                  <div className="w-12 shrink-0 pt-3.5 text-right sm:w-14">
                    <div className="font-mono text-[11px] font-medium sm:text-xs">
                      {minutesToTime(start)}
                    </div>
                    <div className="font-mono text-[8px] text-muted">
                      {minutesToTime(end)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "mt-4 h-2 w-2 shrink-0 rounded-full",
                        TYPE_BARS[block.type],
                        block.status === "en_cours" && "ring-2 ring-orange/30",
                      )}
                    />
                    <span className="w-px flex-1 bg-line" />
                  </div>

                  <article
                    className={cn(
                      "mb-3 min-w-0 flex-1 border bg-white/45",
                      block.status === "en_cours"
                        ? "border-orange/50"
                        : block.status === "termine"
                          ? "border-line/80 bg-white/25"
                          : "border-line",
                    )}
                  >
                    <div className="flex items-start gap-3 p-3.5">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center border",
                          TYPE_STYLES[block.type],
                        )}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <input
                          value={block.title}
                          onChange={(event) =>
                            patchBlock(block.id, { title: event.target.value })
                          }
                          aria-label="Titre du bloc"
                          className="w-full bg-transparent font-display text-base font-bold tracking-tight outline-none placeholder:text-muted/40"
                          placeholder="Titre du bloc"
                        />
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Pill tone={STATUS_TONES[block.status]}>
                            {block.status === "a_venir"
                              ? BLOCK_TYPE_LABELS[block.type]
                              : block.status === "en_cours"
                                ? "En cours"
                                : "Terminé"}
                          </Pill>
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                            {formatDuration(block.durationMin)}
                            {section ? ` · ${section.title}` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant={block.status === "en_cours" ? "primary" : "outline"}
                          onClick={() => toggleStatus(block)}
                          className="hidden sm:inline-flex"
                        >
                          {block.status === "a_venir" ? (
                            <>
                              <Play size={12} />
                              Démarrer
                            </>
                          ) : block.status === "en_cours" ? (
                            <>
                              <Check size={13} />
                              Terminer
                            </>
                          ) : (
                            <>
                              <RotateCcw size={12} />
                              Rouvrir
                            </>
                          )}
                        </Button>
                        <div className="flex items-center">
                          <IconButton
                            label="Monter le bloc"
                            className="h-8 w-8"
                            disabled={index === 0}
                            onClick={() => moveBlock(index, -1)}
                          >
                            <ArrowUp size={13} />
                          </IconButton>
                          <IconButton
                            label="Descendre le bloc"
                            className="h-8 w-8"
                            disabled={index === project.blocks.length - 1}
                            onClick={() => moveBlock(index, 1)}
                          >
                            <ArrowDown size={13} />
                          </IconButton>
                          <IconButton
                            label="Supprimer le bloc"
                            className="h-8 w-8 hover:text-danger"
                            onClick={() => deleteBlock(block)}
                          >
                            <Trash2 size={13} />
                          </IconButton>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-line/60 px-3.5 py-3 sm:grid-cols-4">
                      <Field label="Type">
                        <Select
                          value={block.type}
                          onChange={(event) =>
                            patchBlock(block.id, {
                              type: event.target.value as BlockType,
                            })
                          }
                        >
                          {Object.entries(BLOCK_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Durée">
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={999}
                            step={5}
                            value={block.durationMin}
                            onChange={(event) =>
                              patchBlock(block.id, {
                                durationMin: Math.max(
                                  0,
                                  Number(event.target.value) || 0,
                                ),
                              })
                            }
                            className="h-9 w-full border border-line bg-white/60 px-2 pr-7 font-mono text-xs outline-none focus:border-ink"
                          />
                          <span className="pointer-events-none absolute right-2 top-2.5 font-mono text-[9px] text-muted">
                            min
                          </span>
                        </div>
                      </Field>
                      <Field label="Section">
                        <Select
                          value={block.sectionId ?? ""}
                          onChange={(event) => {
                            const sectionId = event.target.value || null;
                            const shot = project.shots.find(
                              (item) => item.id === block.shotId,
                            );
                            patchBlock(block.id, {
                              sectionId,
                              shotId:
                                shot && shot.sectionId === sectionId ? shot.id : null,
                            });
                          }}
                        >
                          <option value="">Aucune</option>
                          {project.sections.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.title}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Plan">
                        <Select
                          value={block.shotId ?? ""}
                          onChange={(event) =>
                            patchBlock(block.id, {
                              shotId: event.target.value || null,
                            })
                          }
                        >
                          <option value="">Aucun</option>
                          {shotOptions.map((shot) => (
                            <option key={shot.id} value={shot.id}>
                              {String(shot.number).padStart(2, "0")} — {shot.description}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>

                    <div className="border-t border-line/60 px-3.5 py-3">
                      <Textarea
                        value={block.notes}
                        onChange={(event) =>
                          patchBlock(block.id, { notes: event.target.value })
                        }
                        placeholder="Ce qu'il faut installer, ce qu'on tourne, le point de vigilance…"
                        className="min-h-12 bg-transparent text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-line/60 px-3.5 py-2 sm:hidden">
                      <Button
                        size="sm"
                        variant={block.status === "en_cours" ? "primary" : "outline"}
                        onClick={() => toggleStatus(block)}
                      >
                        {block.status === "a_venir" ? (
                          <>
                            <Play size={12} />
                            Démarrer
                          </>
                        ) : block.status === "en_cours" ? (
                          <>
                            <Check size={13} />
                            Terminer
                          </>
                        ) : (
                          <>
                            <RotateCcw size={12} />
                            Rouvrir
                          </>
                        )}
                      </Button>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                        {minutesToTime(start)} → {minutesToTime(end)}
                      </span>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden print:block">
        <div className="mb-5 border-b border-black pb-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Scenopia — Feuille de service
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold">{project.title}</h2>
          <div className="mt-1 font-mono text-[10px]">
            {project.shootDate} · {project.dayStart}–{minutesToTime(endMin)} ·{" "}
            {formatDuration(total)}
          </div>
        </div>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1 pr-2 font-mono">Heure</th>
              <th className="py-1 pr-2 font-mono">Durée</th>
              <th className="py-1 pr-2 font-mono">Bloc</th>
              <th className="py-1 font-mono">Note</th>
            </tr>
          </thead>
          <tbody>
            {timed.map(({ block, start, end }) => (
              <tr key={block.id} className="border-b border-neutral-300 align-top">
                <td className="py-1.5 pr-2 font-mono">
                  {minutesToTime(start)}–{minutesToTime(end)}
                </td>
                <td className="py-1.5 pr-2">{formatDuration(block.durationMin)}</td>
                <td className="py-1.5 pr-2">
                  {BLOCK_TYPE_LABELS[block.type]} — {block.title}
                </td>
                <td className="py-1.5">{block.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
