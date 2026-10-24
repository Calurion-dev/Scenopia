export type ProjectStatus =
  | "brouillon"
  | "preparation"
  | "pret"
  | "tourne"
  | "termine";

export type ShotStatus = "a_tourner" | "tourne" | "a_refaire" | "abandonne";

export type BlockType =
  | "installation"
  | "tournage"
  | "pause"
  | "repas"
  | "demontage"
  | "autre";

export type BlockStatus = "a_venir" | "en_cours" | "termine";

export type ElementKind = "camera" | "light" | "mic" | "person" | "prop" | "other";

export type LightType = "key" | "fill" | "back" | "practical";

export type LightTemperature = "warm" | "neutral" | "cool";

export type ScaleMode = "indicatif" | "echelle";

export type GearCategory =
  | "camera"
  | "lens"
  | "light"
  | "mic"
  | "support"
  | "prop"
  | "other";

export interface Question {
  id: string;
  text: string;
  notes: string;
  plannedMinutes: number;
}

export interface Section {
  id: string;
  title: string;
  notes: string;
  plannedMinutes: number;
  questions: Question[];
}

export interface Shot {
  id: string;
  number: number;
  description: string;
  sectionId: string | null;
  questionId: string | null;
  shotSize: string;
  angle: string;
  movement: string;
  lensMm: number;
  durationMin: number;
  cameraElementId: string | null;
  status: ShotStatus;
  notes: string;
}

export interface RoomElement {
  id: string;
  kind: ElementKind;
  label: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  z: number;
  locked: boolean;
  fovDeg: number;
  sensorWidthMm?: number;
  beamDeg: number;
  rangeM: number;
  lightType: LightType;
  temperature: LightTemperature;
  facingDeg: number;
  notes: string;
  gearItemId?: string;
}

export interface Room {
  name: string;
  image: string | null;
  imageWidth: number;
  imageHeight: number;
  scaleMode: ScaleMode;
  pxPerMeter: number | null;
  elements: RoomElement[];
}

export interface ScheduleBlock {
  id: string;
  type: BlockType;
  title: string;
  durationMin: number;
  sectionId: string | null;
  shotId: string | null;
  notes: string;
  status: BlockStatus;
  startedAt: string | null;
  endedAt: string | null;
}

export interface DayNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  shootDate: string;
  dayStart: string;
  dayEnd: string;
  status: ProjectStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
  shots: Shot[];
  room: Room;
  blocks: ScheduleBlock[];
  dayNotes: DayNote[];
}

export interface GearDefaults {
  fovDeg?: number;
  sensorWidthMm?: number;
  beamDeg?: number;
  rangeM?: number;
  lightType?: LightType;
  temperature?: LightTemperature;
}

export interface GearItem {
  id: string;
  category: GearCategory;
  name: string;
  defaults: GearDefaults;
  notes: string;
}

export interface AppData {
  version: 1;
  projects: Project[];
  gear: GearItem[];
}
