"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createSeedData } from "./seed";
import { uid } from "./room";
import type { AppData, GearItem, Project } from "./types";

const STORAGE_KEY = "scenopia.v1";

interface StoreValue {
  data: AppData;
  ready: boolean;
  storageError: string | null;
  createProject: (title: string, shootDate: string) => string;
  updateProject: (id: string, updater: (project: Project) => Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => string | null;
  addGear: (item: GearItem) => void;
  updateGear: (id: string, patch: Partial<GearItem>) => void;
  removeGear: (id: string) => void;
  replaceData: (data: AppData) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function cloneProject(project: Project): Project {
  return structuredClone(project);
}

function reidProject(project: Project): Project {
  const copy = cloneProject(project);
  copy.id = uid();
  copy.title = `Copie de ${project.title}`;
  copy.shootDate = "";
  copy.dayStart = project.dayStart;
  copy.dayEnd = project.dayEnd;
  copy.status = "brouillon";
  copy.notes = project.notes;
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = copy.createdAt;
  copy.dayNotes = [];

  const sectionIds = new Map<string, string>();
  const questionIds = new Map<string, string>();
  copy.sections = copy.sections.map((section) => {
    const id = uid();
    sectionIds.set(section.id, id);
    return {
      ...section,
      id,
      questions: section.questions.map((question) => {
        const questionId = uid();
        questionIds.set(question.id, questionId);
        return { ...question, id: questionId };
      }),
    };
  });

  const elementIds = new Map<string, string>();
  copy.room = {
    ...copy.room,
    elements: copy.room.elements.map((element) => {
      const id = uid();
      elementIds.set(element.id, id);
      return { ...element, id };
    }),
  };

  const shotIds = new Map<string, string>();
  copy.shots = copy.shots.map((shot) => {
    const id = uid();
    shotIds.set(shot.id, id);
    return {
      ...shot,
      id,
      status: "a_tourner",
      sectionId: shot.sectionId ? sectionIds.get(shot.sectionId) ?? null : null,
      questionId: shot.questionId ? questionIds.get(shot.questionId) ?? null : null,
      cameraElementId: shot.cameraElementId
        ? elementIds.get(shot.cameraElementId) ?? null
        : null,
    };
  });

  copy.blocks = copy.blocks.map((block) => ({
    ...block,
    id: uid(),
    status: "a_venir",
    startedAt: null,
    endedAt: null,
    sectionId: block.sectionId ? sectionIds.get(block.sectionId) ?? null : null,
    shotId: block.shotId ? shotIds.get(block.shotId) ?? null : null,
  }));
  return copy;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<AppData | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppData;
        if (parsed.version === 1 && Array.isArray(parsed.projects)) {
          setData(parsed);
        } else {
          setData(createSeedData());
        }
      } else {
        setData(createSeedData());
      }
    } catch {
      setData(createSeedData());
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!data || !ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setStorageError(null);
      } catch {
        setStorageError(
          "Espace de stockage plein. Exporte tes données puis allège les images de plans.",
        );
      }
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, ready]);

  useEffect(() => {
    latest.current = data;
  }, [data]);

  useEffect(() => {
    const flush = () => {
      if (!latest.current) return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(latest.current));
      } catch {
        // The debounced save already surfaces storage errors in the UI.
      }
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, []);

  const createProject = useCallback((title: string, shootDate: string) => {
    const id = uid();
    const now = new Date().toISOString();
    const project: Project = {
      id,
      title: title.trim() || "Nouveau tournage",
      shootDate,
      dayStart: "09:00",
      dayEnd: "18:00",
      status: "brouillon",
      notes: "",
      createdAt: now,
      updatedAt: now,
      sections: [],
      shots: [],
      room: {
        name: "Salle principale",
        image: null,
        imageWidth: 1600,
        imageHeight: 1000,
        scaleMode: "indicatif",
        pxPerMeter: null,
        elements: [],
      },
      blocks: [],
      dayNotes: [],
    };
    setData((prev) =>
      prev ? { ...prev, projects: [project, ...prev.projects] } : prev,
    );
    return id;
  }, []);

  const updateProject = useCallback(
    (id: string, updater: (project: Project) => Project) => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: prev.projects.map((project) =>
            project.id === id
              ? { ...updater(project), updatedAt: new Date().toISOString() }
              : project,
          ),
        };
      });
    },
    [],
  );

  const deleteProject = useCallback((id: string) => {
    setData((prev) =>
      prev
        ? { ...prev, projects: prev.projects.filter((project) => project.id !== id) }
        : prev,
    );
  }, []);

  const duplicateProject = useCallback(
    (id: string) => {
      const source = data?.projects.find((project) => project.id === id);
      if (!source) return null;
      const copy = reidProject(source);
      setData((prev) =>
        prev ? { ...prev, projects: [copy, ...prev.projects] } : prev,
      );
      return copy.id;
    },
    [data],
  );

  const addGear = useCallback((item: GearItem) => {
    setData((prev) => (prev ? { ...prev, gear: [item, ...prev.gear] } : prev));
  }, []);

  const updateGear = useCallback((id: string, patch: Partial<GearItem>) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            gear: prev.gear.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          }
        : prev,
    );
  }, []);

  const removeGear = useCallback((id: string) => {
    setData((prev) =>
      prev ? { ...prev, gear: prev.gear.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const replaceData = useCallback((next: AppData) => {
    setData(next);
  }, []);

  const resetDemo = useCallback(() => {
    setData(createSeedData());
  }, []);

  const value = useMemo<StoreValue | null>(() => {
    if (!data) return null;
    return {
      data,
      ready,
      storageError,
      createProject,
      updateProject,
      deleteProject,
      duplicateProject,
      addGear,
      updateGear,
      removeGear,
      replaceData,
      resetDemo,
    };
  }, [
    data,
    ready,
    storageError,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    addGear,
    updateGear,
    removeGear,
    replaceData,
    resetDemo,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange" />
          Chargement du plateau
        </div>
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore doit être utilisé dans StoreProvider");
  return value;
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `scenopia-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseData(raw: string): AppData | null {
  try {
    const parsed = JSON.parse(raw) as AppData;
    if (parsed.version !== 1 || !Array.isArray(parsed.projects)) return null;
    return parsed;
  } catch {
    return null;
  }
}
