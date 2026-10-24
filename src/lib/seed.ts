import { DEMO_PLAN } from "./demoPlan";
import { uid } from "./room";
import type {
  AppData,
  GearItem,
  Project,
  Question,
  RoomElement,
  ScheduleBlock,
  Section,
  Shot,
} from "./types";

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function question(text: string, minutes: number): Question {
  return { id: uid(), text, notes: "", plannedMinutes: minutes };
}

function element(
  kind: RoomElement["kind"],
  label: string,
  x: number,
  y: number,
  rotation: number,
  patch: Partial<RoomElement> = {},
): RoomElement {
  return {
    id: uid(),
    kind,
    label,
    x,
    y,
    rotation,
    width: kind === "prop" ? 0.1 : 0.055,
    height: kind === "prop" ? 0.1 : 0.055,
    z: 10,
    locked: false,
    fovDeg: 60,
    beamDeg: 60,
    rangeM: 3,
    lightType: "key",
    temperature: "neutral",
    facingDeg: 0,
    notes: "",
    ...patch,
  };
}

function gear(
  category: GearItem["category"],
  name: string,
  defaults: GearItem["defaults"] = {},
  notes = "",
): GearItem {
  return { id: uid(), category, name, defaults, notes };
}

export function createSeedData(): AppData {
  const s1: Section = {
    id: uid(),
    title: "Ouverture",
    notes: "Poser le cadre, rappeler qui est là et pourquoi.",
    plannedMinutes: 5,
    questions: [
      question("Peux-tu te présenter en quelques mots ?", 2),
      question("Comment es-tu arrivé à ce métier ?", 3),
    ],
  };
  const s2: Section = {
    id: uid(),
    title: "Le métier au quotidien",
    notes: "Le cœur de l'interview : concret, des exemples, pas de généralités.",
    plannedMinutes: 15,
    questions: [
      question("À quoi ressemble une journée type ?", 5),
      question("Quelles sont les compétences indispensables ?", 5),
      question("Qu'est-ce qui t'a le plus surpris en commençant ?", 5),
    ],
  };
  const s3: Section = {
    id: uid(),
    title: "Réalités et conseils",
    notes: "Accepter les difficultés, puis ouvrir vers un conseil actionnable.",
    plannedMinutes: 10,
    questions: [
      question("Qu'est-ce qui est plus difficile que ce qu'on imagine ?", 5),
      question("Quel conseil donnerais-tu à quelqu'un qui veut se lancer ?", 5),
    ],
  };
  const s4: Section = {
    id: uid(),
    title: "Clôture",
    notes: "Terminer proprement, sans couper trop vite.",
    plannedMinutes: 5,
    questions: [
      question("Où peut-on te retrouver ?", 2),
      question("Un dernier mot ?", 3),
    ],
  };

  const shots: Shot[] = [
    {
      id: uid(),
      number: 1,
      description: "Plan large deux personnes",
      sectionId: s1.id,
      questionId: s1.questions[0].id,
      shotSize: "Large",
      angle: "Face",
      movement: "Fixe",
      lensMm: 24,
      durationMin: 5,
      cameraElementId: null,
      status: "tourne",
      notes: "Cadre d'ouverture, laisser respirer.",
    },
    {
      id: uid(),
      number: 2,
      description: "Plan journaliste",
      sectionId: s1.id,
      questionId: s1.questions[0].id,
      shotSize: "Moyen",
      angle: "3/4",
      movement: "Fixe",
      lensMm: 50,
      durationMin: 3,
      cameraElementId: null,
      status: "tourne",
      notes: "",
    },
    {
      id: uid(),
      number: 3,
      description: "Plan invité",
      sectionId: s2.id,
      questionId: s2.questions[0].id,
      shotSize: "Moyen",
      angle: "3/4",
      movement: "Fixe",
      lensMm: 50,
      durationMin: 5,
      cameraElementId: null,
      status: "a_tourner",
      notes: "",
    },
    {
      id: uid(),
      number: 4,
      description: "Contrechamp invité",
      sectionId: s2.id,
      questionId: s2.questions[1].id,
      shotSize: "Moyen",
      angle: "Profil",
      movement: "Fixe",
      lensMm: 50,
      durationMin: 3,
      cameraElementId: null,
      status: "a_tourner",
      notes: "",
    },
    {
      id: uid(),
      number: 5,
      description: "Insert mains",
      sectionId: s2.id,
      questionId: s2.questions[1].id,
      shotSize: "Gros",
      angle: "Plongée",
      movement: "Fixe",
      lensMm: 100,
      durationMin: 1,
      cameraElementId: null,
      status: "a_tourner",
      notes: "",
    },
    {
      id: uid(),
      number: 6,
      description: "Insert écran",
      sectionId: s3.id,
      questionId: s3.questions[0].id,
      shotSize: "Gros",
      angle: "Face",
      movement: "Fixe",
      lensMm: 100,
      durationMin: 1,
      cameraElementId: null,
      status: "a_tourner",
      notes: "",
    },
    {
      id: uid(),
      number: 7,
      description: "Plan large de fin",
      sectionId: s4.id,
      questionId: s4.questions[1].id,
      shotSize: "Large",
      angle: "Face",
      movement: "Fixe",
      lensMm: 24,
      durationMin: 2,
      cameraElementId: null,
      status: "a_tourner",
      notes: "",
    },
    {
      id: uid(),
      number: 8,
      description: "Détail décor",
      sectionId: s3.id,
      questionId: s3.questions[1].id,
      shotSize: "Très gros",
      angle: "3/4",
      movement: "Fixe",
      lensMm: 85,
      durationMin: 1,
      cameraElementId: null,
      status: "a_tourner",
      notes: "",
    },
  ];

  const blocks: ScheduleBlock[] = [
    {
      id: uid(),
      type: "installation",
      title: "Installation lumière et cadres",
      durationMin: 45,
      sectionId: null,
      shotId: null,
      notes: "Vérifier les cravates, le reflet des lunettes, le niveau sonore.",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
    {
      id: uid(),
      type: "tournage",
      title: "Ouverture",
      durationMin: 20,
      sectionId: s1.id,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
    {
      id: uid(),
      type: "tournage",
      title: "Le métier au quotidien",
      durationMin: 40,
      sectionId: s2.id,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
    {
      id: uid(),
      type: "pause",
      title: "Pause",
      durationMin: 15,
      sectionId: null,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
    {
      id: uid(),
      type: "tournage",
      title: "Réalités et conseils",
      durationMin: 30,
      sectionId: s3.id,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
    {
      id: uid(),
      type: "tournage",
      title: "Clôture",
      durationMin: 15,
      sectionId: s4.id,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
    {
      id: uid(),
      type: "demontage",
      title: "Démontage",
      durationMin: 30,
      sectionId: null,
      shotId: null,
      notes: "",
      status: "a_venir",
      startedAt: null,
      endedAt: null,
    },
  ];

  const cameraA = element("camera", "Caméra A — large", 0.5, 0.18, 90, {
    fovDeg: 65,
    sensorWidthMm: 36,
  });
  const cameraB = element("camera", "Caméra B — serré", 0.5, 0.84, -90, {
    fovDeg: 40,
    sensorWidthMm: 36,
  });

  shots[0].cameraElementId = cameraA.id;
  shots[1].cameraElementId = cameraB.id;
  shots[2].cameraElementId = cameraA.id;
  shots[3].cameraElementId = cameraB.id;
  shots[4].cameraElementId = cameraB.id;
  shots[5].cameraElementId = cameraA.id;
  shots[6].cameraElementId = cameraA.id;
  shots[7].cameraElementId = cameraB.id;

  const roomElements: RoomElement[] = [
    cameraA,
    cameraB,
    element("person", "Journaliste", 0.29, 0.545, 0, { facingDeg: 0, width: 0.05, height: 0.05 }),
    element("person", "Invité", 0.71, 0.545, 180, { facingDeg: 180, width: 0.05, height: 0.05 }),
    element("light", "Principale — softbox", 0.16, 0.27, 50, {
      beamDeg: 90,
      rangeM: 2.8,
      lightType: "key",
      temperature: "warm",
    }),
    element("light", "Débouchage — LED", 0.84, 0.27, 130, {
      beamDeg: 90,
      rangeM: 2.6,
      lightType: "fill",
      temperature: "neutral",
    }),
    element("light", "Contre — LED", 0.84, 0.78, 230, {
      beamDeg: 55,
      rangeM: 2.2,
      lightType: "back",
      temperature: "cool",
    }),
    element("mic", "Micro journaliste", 0.33, 0.62, 0, { width: 0.025, height: 0.025 }),
    element("mic", "Micro invité", 0.67, 0.62, 0, { width: 0.025, height: 0.025 }),
    element("prop", "Plante", 0.1, 0.78, 0, { width: 0.07, height: 0.09 }),
  ];

  const project: Project = {
    id: uid(),
    title: "Portrait de métier — épisode 1",
    shootDate: daysFromNow(3),
    dayStart: "09:00",
    dayEnd: "12:30",
    status: "preparation",
    notes: "Interview à deux, en intérieur. Objectif : comprendre le métier par le concret.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [s1, s2, s3, s4],
    shots,
    room: {
      name: "Studio — plateau principal",
      image: DEMO_PLAN,
      imageWidth: 1600,
      imageHeight: 1000,
      scaleMode: "echelle",
      pxPerMeter: 197,
      elements: roomElements,
    },
    blocks,
    dayNotes: [],
  };

  const gearItems: GearItem[] = [
    gear("camera", "Caméra A", { fovDeg: 65, sensorWidthMm: 36 }, "Boîtier principal, plan large."),
    gear("camera", "Caméra B", { fovDeg: 40, sensorWidthMm: 36 }, "Boîtier secondaire, plans serrés."),
    gear("lens", "Optique 24 mm", {}, "Plan large."),
    gear("lens", "Optique 50 mm", {}, "Portrait."),
    gear("lens", "Optique 85 mm", {}, "Détail et compression."),
    gear("light", "Softbox", { beamDeg: 90, rangeM: 2.8, lightType: "key", temperature: "warm" }),
    gear("light", "Panneau LED", { beamDeg: 60, rangeM: 3, lightType: "fill", temperature: "neutral" }),
    gear("mic", "Micro-cravate", {}, "Un par personne."),
    gear("mic", "Micro canon", {}, "Ambiance et secours."),
    gear("support", "Perche", {}, ""),
    gear("prop", "Table", {}, "Plateau central."),
  ];

  return { version: 1, projects: [project], gear: gearItems };
}
