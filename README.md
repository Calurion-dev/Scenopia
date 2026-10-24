# Scenopia

Le second cerveau du tournage. Scenopia réunit la préparation et le jour J dans une seule application : conducteur d'interview, liste de plans, plan de salle 2D, planning horaire et mode plateau.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Un tournage de démonstration est créé au premier lancement.

## Ce que fait l'application

- **Accueil** : une carte par tournage, prochain tournage mis en avant, duplication et suppression.
- **Conducteur** : sections, questions, notes et minutage. Les plans restent conservés si une section ou une question est supprimée.
- **Plans** : numéro de slate, valeur, angle, mouvement, optique, durée, caméra, statut (à tourner, tourné, à refaire, abandonné), filtres et impression.
- **Salle** : import d'un plan existant ou plan vierge, caméras, lumières, micros, personnes et décor. Cônes de champ et de lumière, calibration à l'échelle ou mode indicatif, zoom, déplacement, undo/redo, inspecteur et impression.
- **Planning** : une journée, blocs horaires (installation, tournage, pause, repas, démontage), démarrage et fin réels, marge, feuille de service imprimable.
- **Aujourd'hui** : mode moniteur sombre, bloc en cours, compte à rebours, plans à cocher, notes de journée et accès direct au plan de salle.
- **Matériel** : bibliothèque personnelle réutilisée dans les plans et la salle.
- **Données** : export/import JSON, rechargement de la démo, installation PWA.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, lucide-react, Vitest.

## Tests

```bash
npm test
npm run build
```

Les tests unitaires couvrent les calculs de champ de vision, de calibration, de cônes, de durées et de planning.

## Données et limites

Les données sont stockées **sur l'appareil** dans `localStorage`, sous la clé `scenopia.v1`. Il n'y a pas encore de compte ni de synchronisation cloud : un tournage créé sur un ordinateur n'apparaît pas sur une tablette. Utiliser **Données → Exporter** pour sauvegarder, et **Importer** pour transférer.

L'application est installable en PWA, mais son chargement initial nécessite le réseau : il n'y a pas encore de service worker qui mettrait la coque en cache. Une fois la page ouverte, les données locales restent disponibles.

Le cahier des charges complet est dans [`docs/superpowers/specs/2026-10-24-logiciel-planification-tournage-design.md`](docs/superpowers/specs/2026-10-24-logiciel-planification-tournage-design.md).

## Structure

```
src/app/            pages Accueil, Matériel, Données, Projet
src/components/     coque projet, vues, composants UI
src/lib/            types, store local, calculs salle/planning, seed, démo
public/             icône et manifeste PWA
```
