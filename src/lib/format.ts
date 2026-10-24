import type {
  BlockType,
  ElementKind,
  GearCategory,
  LightTemperature,
  LightType,
  ProjectStatus,
  ShotStatus,
} from "./types";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  brouillon: "Brouillon",
  preparation: "En préparation",
  pret: "Prêt à tourner",
  tourne: "Tourné",
  termine: "Terminé",
};

export const SHOT_STATUS_LABELS: Record<ShotStatus, string> = {
  a_tourner: "À tourner",
  tourne: "Tourné",
  a_refaire: "À refaire",
  abandonne: "Abandonné",
};

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  installation: "Installation",
  tournage: "Tournage",
  pause: "Pause",
  repas: "Repas",
  demontage: "Démontage",
  autre: "Autre",
};

export const ELEMENT_KIND_LABELS: Record<ElementKind, string> = {
  camera: "Caméra",
  light: "Lumière",
  mic: "Micro",
  person: "Personne",
  prop: "Décor",
  other: "Autre",
};

export const LIGHT_TYPE_LABELS: Record<LightType, string> = {
  key: "Principale",
  fill: "Débouchage",
  back: "Contre",
  practical: "Pratique",
};

export const TEMPERATURE_LABELS: Record<LightTemperature, string> = {
  warm: "Chaude",
  neutral: "Neutre",
  cool: "Froide",
};

export const GEAR_CATEGORY_LABELS: Record<GearCategory, string> = {
  camera: "Caméra",
  lens: "Optique",
  light: "Lumière",
  mic: "Micro",
  support: "Support",
  prop: "Décor",
  other: "Autre",
};

export function formatDate(iso: string): string {
  if (!iso) return "Date à définir";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateLong(iso: string): string {
  if (!iso) return "Date à définir";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDuration(minutes: number): string {
  const value = Math.max(0, Math.round(minutes));
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${String(rest).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const value = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export function formatClock(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function isToday(iso: string): boolean {
  return iso === todayISO();
}

export function shotProgress(shots: { status: ShotStatus }[]): {
  done: number;
  total: number;
  percent: number;
} {
  const active = shots.filter((shot) => shot.status !== "abandonne");
  const done = active.filter((shot) => shot.status === "tourne").length;
  return {
    done,
    total: active.length,
    percent: active.length === 0 ? 0 : Math.round((done / active.length) * 100),
  };
}

export function totalShotsDuration(shots: { durationMin: number; status: ShotStatus }[]): number {
  return shots
    .filter((shot) => shot.status !== "abandonne")
    .reduce((total, shot) => total + shot.durationMin, 0);
}

export function totalSectionDuration(
  sections: { plannedMinutes: number; questions: { plannedMinutes: number }[] }[],
): number {
  return sections.reduce(
    (total, section) =>
      total +
      section.plannedMinutes +
      section.questions.reduce((sum, question) => sum + question.plannedMinutes, 0),
    0,
  );
}

export interface TimedBlock<T> {
  block: T;
  start: number;
  end: number;
}

export function scheduleWithTimes<T extends { durationMin: number }>(
  blocks: T[],
  dayStart: string,
): TimedBlock<T>[] {
  let cursor = timeToMinutes(dayStart);
  return blocks.map((block) => {
    const start = cursor;
    cursor += Math.max(0, block.durationMin);
    return { block, start, end: cursor };
  });
}
