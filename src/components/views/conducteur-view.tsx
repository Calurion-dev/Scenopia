"use client";

import {
  ArrowDown,
  ArrowUp,
  ListChecks,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  Button,
  EmptyState,
  IconButton,
  Modal,
  PageHeader,
  cn,
} from "@/components/ui";
import {
  formatDuration,
  totalSectionDuration,
} from "@/lib/format";
import { uid } from "@/lib/room";
import type { Question, Section } from "@/lib/types";
import { moveItem, type ProjectViewProps } from "./shared";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-bold tracking-tight">{value}</div>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <input
      type="number"
      min={0}
      max={999}
      value={value}
      onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
      className={cn(
        "h-7 w-12 border border-line bg-white/50 px-1 text-center font-mono text-[10px] outline-none focus:border-ink",
        className,
      )}
    />
  );
}

export function ConducteurView({ project, update }: ProjectViewProps) {
  const [pendingDelete, setPendingDelete] = useState<Section | null>(null);
  const total = totalSectionDuration(project.sections);
  const questionCount = project.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0,
  );

  function patchSection(sectionId: string, patch: Partial<Section>) {
    update((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section,
      ),
    }));
  }

  function patchQuestion(sectionId: string, questionId: string, patch: Partial<Question>) {
    update((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? { ...question, ...patch } : question,
              ),
            }
          : section,
      ),
    }));
  }

  function addSection() {
    update((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          id: uid(),
          title: `Section ${current.sections.length + 1}`,
          notes: "",
          plannedMinutes: 5,
          questions: [],
        },
      ],
    }));
  }

  function addQuestion(sectionId: string) {
    update((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                { id: uid(), text: "", notes: "", plannedMinutes: 2 },
              ],
            }
          : section,
      ),
    }));
  }

  function deleteSection(section: Section) {
    update((current) => ({
      ...current,
      sections: current.sections.filter((item) => item.id !== section.id),
      shots: current.shots.map((shot) =>
        shot.sectionId === section.id
          ? { ...shot, sectionId: null, questionId: null }
          : shot,
      ),
    }));
    setPendingDelete(null);
  }

  function deleteQuestion(sectionId: string, questionId: string) {
    update((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter(
                (question) => question.id !== questionId,
              ),
            }
          : section,
      ),
      shots: current.shots.map((shot) =>
        shot.questionId === questionId ? { ...shot, questionId: null } : shot,
      ),
    }));
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Conducteur"
        title="Les questions"
        description="La trame de l'interview, section par section. Chaque question peut porter une note de relance."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer size={15} />
              Imprimer
            </Button>
            <Button variant="primary" onClick={addSection}>
              <Plus size={15} />
              Section
            </Button>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-3 divide-x divide-line border border-line bg-white/40">
        <Stat label="Sections" value={String(project.sections.length).padStart(2, "0")} />
        <Stat label="Questions" value={String(questionCount).padStart(2, "0")} />
        <Stat label="Durée prévue" value={formatDuration(total)} />
      </div>

      <div className="mt-6 space-y-4 print:hidden">
        {project.sections.length === 0 ? (
          <EmptyState
            icon={<ListChecks size={22} />}
            title="Le conducteur est vide"
            description="Commence par une section, puis ajoute les questions dans l'ordre où tu veux les poser."
            action={
              <Button variant="primary" onClick={addSection}>
                <Plus size={15} />
                Première section
              </Button>
            }
          />
        ) : null}

        {project.sections.map((section, sectionIndex) => {
          const sectionTotal =
            section.plannedMinutes +
            section.questions.reduce((sum, question) => sum + question.plannedMinutes, 0);

          return (
            <section
              key={section.id}
              className="print-block border border-line bg-white/45"
            >
              <div className="flex items-start gap-3 border-b border-line px-4 py-3.5 sm:px-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-ink font-mono text-[11px] text-paper">
                  {String(sectionIndex + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <input
                    value={section.title}
                    onChange={(event) =>
                      patchSection(section.id, { title: event.target.value })
                    }
                    aria-label="Titre de la section"
                    className="w-full bg-transparent font-display text-lg font-bold tracking-tight outline-none placeholder:text-muted/40"
                    placeholder="Titre de la section"
                  />
                  <input
                    value={section.notes}
                    onChange={(event) =>
                      patchSection(section.id, { notes: event.target.value })
                    }
                    aria-label="Intention de la section"
                    className="mt-0.5 w-full bg-transparent text-xs text-muted outline-none placeholder:text-muted/40"
                    placeholder="Intention, ton, ce qu'il faut obtenir…"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden text-right sm:block">
                    <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                      Total
                    </div>
                    <div className="font-mono text-[11px]">{formatDuration(sectionTotal)}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <IconButton
                      label="Monter la section"
                      disabled={sectionIndex === 0}
                      onClick={() =>
                        update((current) => ({
                          ...current,
                          sections: moveItem(
                            current.sections,
                            sectionIndex,
                            sectionIndex - 1,
                          ),
                        }))
                      }
                    >
                      <ArrowUp size={14} />
                    </IconButton>
                    <IconButton
                      label="Descendre la section"
                      disabled={sectionIndex === project.sections.length - 1}
                      onClick={() =>
                        update((current) => ({
                          ...current,
                          sections: moveItem(
                            current.sections,
                            sectionIndex,
                            sectionIndex + 1,
                          ),
                        }))
                      }
                    >
                      <ArrowDown size={14} />
                    </IconButton>
                    <IconButton
                      label="Supprimer la section"
                      className="hover:text-danger"
                      onClick={() => setPendingDelete(section)}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-5">
                {section.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="group flex items-start gap-2 border-b border-line/60 py-2.5 last:border-b-0"
                  >
                    <span className="mt-1.5 w-7 shrink-0 font-mono text-[10px] text-muted">
                      {sectionIndex + 1}.{questionIndex + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <input
                        value={question.text}
                        onChange={(event) =>
                          patchQuestion(section.id, question.id, {
                            text: event.target.value,
                          })
                        }
                        aria-label="Question"
                        className="w-full bg-transparent py-0.5 text-sm outline-none placeholder:text-muted/40"
                        placeholder="Écrire la question…"
                      />
                      <input
                        value={question.notes}
                        onChange={(event) =>
                          patchQuestion(section.id, question.id, {
                            notes: event.target.value,
                          })
                        }
                        aria-label="Note de relance"
                        className="w-full bg-transparent text-xs text-muted outline-none placeholder:text-muted/35"
                        placeholder="Note, relance, mot-clé…"
                      />
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <NumberInput
                        value={question.plannedMinutes}
                        onChange={(value) =>
                          patchQuestion(section.id, question.id, {
                            plannedMinutes: value,
                          })
                        }
                      />
                      <span className="hidden font-mono text-[9px] text-muted sm:inline">
                        min
                      </span>
                      <div className="flex items-center opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        <IconButton
                          label="Monter la question"
                          className="h-7 w-7"
                          disabled={questionIndex === 0}
                          onClick={() =>
                            update((current) => ({
                              ...current,
                              sections: current.sections.map((item) =>
                                item.id === section.id
                                  ? {
                                      ...item,
                                      questions: moveItem(
                                        item.questions,
                                        questionIndex,
                                        questionIndex - 1,
                                      ),
                                    }
                                  : item,
                              ),
                            }))
                          }
                        >
                          <ArrowUp size={12} />
                        </IconButton>
                        <IconButton
                          label="Descendre la question"
                          className="h-7 w-7"
                          disabled={questionIndex === section.questions.length - 1}
                          onClick={() =>
                            update((current) => ({
                              ...current,
                              sections: current.sections.map((item) =>
                                item.id === section.id
                                  ? {
                                      ...item,
                                      questions: moveItem(
                                        item.questions,
                                        questionIndex,
                                        questionIndex + 1,
                                      ),
                                    }
                                  : item,
                              ),
                            }))
                          }
                        >
                          <ArrowDown size={12} />
                        </IconButton>
                        <IconButton
                          label="Supprimer la question"
                          className="h-7 w-7 hover:text-danger"
                          onClick={() => deleteQuestion(section.id, question.id)}
                        >
                          <Trash2 size={12} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-4 py-2.5 sm:px-5">
                <button
                  type="button"
                  onClick={() => addQuestion(section.id)}
                  className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-orange"
                >
                  <Plus size={12} />
                  Ajouter une question
                </button>
                <label className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  Marge
                  <NumberInput
                    value={section.plannedMinutes}
                    onChange={(value) =>
                      patchSection(section.id, { plannedMinutes: value })
                    }
                    className="h-6 w-10"
                  />
                  min
                </label>
              </div>
            </section>
          );
        })}
      </div>

      {/* Version imprimable, volontairement sans champs de formulaire. */}
      <div className="hidden print:block">
        <div className="mb-6 border-b border-black pb-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Scenopia — Conducteur
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold">{project.title}</h2>
          <div className="mt-1 font-mono text-[10px]">
            {project.shootDate} · {formatDuration(total)} · {questionCount} questions
          </div>
        </div>
        {project.sections.map((section, index) => (
          <div key={section.id} className="mb-5 break-inside-avoid">
            <h3 className="font-display text-base font-bold">
              {String(index + 1).padStart(2, "0")} — {section.title}
            </h3>
            {section.notes ? (
              <p className="mb-1 text-xs italic text-neutral-600">{section.notes}</p>
            ) : null}
            <ol className="mt-2 space-y-1">
              {section.questions.map((question) => (
                <li key={question.id} className="text-sm">
                  <span className="mr-2 font-mono text-[10px] text-neutral-500">
                    {question.plannedMinutes} min
                  </span>
                  {question.text}
                  {question.notes ? (
                    <span className="ml-2 text-xs text-neutral-500">
                      ({question.notes})
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Supprimer cette section ?"
        eyebrow="Conducteur"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => pendingDelete && deleteSection(pendingDelete)}
            >
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Les questions de « {pendingDelete?.title} » seront supprimées. Les plans
          liés seront conservés, mais détachés de la section.
        </p>
      </Modal>
    </div>
  );
}
