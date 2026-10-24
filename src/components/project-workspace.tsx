"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Clapperboard,
  LayoutDashboard,
  ListChecks,
  Radio,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn, EmptyState } from "@/components/ui";
import { formatDate, PROJECT_STATUS_LABELS } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Project } from "@/lib/types";
import { ConducteurView } from "@/components/views/conducteur-view";
import { PlanningView } from "@/components/views/planning-view";
import { PlansView } from "@/components/views/plans-view";
import { RoomView } from "@/components/views/room-view";
import { TodayView } from "@/components/views/today-view";

const TABS = [
  { id: "conducteur", label: "Conducteur", icon: ListChecks, number: "01" },
  { id: "plans", label: "Plans", icon: Clapperboard, number: "02" },
  { id: "salle", label: "Salle", icon: LayoutDashboard, number: "03" },
  { id: "planning", label: "Planning", icon: CalendarClock, number: "04" },
  { id: "aujourdhui", label: "Aujourd'hui", icon: Radio, number: "05" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTab(value: string | null): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const { data, updateProject } = useStore();
  const [tab, setTab] = useState<TabId>("conducteur");
  const project = data.projects.find((item) => item.id === projectId);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tab");
    if (isTab(fromUrl)) setTab(fromUrl);
  }, []);

  function selectTab(next: TabId) {
    setTab(next);
    window.history.replaceState(null, "", `?tab=${next}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20">
        <EmptyState
          icon={<Clapperboard size={22} />}
          title="Tournage introuvable"
          description="Il a peut-être été supprimé, ou le lien n'est plus valide."
          action={
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-sm text-paper"
            >
              <ArrowLeft size={15} />
              Retour aux tournages
            </Link>
          }
        />
      </div>
    );
  }

  const update = (updater: (current: Project) => Project) =>
    updateProject(project.id, updater);

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="no-print sticky top-0 hidden h-screen flex-col border-r border-white/10 bg-ink text-paper lg:flex">
        <div className="border-b border-white/10 p-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-7 w-7 items-center justify-center border border-paper/60">
              <span className="h-2 w-2 bg-orange" />
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-rec" />
            </span>
            <span className="font-display text-sm font-black tracking-[0.16em]">
              SCENOPIA
            </span>
          </Link>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40 transition-colors hover:text-paper"
          >
            <ArrowLeft size={11} />
            Tous les tournages
          </Link>
          <h1 className="mt-3 font-display text-xl font-extrabold leading-tight tracking-[-0.02em]">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/45">
            <span>{formatDate(project.shootDate)}</span>
            <span className="h-1 w-1 rounded-full bg-paper/30" />
            <span>{PROJECT_STATUS_LABELS[project.status]}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                  active
                    ? "bg-paper text-ink"
                    : "text-paper/55 hover:bg-white/5 hover:text-paper",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[9px]",
                    active ? "text-orange" : "text-paper/30",
                  )}
                >
                  {item.number}
                </span>
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[13px] font-medium">{item.label}</span>
                {item.id === "aujourdhui" ? (
                  <span
                    className={cn(
                      "ml-auto h-1.5 w-1.5 rounded-full",
                      active ? "bg-rec" : "bg-rec/70",
                    )}
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => selectTab("aujourdhui")}
            className="flex w-full items-center justify-center gap-2 bg-orange px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d94c1e]"
          >
            <Radio size={15} />
            Mode plateau
          </button>
          <div className="mt-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Enregistré sur cet appareil
          </div>
        </div>
      </aside>

      <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur lg:hidden">
        <Link
          href="/"
          aria-label="Retour aux tournages"
          className="flex h-9 w-9 items-center justify-center text-muted"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 px-3 text-center">
          <div className="truncate font-display text-sm font-bold">{project.title}</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
            {formatDate(project.shootDate)}
          </div>
        </div>
        <span className="flex h-9 w-9 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-orange" />
        </span>
      </header>

      <main
        className={cn(
          "min-h-screen pb-20 lg:pb-0",
          tab === "aujourdhui" ? "bg-monitor" : "bg-paper",
        )}
      >
        {tab === "conducteur" ? (
          <ConducteurView project={project} update={update} />
        ) : null}
        {tab === "plans" ? <PlansView project={project} update={update} /> : null}
        {tab === "salle" ? <RoomView project={project} update={update} /> : null}
        {tab === "planning" ? (
          <PlanningView project={project} update={update} />
        ) : null}
        {tab === "aujourdhui" ? (
          <TodayView
            project={project}
            update={update}
            onNavigate={(next) => selectTab(next)}
          />
        ) : null}
      </main>

      <nav
        className={cn(
          "no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t backdrop-blur lg:hidden",
          tab === "aujourdhui"
            ? "border-monitorline bg-monitor/95 text-paper"
            : "border-line bg-paper/95 text-ink",
        )}
      >
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 font-mono text-[8px] uppercase tracking-[0.08em] transition-colors",
                active
                  ? tab === "aujourdhui"
                    ? "text-orange"
                    : "text-orange"
                  : tab === "aujourdhui"
                    ? "text-paper/40"
                    : "text-muted",
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
