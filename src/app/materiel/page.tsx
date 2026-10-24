"use client";

import Link from "next/link";
import {
  Aperture,
  Armchair,
  ArrowLeft,
  Box,
  Camera,
  Lightbulb,
  Mic,
  Pencil,
  Plus,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Button,
  EmptyState,
  Field,
  IconButton,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
  cn,
} from "@/components/ui";
import {
  GEAR_CATEGORY_LABELS,
  LIGHT_TYPE_LABELS,
  TEMPERATURE_LABELS,
} from "@/lib/format";
import { uid } from "@/lib/room";
import { useStore } from "@/lib/store";
import type {
  GearCategory,
  GearItem,
  LightTemperature,
  LightType,
} from "@/lib/types";

const CATEGORY_ICONS: Record<GearCategory, LucideIcon> = {
  camera: Camera,
  lens: Aperture,
  light: Lightbulb,
  mic: Mic,
  support: Wrench,
  prop: Armchair,
  other: Box,
};

const CATEGORY_STYLES: Record<GearCategory, string> = {
  camera: "border-orange/40 bg-orange/10 text-orange",
  lens: "border-cyan/40 bg-cyan/10 text-[#2E7A8C]",
  light: "border-amber/40 bg-amber/10 text-[#9A6618]",
  mic: "border-cyan/40 bg-cyan/10 text-[#2E7A8C]",
  support: "border-line bg-paper2 text-muted",
  prop: "border-line bg-paper2 text-muted",
  other: "border-line bg-paper2 text-muted",
};

function emptyGear(): GearItem {
  return { id: uid(), category: "camera", name: "", defaults: {}, notes: "" };
}

function defaultsSummary(item: GearItem): string {
  const parts: string[] = [];
  if (item.defaults.fovDeg) parts.push(`Champ ${item.defaults.fovDeg}°`);
  if (item.defaults.sensorWidthMm) {
    parts.push(`Capteur ${item.defaults.sensorWidthMm} mm`);
  }
  if (item.defaults.beamDeg) parts.push(`Faisceau ${item.defaults.beamDeg}°`);
  if (item.defaults.rangeM) parts.push(`Portée ${item.defaults.rangeM} m`);
  if (item.defaults.lightType) {
    parts.push(LIGHT_TYPE_LABELS[item.defaults.lightType]);
  }
  if (item.defaults.temperature) {
    parts.push(TEMPERATURE_LABELS[item.defaults.temperature]);
  }
  return parts.length > 0 ? parts.join(" · ") : "Aucun réglage par défaut";
}

export default function MaterielPage() {
  const { data, addGear, updateGear, removeGear } = useStore();
  const [filter, setFilter] = useState<"tous" | GearCategory>("tous");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<GearItem>(emptyGear);
  const [pendingDelete, setPendingDelete] = useState<GearItem | null>(null);

  const categories = Object.keys(GEAR_CATEGORY_LABELS) as GearCategory[];
  const visible = data.gear.filter(
    (item) => filter === "tous" || item.category === filter,
  );

  function openAdd() {
    setForm(emptyGear());
    setEditing(false);
    setOpen(true);
  }

  function openEdit(item: GearItem) {
    setForm(structuredClone(item));
    setEditing(true);
    setOpen(true);
  }

  function save() {
    if (!form.name.trim()) return;
    const clean = { ...form, name: form.name.trim() };
    if (editing) updateGear(clean.id, clean);
    else addGear(clean);
    setOpen(false);
  }

  function patchForm(patch: Partial<GearItem>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function patchDefaults(patch: Partial<GearItem["defaults"]>) {
    setForm((current) => ({
      ...current,
      defaults: { ...current.defaults, ...patch },
    }));
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="no-print border-b border-line">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-7 w-7 items-center justify-center border border-ink">
              <span className="h-2 w-2 bg-orange" />
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-rec" />
            </span>
            <span className="font-display text-sm font-black tracking-[0.16em]">
              SCENOPIA
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={13} />
            Tournages
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <PageHeader
          eyebrow="Bibliothèque"
          title="Matériel"
          description="Ton matériel, saisi une fois. Il se retrouve ensuite dans le plan de salle, avec ses réglages par défaut."
          actions={
            <Button variant="primary" onClick={openAdd}>
              <Plus size={15} />
              Matériel
            </Button>
          }
        />

        <div className="mt-5 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setFilter("tous")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 border px-3 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors",
              filter === "tous"
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white/40 text-muted hover:border-ink hover:text-ink",
            )}
          >
            Tous
            <span className="opacity-50">{data.gear.length}</span>
          </button>
          {categories.map((category) => {
            const count = data.gear.filter(
              (item) => item.category === category,
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 border px-3 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors",
                  filter === category
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-white/40 text-muted hover:border-ink hover:text-ink",
                )}
              >
                {GEAR_CATEGORY_LABELS[category]}
                <span className="opacity-50">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {visible.length === 0 ? (
            <div className="sm:col-span-2">
              <EmptyState
                icon={<Camera size={22} />}
                title={
                  data.gear.length === 0
                    ? "Ta bibliothèque est vide"
                    : "Rien dans cette catégorie"
                }
                description={
                  data.gear.length === 0
                    ? "Ajoute tes caméras, tes lumières et tes micros. Chaque élément garde ses réglages par défaut."
                    : "Change de catégorie ou ajoute du matériel."
                }
                action={
                  <Button variant="primary" onClick={openAdd}>
                    <Plus size={15} />
                    Ajouter du matériel
                  </Button>
                }
              />
            </div>
          ) : null}

          {visible.map((item) => {
            const Icon = CATEGORY_ICONS[item.category];
            return (
              <article key={item.id} className="border border-line bg-white/45">
                <div className="flex items-start gap-3 p-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center border",
                      CATEGORY_STYLES[item.category],
                    )}
                  >
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                      {GEAR_CATEGORY_LABELS[item.category]}
                    </div>
                    <h3 className="mt-0.5 font-display text-lg font-bold tracking-tight">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 font-mono text-[9px] leading-relaxed text-muted">
                      {defaultsSummary(item)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <IconButton label="Modifier" onClick={() => openEdit(item)}>
                      <Pencil size={13} />
                    </IconButton>
                    <IconButton
                      label="Supprimer"
                      className="hover:text-danger"
                      onClick={() => setPendingDelete(item)}
                    >
                      <Trash2 size={13} />
                    </IconButton>
                  </div>
                </div>
                {item.notes ? (
                  <p className="border-t border-line/70 px-4 py-2.5 text-xs leading-relaxed text-muted">
                    {item.notes}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          Cette bibliothèque est locale à cet appareil. Elle sera synchronisée avec le
          cloud plus tard.
        </p>
      </main>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier le matériel" : "Ajouter du matériel"}
        eyebrow="Bibliothèque"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={save} disabled={!form.name.trim()}>
              {editing ? "Enregistrer" : "Ajouter"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Catégorie">
            <Select
              value={form.category}
              onChange={(event) =>
                patchForm({ category: event.target.value as GearCategory })
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {GEAR_CATEGORY_LABELS[category]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nom">
            <Input
              autoFocus
              value={form.name}
              onChange={(event) => patchForm({ name: event.target.value })}
              placeholder="Ex. Sony FX3, Aputure 120D, micro cravate…"
            />
          </Field>

          {form.category === "camera" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Champ de vision">
                <div className="relative">
                  <Input
                    type="number"
                    min={5}
                    max={170}
                    value={form.defaults.fovDeg ?? ""}
                    onChange={(event) =>
                      patchDefaults({
                        fovDeg: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      })
                    }
                    placeholder="60"
                    className="pr-7 font-mono"
                  />
                  <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                    °
                  </span>
                </div>
              </Field>
              <Field label="Largeur du capteur">
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={form.defaults.sensorWidthMm ?? ""}
                    onChange={(event) =>
                      patchDefaults({
                        sensorWidthMm: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      })
                    }
                    placeholder="36"
                    className="pr-8 font-mono"
                  />
                  <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                    mm
                  </span>
                </div>
              </Field>
            </div>
          ) : null}

          {form.category === "light" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Faisceau">
                  <div className="relative">
                    <Input
                      type="number"
                      min={5}
                      max={170}
                      value={form.defaults.beamDeg ?? ""}
                      onChange={(event) =>
                        patchDefaults({
                          beamDeg: event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        })
                      }
                      placeholder="60"
                      className="pr-7 font-mono"
                    />
                    <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                      °
                    </span>
                  </div>
                </Field>
                <Field label="Portée">
                  <div className="relative">
                    <Input
                      type="number"
                      min={0.2}
                      step={0.1}
                      value={form.defaults.rangeM ?? ""}
                      onChange={(event) =>
                        patchDefaults({
                          rangeM: event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        })
                      }
                      placeholder="2.5"
                      className="pr-7 font-mono"
                    />
                    <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                      m
                    </span>
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rôle">
                  <Select
                    value={form.defaults.lightType ?? ""}
                    onChange={(event) =>
                      patchDefaults({
                        lightType: event.target.value
                          ? (event.target.value as LightType)
                          : undefined,
                      })
                    }
                  >
                    <option value="">Non défini</option>
                    {Object.entries(LIGHT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Température">
                  <Select
                    value={form.defaults.temperature ?? ""}
                    onChange={(event) =>
                      patchDefaults({
                        temperature: event.target.value
                          ? (event.target.value as LightTemperature)
                          : undefined,
                      })
                    }
                  >
                    <option value="">Non définie</option>
                    {Object.entries(TEMPERATURE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </>
          ) : null}

          <Field label="Note">
            <Textarea
              value={form.notes}
              onChange={(event) => patchForm({ notes: event.target.value })}
              placeholder="Numéro de série, accessoire, particularité…"
              className="min-h-16 bg-transparent text-xs"
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Supprimer ce matériel ?"
        eyebrow="Bibliothèque"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (pendingDelete) removeGear(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          « {pendingDelete?.name} » sera retiré de la bibliothèque. Les éléments déjà
          posés sur un plan de salle restent en place.
        </p>
      </Modal>
    </div>
  );
}
