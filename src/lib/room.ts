import type { ElementKind, LightTemperature, LightType, RoomElement } from "./types";

export const DEFAULT_FOV = 60;
export const DEFAULT_BEAM = 60;
export const DEFAULT_RANGE_M = 3;

export function uid(): string {
  return crypto.randomUUID();
}

export function fovFromLens(sensorWidthMm: number, focalMm: number): number {
  if (sensorWidthMm <= 0 || focalMm <= 0) return DEFAULT_FOV;
  return (2 * Math.atan(sensorWidthMm / (2 * focalMm)) * 180) / Math.PI;
}

export function distance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return Math.hypot(bx - ax, by - ay);
}

export function calibrate(distancePx: number, meters: number): number | null {
  if (distancePx <= 0 || meters <= 0) return null;
  return distancePx / meters;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Secteur orienté, en pixels de l'image. L'angle 0 pointe vers la droite,
 * les angles positifs tournent dans le sens horaire (axe Y de l'image).
 */
export function conePath(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
  rotationDeg: number,
): string {
  const half = clamp(angleDeg, 1, 179) / 2;
  const start = ((rotationDeg - half) * Math.PI) / 180;
  const end = ((rotationDeg + half) * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
}

export function lightColor(temperature: LightTemperature): string {
  switch (temperature) {
    case "warm":
      return "#E8A33D";
    case "cool":
      return "#6FB6C9";
    default:
      return "#E9E4D6";
  }
}

export function defaultElement(
  kind: ElementKind,
  x: number,
  y: number,
  label?: string,
): RoomElement {
  const names: Record<ElementKind, string> = {
    camera: "Caméra",
    light: "Lumière",
    mic: "Micro",
    person: "Personne",
    prop: "Décor",
    other: "Élément",
  };
  return {
    id: uid(),
    kind,
    label: label ?? names[kind],
    x: clamp(x, 0.02, 0.98),
    y: clamp(y, 0.02, 0.98),
    rotation: kind === "light" ? 135 : 0,
    width: kind === "prop" ? 0.14 : kind === "person" ? 0.06 : 0.055,
    height: kind === "prop" ? 0.1 : kind === "person" ? 0.06 : 0.055,
    z: 10,
    locked: false,
    fovDeg: DEFAULT_FOV,
    beamDeg: DEFAULT_BEAM,
    rangeM: DEFAULT_RANGE_M,
    lightType: "key",
    temperature: "neutral",
    facingDeg: 0,
    notes: "",
  };
}

export function roomScaleLabel(pxPerMeter: number | null): string {
  if (!pxPerMeter) return "Échelle non calibrée";
  return `1 m = ${Math.round(pxPerMeter)} px`;
}
