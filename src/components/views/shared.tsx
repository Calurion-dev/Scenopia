import type { Project } from "@/lib/types";

export interface ProjectViewProps {
  project: Project;
  update: (updater: (project: Project) => Project) => void;
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
