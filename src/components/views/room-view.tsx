"use client";

import {
  Armchair,
  Box,
  Camera,
  Image as ImageIcon,
  Lightbulb,
  Lock,
  Mic,
  Minus,
  Plus,
  Printer,
  Redo2,
  RotateCcw,
  Ruler,
  Trash2,
  Undo2,
  Upload,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Field,
  IconButton,
  Input,
  Modal,
  PageHeader,
  Pill,
  Segmented,
  Select,
  Textarea,
  cn,
} from "@/components/ui";
import { BLANK_PLAN } from "@/lib/demoPlan";
import {
  ELEMENT_KIND_LABELS,
  LIGHT_TYPE_LABELS,
  TEMPERATURE_LABELS,
} from "@/lib/format";
import { fileToPlanImage } from "@/lib/image";
import {
  calibrate,
  clamp,
  conePath,
  defaultElement,
  distance,
  lightColor,
} from "@/lib/room";
import { useStore } from "@/lib/store";
import type {
  ElementKind,
  GearCategory,
  LightTemperature,
  LightType,
  Room,
  RoomElement,
  ScaleMode,
} from "@/lib/types";
import type { ProjectViewProps } from "./shared";

const KIND_ICONS: Record<ElementKind, LucideIcon> = {
  camera: Camera,
  light: Lightbulb,
  mic: Mic,
  person: User,
  prop: Armchair,
  other: Box,
};

const ADD_KINDS: ElementKind[] = ["camera", "light", "mic", "person", "prop", "other"];

const KIND_STYLES: Record<ElementKind, string> = {
  camera: "border-orange bg-[#2A1710] text-orange",
  light: "border-amber bg-[#2A2110] text-amber",
  mic: "border-cyan bg-[#0E2227] text-cyan",
  person: "border-paper/80 bg-paper/15 text-paper",
  prop: "border-paper/30 bg-[#161B1C] text-paper/70",
  other: "border-paper/30 bg-[#161B1C] text-paper/70",
};

function gearKind(category: GearCategory): ElementKind {
  if (category === "camera") return "camera";
  if (category === "light") return "light";
  if (category === "mic") return "mic";
  if (category === "prop") return "prop";
  return "other";
}

function ElementInspector({
  element,
  onChange,
  onDelete,
  onRemember,
}: {
  element: RoomElement;
  onChange: (patch: Partial<RoomElement>, record?: boolean) => void;
  onDelete: () => void;
  onRemember: () => void;
}) {
  const isCamera = element.kind === "camera";
  const isLight = element.kind === "light";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            Élément sélectionné
          </div>
          <div className="font-display text-lg font-bold tracking-tight">
            {element.label}
          </div>
        </div>
        <Pill tone={isCamera ? "orange" : isLight ? "amber" : "cyan"}>
          {ELEMENT_KIND_LABELS[element.kind]}
        </Pill>
      </div>

      <Field label="Nom">
        <Input
          value={element.label}
          onFocus={onRemember}
          onChange={(event) => onChange({ label: event.target.value })}
        />
      </Field>

      <Field label="Type">
        <Select
          value={element.kind}
          onChange={(event) =>
            onChange({ kind: event.target.value as ElementKind }, true)
          }
        >
          {Object.entries(ELEMENT_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      {isCamera ? (
        <>
          <Field label="Champ de vision" hint="Angle horizontal du cadre.">
            <div className="relative">
              <Input
                type="number"
                min={5}
                max={170}
                value={element.fovDeg}
                onFocus={onRemember}
                onChange={(event) =>
                  onChange({ fovDeg: clamp(Number(event.target.value) || 5, 5, 170) })
                }
                className="pr-7 font-mono"
              />
              <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                °
              </span>
            </div>
          </Field>
          <Field label="Largeur du capteur" hint="Optionnel : permet de calculer depuis une focale.">
            <div className="relative">
              <Input
                type="number"
                min={1}
                max={100}
                value={element.sensorWidthMm ?? ""}
                onFocus={onRemember}
                onChange={(event) =>
                  onChange({
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
          <Field label="Portée du cadre" hint="Utilisée quand le plan est à l'échelle.">
            <div className="relative">
              <Input
                type="number"
                min={0.2}
                step={0.1}
                value={element.rangeM}
                onFocus={onRemember}
                onChange={(event) =>
                  onChange({ rangeM: Math.max(0.2, Number(event.target.value) || 0.2) })
                }
                className="pr-7 font-mono"
              />
              <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                m
              </span>
            </div>
          </Field>
        </>
      ) : null}

      {isLight ? (
        <>
          <Field label="Rôle">
            <Select
              value={element.lightType}
              onChange={(event) =>
                onChange({ lightType: event.target.value as LightType }, true)
              }
            >
              {Object.entries(LIGHT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Température">
            <Select
              value={element.temperature}
              onChange={(event) =>
                onChange(
                  { temperature: event.target.value as LightTemperature },
                  true,
                )
              }
            >
              {Object.entries(TEMPERATURE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Faisceau">
            <div className="relative">
              <Input
                type="number"
                min={5}
                max={170}
                value={element.beamDeg}
                onFocus={onRemember}
                onChange={(event) =>
                  onChange({ beamDeg: clamp(Number(event.target.value) || 5, 5, 170) })
                }
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
                value={element.rangeM}
                onFocus={onRemember}
                onChange={(event) =>
                  onChange({ rangeM: Math.max(0.2, Number(event.target.value) || 0.2) })
                }
                className="pr-7 font-mono"
              />
              <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
                m
              </span>
            </div>
          </Field>
        </>
      ) : null}

      {element.kind === "person" ? (
        <Field label="Orientation du regard">
          <div className="relative">
            <Input
              type="number"
              min={0}
              max={359}
              value={element.facingDeg}
              onFocus={onRemember}
              onChange={(event) =>
                onChange({ facingDeg: Number(event.target.value) || 0 })
              }
              className="pr-7 font-mono"
            />
            <span className="pointer-events-none absolute right-2 top-3 font-mono text-[10px] text-muted">
              °
            </span>
          </div>
        </Field>
      ) : null}

      <div className="border-t border-line pt-4">
        <Field label={`Rotation — ${Math.round(element.rotation)}°`}>
          <input
            type="range"
            min={0}
            max={359}
            value={element.rotation}
            onPointerDown={onRemember}
            onChange={(event) => onChange({ rotation: Number(event.target.value) })}
            className="w-full"
          />
        </Field>
        <Field label={`Taille — ${Math.round(element.width * 100)} %`} className="mt-3">
          <input
            type="range"
            min={2}
            max={35}
            value={Math.round(element.width * 100)}
            onPointerDown={onRemember}
            onChange={(event) => {
              const value = Number(event.target.value) / 100;
              onChange({ width: value, height: value });
            }}
            className="w-full"
          />
        </Field>
      </div>

      <Field label="Note">
        <Textarea
          value={element.notes}
          onFocus={onRemember}
          onChange={(event) => onChange({ notes: event.target.value })}
          placeholder="Réglage, gélatine, sécurité, accessoire…"
          className="min-h-16 bg-transparent text-xs"
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <label className="inline-flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={element.locked}
            onChange={(event) => onChange({ locked: event.target.checked }, true)}
          />
          <Lock size={12} />
          Verrouiller
        </label>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onChange({ z: element.z + 1 }, true)}
          >
            Avant
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onChange({ z: Math.max(1, element.z - 1) }, true)}
          >
            Arrière
          </Button>
        </div>
      </div>

      <Button variant="danger" className="w-full" onClick={onDelete}>
        <Trash2 size={14} />
        Supprimer l'élément
      </Button>
    </div>
  );
}

export function RoomView({ project, update }: ProjectViewProps) {
  const { data } = useStore();
  const room = project.room;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [calibrating, setCalibrating] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [calibrationOpen, setCalibrationOpen] = useState(false);
  const [meters, setMeters] = useState("1");
  const [history, setHistory] = useState<Room[]>([]);
  const [future, setFuture] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const selected = room.elements.find((element) => element.id === selectedId) ?? null;
  const cameras = room.elements.filter((element) => element.kind === "camera");

  function remember() {
    setHistory((current) => [...current.slice(-29), structuredClone(project.room)]);
    setFuture([]);
  }

  function applyRoom(next: Room, record = true) {
    if (record) remember();
    update((current) => ({ ...current, room: next }));
  }

  function updateElement(
    id: string,
    patch: Partial<RoomElement>,
    record = false,
  ) {
    if (record) remember();
    update((current) => ({
      ...current,
      room: {
        ...current.room,
        elements: current.room.elements.map((element) =>
          element.id === id ? { ...element, ...patch } : element,
        ),
      },
    }));
  }

  function addElement(kind: ElementKind) {
    const count = room.elements.length;
    const element = defaultElement(
      kind,
      0.5 + ((count % 3) - 1) * 0.08,
      0.5 + ((Math.floor(count / 3) % 3) - 1) * 0.08,
    );
    applyRoom({ ...room, elements: [...room.elements, element] });
    setSelectedId(element.id);
  }

  function addFromGear(gearId: string) {
    const gearItem = data.gear.find((entry) => entry.id === gearId);
    if (!gearItem) return;
    const count = room.elements.length;
    const element = defaultElement(
      gearKind(gearItem.category),
      0.5 + ((count % 3) - 1) * 0.08,
      0.5 + ((Math.floor(count / 3) % 3) - 1) * 0.08,
      gearItem.name,
    );
    element.gearItemId = gearItem.id;
    element.fovDeg = gearItem.defaults.fovDeg ?? element.fovDeg;
    element.sensorWidthMm = gearItem.defaults.sensorWidthMm;
    element.beamDeg = gearItem.defaults.beamDeg ?? element.beamDeg;
    element.rangeM = gearItem.defaults.rangeM ?? element.rangeM;
    element.lightType = gearItem.defaults.lightType ?? element.lightType;
    element.temperature = gearItem.defaults.temperature ?? element.temperature;
    applyRoom({ ...room, elements: [...room.elements, element] });
    setSelectedId(element.id);
  }

  function removeElement(id: string) {
    remember();
    update((current) => ({
      ...current,
      room: {
        ...current.room,
        elements: current.room.elements.filter((element) => element.id !== id),
      },
      shots: current.shots.map((shot) =>
        shot.cameraElementId === id ? { ...shot, cameraElementId: null } : shot,
      ),
    }));
    setSelectedId(null);
  }

  async function handleFile(file: File) {
    setError(null);
    try {
      const image = await fileToPlanImage(file);
      applyRoom({
        ...room,
        image: image.dataUrl,
        imageWidth: image.width,
        imageHeight: image.height,
        pxPerMeter: null,
        scaleMode: "indicatif",
      });
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } catch {
      setError("Impossible de lire cette image. Essaie un JPG ou un PNG.");
    }
  }

  function startCalibration() {
    setCalibrating(true);
    setPoints([]);
    setSelectedId(null);
  }

  function setScaleMode(mode: ScaleMode) {
    if (mode === "echelle" && !room.pxPerMeter) {
      startCalibration();
      return;
    }
    applyRoom({ ...room, scaleMode: mode });
  }

  function confirmCalibration() {
    const value = Number(meters.replace(",", "."));
    if (points.length !== 2 || !Number.isFinite(value) || value <= 0) return;
    const pixelDistance = distance(
      points[0].x * room.imageWidth,
      points[0].y * room.imageHeight,
      points[1].x * room.imageWidth,
      points[1].y * room.imageHeight,
    );
    const pxPerMeter = calibrate(pixelDistance, value);
    if (pxPerMeter) {
      applyRoom({ ...room, pxPerMeter, scaleMode: "echelle" });
    }
    setCalibrationOpen(false);
    setCalibrating(false);
    setPoints([]);
  }

  function undo() {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setFuture((current) => [structuredClone(project.room), ...current].slice(0, 30));
    update((current) => ({ ...current, room: previous }));
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setFuture((current) => current.slice(1));
    setHistory((current) => [...current, structuredClone(project.room)].slice(-30));
    update((current) => ({ ...current, room: next }));
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function onPlanClick(event: React.MouseEvent<HTMLDivElement>) {
    if (calibrating) {
      const plan = planRef.current;
      if (!plan) return;
      const rect = plan.getBoundingClientRect();
      const point = {
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
      };
      const next = [...points, point];
      if (next.length >= 2) {
        setPoints(next.slice(0, 2));
        setCalibrationOpen(true);
      } else {
        setPoints(next);
      }
      return;
    }
    if (!panRef.current?.moved) setSelectedId(null);
  }

  function startDrag(event: React.PointerEvent, element: RoomElement) {
    if (element.locked || calibrating) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(element.id);
    const plan = planRef.current;
    if (!plan) return;
    const rect = plan.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = element.x;
    const originY = element.y;
    remember();

    function move(moveEvent: PointerEvent) {
      const dx = (moveEvent.clientX - startX) / rect.width;
      const dy = (moveEvent.clientY - startY) / rect.height;
      updateElement(
        element.id,
        {
          x: clamp(originX + dx, 0.01, 0.99),
          y: clamp(originY + dy, 0.01, 0.99),
        },
        false,
      );
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onCanvasPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (calibrating || zoom <= 1) return;
    if ((event.target as HTMLElement).closest("[data-room-element]")) return;
    panRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onCanvasPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = panRef.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) current.moved = true;
    setPan({ x: current.originX + dx, y: current.originY + dy });
  }

  function onCanvasPointerUp() {
    panRef.current = null;
  }

  const scaleReady = room.scaleMode === "echelle" && Boolean(room.pxPerMeter);

  return (
    <div className="min-h-screen">
      <div className="border-b border-line px-5 py-6 sm:px-8">
        <PageHeader
          eyebrow="Salle"
          title={room.name}
          description="Importe un plan, pose tes caméras, tes lumières et tes décors. Les cônes se recalculent quand tu tournes un élément."
          actions={
            <>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer size={15} />
                Imprimer
              </Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload size={15} />
                Importer un plan
              </Button>
              <Button variant="primary" onClick={startCalibration}>
                <Ruler size={15} />
                Calibrer
              </Button>
            </>
          }
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_330px] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1 border-b border-line bg-paper px-3 py-2 sm:px-4">
            <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Ajouter
            </span>
            {ADD_KINDS.map((kind) => {
              const Icon = KIND_ICONS[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => addElement(kind)}
                  className="inline-flex h-8 items-center gap-1.5 border border-transparent px-2 font-mono text-[9px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-line hover:bg-white/60 hover:text-ink"
                >
                  <Icon size={13} />
                  {ELEMENT_KIND_LABELS[kind]}
                </button>
              );
            })}
            {data.gear.length > 0 ? (
              <Select
                value=""
                onChange={(event) => {
                  if (event.target.value) addFromGear(event.target.value);
                }}
                aria-label="Ajouter depuis mon matériel"
                className="ml-1 h-8 w-auto max-w-40 border-line bg-white/60 font-mono text-[9px] uppercase tracking-[0.06em]"
              >
                <option value="">Mon matériel…</option>
                {data.gear.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            ) : null}

            <div className="ml-auto flex items-center gap-0.5">
              <IconButton
                label="Annuler"
                disabled={history.length === 0}
                onClick={undo}
              >
                <Undo2 size={15} />
              </IconButton>
              <IconButton
                label="Rétablir"
                disabled={future.length === 0}
                onClick={redo}
              >
                <Redo2 size={15} />
              </IconButton>
              <span className="mx-1 h-5 w-px bg-line" />
              <IconButton
                label="Zoom arrière"
                onClick={() => {
                  setZoom((value) => {
                    const next = Math.max(1, value - 0.25);
                    if (next === 1) setPan({ x: 0, y: 0 });
                    return next;
                  });
                }}
              >
                <Minus size={15} />
              </IconButton>
              <span className="w-10 text-center font-mono text-[10px] text-muted">
                {Math.round(zoom * 100)}%
              </span>
              <IconButton
                label="Zoom avant"
                onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
              >
                <Plus size={15} />
              </IconButton>
              <IconButton
                label="Recentrer"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                <RotateCcw size={14} />
              </IconButton>
            </div>
          </div>

          {error ? (
            <div className="border-b border-danger/30 bg-danger/10 px-4 py-2 text-xs text-danger">
              {error}
            </div>
          ) : null}

          {calibrating ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange/30 bg-orange/10 px-4 py-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-orange">
                Calibrage — clique deux points dont tu connais la distance réelle
              </div>
              <button
                type="button"
                onClick={() => {
                  setCalibrating(false);
                  setPoints([]);
                }}
                className="font-mono text-[9px] uppercase tracking-[0.12em] text-orange underline underline-offset-2"
              >
                Annuler
              </button>
            </div>
          ) : null}

          {!scaleReady && !calibrating ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/25 bg-cyan/10 px-4 py-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#2E7A8C]">
                Plan indicatif — calibre pour obtenir des cônes à l'échelle
              </div>
              <button
                type="button"
                onClick={startCalibration}
                className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#2E7A8C] underline underline-offset-2"
              >
                Calibrer
              </button>
            </div>
          ) : null}

          <div
            className={cn(
              "relative h-[54vh] min-h-[360px] overflow-hidden bg-[#0B1418] lg:h-[calc(100vh-232px)]",
              calibrating ? "cursor-crosshair" : zoom > 1 ? "cursor-grab" : "cursor-default",
            )}
            onPointerDown={onCanvasPointerDown}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerCancel={onCanvasPointerUp}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
          >
            {room.image ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                  className="relative w-full max-w-5xl transition-transform duration-150"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                >
                  <div
                    ref={planRef}
                    className="relative w-full touch-none select-none"
                    style={{ aspectRatio: `${room.imageWidth} / ${room.imageHeight}` }}
                    onClick={onPlanClick}
                  >
                    <img
                      src={room.image}
                      alt="Plan de la salle"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-fill"
                    />

                    <svg
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      viewBox={`0 0 ${room.imageWidth} ${room.imageHeight}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      {room.elements.map((element) => {
                        if (element.kind === "camera" || element.kind === "light") {
                          const isCamera = element.kind === "camera";
                          const radius =
                            room.scaleMode === "echelle" && room.pxPerMeter
                              ? element.rangeM * room.pxPerMeter
                              : Math.min(room.imageWidth, room.imageHeight) * 0.3;
                          const color = isCamera
                            ? "#F05A28"
                            : lightColor(element.temperature);
                          const angle = isCamera ? element.fovDeg : element.beamDeg;
                          return (
                            <path
                              key={`cone-${element.id}`}
                              d={conePath(
                                element.x * room.imageWidth,
                                element.y * room.imageHeight,
                                radius,
                                angle,
                                element.rotation,
                              )}
                              fill={color}
                              fillOpacity={element.id === selectedId ? 0.18 : 0.1}
                              stroke={color}
                              strokeOpacity={element.id === selectedId ? 0.85 : 0.45}
                              strokeWidth={element.id === selectedId ? 3 : 2}
                            />
                          );
                        }
                        if (element.kind === "person") {
                          const cx = element.x * room.imageWidth;
                          const cy = element.y * room.imageHeight;
                          const angle = (element.facingDeg * Math.PI) / 180;
                          const length = 64;
                          return (
                            <g key={`face-${element.id}`}>
                              <line
                                x1={cx}
                                y1={cy}
                                x2={cx + length * Math.cos(angle)}
                                y2={cy + length * Math.sin(angle)}
                                stroke="#F2F3EF"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                opacity={0.55}
                              />
                              <circle
                                cx={cx + length * Math.cos(angle)}
                                cy={cy + length * Math.sin(angle)}
                                r={5}
                                fill="#F2F3EF"
                                opacity={0.7}
                              />
                            </g>
                          );
                        }
                        return null;
                      })}

                      {calibrating && points.length > 0 ? (
                        <g>
                          <circle
                            cx={points[0].x * room.imageWidth}
                            cy={points[0].y * room.imageHeight}
                            r={9}
                            fill="#F05A28"
                            stroke="#fff"
                            strokeWidth={3}
                          />
                          {points[1] ? (
                            <>
                              <line
                                x1={points[0].x * room.imageWidth}
                                y1={points[0].y * room.imageHeight}
                                x2={points[1].x * room.imageWidth}
                                y2={points[1].y * room.imageHeight}
                                stroke="#F05A28"
                                strokeWidth={4}
                                strokeDasharray="10 8"
                              />
                              <circle
                                cx={points[1].x * room.imageWidth}
                                cy={points[1].y * room.imageHeight}
                                r={9}
                                fill="#F05A28"
                                stroke="#fff"
                                strokeWidth={3}
                              />
                            </>
                          ) : null}
                        </g>
                      ) : null}

                      {room.pxPerMeter && room.scaleMode === "echelle" ? (
                        <g>
                          <line
                            x1={60}
                            y1={room.imageHeight - 50}
                            x2={60 + room.pxPerMeter}
                            y2={room.imageHeight - 50}
                            stroke="#5FB3C9"
                            strokeWidth={5}
                          />
                          <line
                            x1={60}
                            y1={room.imageHeight - 62}
                            x2={60}
                            y2={room.imageHeight - 38}
                            stroke="#5FB3C9"
                            strokeWidth={5}
                          />
                          <line
                            x1={60 + room.pxPerMeter}
                            y1={room.imageHeight - 62}
                            x2={60 + room.pxPerMeter}
                            y2={room.imageHeight - 38}
                            stroke="#5FB3C9"
                            strokeWidth={5}
                          />
                          <text
                            x={60 + room.pxPerMeter / 2}
                            y={room.imageHeight - 68}
                            textAnchor="middle"
                            fill="#5FB3C9"
                            fontSize={22}
                            fontFamily="monospace"
                          >
                            1 m
                          </text>
                        </g>
                      ) : null}
                    </svg>

                    {room.elements.map((element) => {
                      const Icon = KIND_ICONS[element.kind];
                      const isSelected = element.id === selectedId;
                      return (
                        <div
                          key={element.id}
                          data-room-element
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${element.x * 100}%`,
                            top: `${element.y * 100}%`,
                            zIndex: element.z + (isSelected ? 100 : 0),
                          }}
                        >
                          <button
                            type="button"
                            aria-label={element.label}
                            onPointerDown={(event) => startDrag(event, element)}
                            onClick={(event) => event.stopPropagation()}
                            className={cn(
                              "flex h-9 w-9 touch-none items-center justify-center border-2 shadow-[0_4px_14px_rgba(0,0,0,0.45)] transition-[box-shadow,transform] hover:scale-110",
                              KIND_STYLES[element.kind],
                              isSelected && "ring-2 ring-white ring-offset-2 ring-offset-[#0B1418]",
                              element.locked && "border-dashed opacity-80",
                            )}
                          >
                            <Icon size={16} />
                          </button>
                          <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap border border-white/10 bg-[#0B1418]/90 px-1.5 py-0.5 font-mono text-[8px] text-paper/75">
                            {element.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-cyan/40 text-cyan">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-paper">
                    Importe ton plan de salle
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-paper/50">
                    Une photo à plat, un export PDF ou un plan d'architecte. Tu poseras
                    ensuite tes caméras et tes lumières par-dessus.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="primary" onClick={() => fileRef.current?.click()}>
                    <Upload size={15} />
                    Choisir une image
                  </Button>
                  <Button
                    variant="outline"
                    className="border-paper/30 text-paper hover:bg-white/10"
                    onClick={() =>
                      applyRoom({
                        ...room,
                        image: BLANK_PLAN,
                        imageWidth: 1600,
                        imageHeight: 1000,
                        pxPerMeter: null,
                        scaleMode: "indicatif",
                      })
                    }
                  >
                    Plan vierge
                  </Button>
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
                  Tu peux aussi glisser-déposer une image ici
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line bg-paper px-4 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
            <span>{room.elements.length} éléments</span>
            <span>
              {room.pxPerMeter
                ? `1 m = ${Math.round(room.pxPerMeter)} px`
                : "Échelle non calibrée"}
            </span>
            <span>
              {cameras.length} caméra{cameras.length > 1 ? "s" : ""}
            </span>
            <span className="ml-auto hidden sm:inline">
              Glisse un élément pour le déplacer
            </span>
          </div>
        </div>

        <aside className="border-t border-line bg-paper p-4 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
          {selected ? (
            <ElementInspector
              element={selected}
              onChange={(patch, record) => updateElement(selected.id, patch, record)}
              onDelete={() => removeElement(selected.id)}
              onRemember={remember}
            />
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  Plan de salle
                </div>
                <div className="font-display text-lg font-bold tracking-tight">
                  Régler la salle
                </div>
              </div>

              <Field label="Nom de la salle">
                <Input
                  value={room.name}
                  onFocus={remember}
                  onChange={(event) =>
                    update((current) => ({
                      ...current,
                      room: { ...current.room, name: event.target.value },
                    }))
                  }
                />
              </Field>

              <Field label="Échelle">
                <Segmented
                  value={room.scaleMode}
                  onChange={setScaleMode}
                  options={[
                    { value: "indicatif", label: "Indicatif" },
                    { value: "echelle", label: "À l'échelle" },
                  ]}
                />
              </Field>

              <div className="border border-line bg-white/40 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  Étalonnage
                </div>
                <div className="mt-1 text-sm">
                  {room.pxPerMeter
                    ? `${Math.round(room.pxPerMeter)} px par mètre`
                    : "Non calibré"}
                </div>
                <Button size="sm" variant="outline" className="mt-2" onClick={startCalibration}>
                  <Ruler size={13} />
                  {room.pxPerMeter ? "Recalibrer" : "Calibrer le plan"}
                </Button>
              </div>

              <div className="border border-line bg-white/40 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  Image
                </div>
                <div className="mt-1 text-sm">
                  {room.image
                    ? `${room.imageWidth} × ${room.imageHeight} px`
                    : "Aucune image"}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload size={13} />
                    {room.image ? "Remplacer" : "Importer"}
                  </Button>
                  {room.image ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        applyRoom({
                          ...room,
                          image: null,
                          imageWidth: 1600,
                          imageHeight: 1000,
                          pxPerMeter: null,
                          scaleMode: "indicatif",
                        })
                      }
                    >
                      Retirer
                    </Button>
                  ) : null}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-muted">
                Clique un élément du plan pour régler son angle, sa portée et sa note.
                Les caméras projettent leur champ, les lumières leur faisceau.
              </p>

              <div className="border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                <div className="flex items-center gap-1.5">
                  <Camera size={12} className="text-orange" /> Caméra
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Lightbulb size={12} className="text-amber" /> Lumière
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Mic size={12} className="text-cyan" /> Micro
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <User size={12} className="text-paper" /> Personne
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={calibrationOpen}
        onClose={() => {
          setCalibrationOpen(false);
          setPoints([]);
        }}
        title="Distance réelle"
        eyebrow="Calibrage du plan"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCalibrationOpen(false);
                setPoints([]);
              }}
            >
              Annuler
            </Button>
            <Button variant="primary" onClick={confirmCalibration}>
              Valider l'échelle
            </Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-muted">
          Tu as tracé un segment entre deux points. Quelle est sa longueur réelle ?
        </p>
        <Field label="Longueur en mètres">
          <div className="relative">
            <Input
              autoFocus
              type="number"
              min={0.1}
              step={0.1}
              value={meters}
              onChange={(event) => setMeters(event.target.value)}
              className="pr-8 font-mono"
            />
            <span className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-muted">
              m
            </span>
          </div>
        </Field>
      </Modal>

      <div className="hidden print:block">
        <div className="mb-4 border-b border-black pb-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Scenopia — Plan de salle
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold">{project.title}</h2>
          <div className="mt-1 font-mono text-[10px]">
            {room.name} · {room.scaleMode === "echelle" ? "à l'échelle" : "indicatif"}
          </div>
        </div>
        {room.image ? (
          <img src={room.image} alt="" className="mb-4 w-full border border-black" />
        ) : null}
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1 pr-2 font-mono">Type</th>
              <th className="py-1 pr-2 font-mono">Élément</th>
              <th className="py-1 font-mono">Note</th>
            </tr>
          </thead>
          <tbody>
            {room.elements.map((element) => (
              <tr key={element.id} className="border-b border-neutral-300">
                <td className="py-1.5 pr-2">{ELEMENT_KIND_LABELS[element.kind]}</td>
                <td className="py-1.5 pr-2">{element.label}</td>
                <td className="py-1.5">{element.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
