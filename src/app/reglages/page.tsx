"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Download,
  HardDrive,
  RotateCcw,
  Smartphone,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  PageHeader,
  cn,
} from "@/components/ui";
import {
  exportData,
  parseData,
  useStore,
} from "@/lib/store";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-white/45 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-extrabold tracking-tight">
        {value}
      </div>
    </div>
  );
}

export default function ReglagesPage() {
  const { data, replaceData, resetDemo, storageError } = useStore();
  const [confirm, setConfirm] = useState<"reset" | "erase" | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const bytes = new Blob([JSON.stringify(data)]).size;
  const size =
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
      : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

  async function importFile(file: File) {
    setMessage(null);
    const text = await file.text();
    const parsed = parseData(text);
    if (!parsed) {
      setMessage({
        tone: "error",
        text: "Ce fichier n'est pas une sauvegarde Scenopia valide.",
      });
      return;
    }
    replaceData(parsed);
    setMessage({ tone: "ok", text: "Sauvegarde importée sur cet appareil." });
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
          eyebrow="Réglages"
          title="Données"
          description="Tes tournages vivent dans ce navigateur. Exporte une sauvegarde avant de changer d'appareil."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <section className="border border-line bg-white/45">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <Database size={15} className="text-orange" />
                <h2 className="font-display text-base font-bold">Sauvegarde</h2>
              </div>
              <div className="space-y-3 p-4">
                <p className="text-sm leading-relaxed text-muted">
                  Le fichier exporté contient tous les tournages, les conducteurs, les
                  plans, les plans de salle et la bibliothèque de matériel.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" onClick={() => exportData(data)}>
                    <Download size={15} />
                    Exporter mes données
                  </Button>
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload size={15} />
                    Importer une sauvegarde
                  </Button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importFile(file);
                    event.target.value = "";
                  }}
                />
                {message ? (
                  <div
                    className={cn(
                      "border px-3 py-2 text-xs",
                      message.tone === "ok"
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-danger/30 bg-danger/10 text-danger",
                    )}
                  >
                    {message.text}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="border border-line bg-white/45">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <RotateCcw size={15} className="text-cyan" />
                <h2 className="font-display text-base font-bold">Démonstration</h2>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <p className="max-w-md text-sm leading-relaxed text-muted">
                  Recharge le tournage d'exemple pour explorer l'application. Tes
                  tournages existants sont conservés.
                </p>
                <Button variant="outline" onClick={() => setConfirm("reset")}>
                  <RotateCcw size={14} />
                  Recharger la démo
                </Button>
              </div>
            </section>

            <section className="border border-danger/30 bg-danger/[0.04]">
              <div className="flex items-center gap-2 border-b border-danger/20 px-4 py-3">
                <Trash2 size={15} className="text-danger" />
                <h2 className="font-display text-base font-bold text-danger">
                  Effacer toutes les données
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <p className="max-w-md text-sm leading-relaxed text-muted">
                  Supprime définitivement tous les tournages et le matériel de cet
                  appareil. Pense à exporter avant.
                </p>
                <Button variant="danger" onClick={() => setConfirm("erase")}>
                  <Trash2 size={14} />
                  Tout effacer
                </Button>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Tournages" value={String(data.projects.length)} />
              <Stat label="Matériel" value={String(data.gear.length)} />
              <Stat label="Stockage" value={size} />
              <Stat
                label="Version"
                value="0.1"
              />
            </div>

            <div className="border border-line bg-ink p-4 text-paper">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-orange">
                <HardDrive size={13} />
                Données locales
              </div>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">
                Scenopia fonctionne aujourd'hui sans compte : tout est enregistré dans
                ce navigateur. La synchronisation entre appareils n'est pas encore
                branchée.
              </p>
              {storageError ? (
                <p className="mt-2 border border-danger/40 bg-danger/10 px-2 py-1 text-xs text-danger">
                  {storageError}
                </p>
              ) : null}
            </div>

            <div className="border border-line bg-white/45 p-4">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan">
                <Smartphone size={13} />
                Sur le plateau
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Installe Scenopia sur l'écran d'accueil de la tablette ou du téléphone
                pour l'ouvrir en plein écran.
              </p>
              {installPrompt ? (
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={async () => {
                    await installPrompt.prompt();
                    setInstallPrompt(null);
                  }}
                >
                  <Download size={14} />
                  Installer Scenopia
                </Button>
              ) : (
                <p className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-muted">
                  Menu du navigateur → Installer / Ajouter à l'écran d'accueil
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title={confirm === "reset" ? "Recharger la démo ?" : "Tout effacer ?"}
        eyebrow="Données"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm === "reset") resetDemo();
                if (confirm === "erase") {
                  replaceData({ version: 1, projects: [], gear: [] });
                }
                setConfirm(null);
                setMessage({
                  tone: "ok",
                  text:
                    confirm === "reset"
                      ? "Tournage de démonstration rechargé."
                      : "Toutes les données ont été effacées.",
                });
              }}
            >
              {confirm === "reset" ? "Recharger" : "Tout effacer"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          {confirm === "reset"
            ? "Le tournage de démonstration sera ajouté à nouveau. Tes tournages existants ne bougent pas."
            : "Cette action supprime tous les tournages et le matériel de cet appareil. Elle est définitive."}
        </p>
      </Modal>
    </div>
  );
}
