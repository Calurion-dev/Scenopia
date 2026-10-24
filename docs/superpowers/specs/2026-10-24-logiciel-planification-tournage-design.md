# Cahier des charges — « Scenopia »

**Logiciel de préparation et de conduite de tournage**

Version 1.0 — 24 octobre 2026
Statut : proposition à valider
Périmètre : MVP web, PC / tablette / téléphone

> Scenopia est le nom du produit.

---

## 1. Résumé exécutif

« Scenopia » est une application web personnelle qui réunit en un seul endroit tout ce qu'il faut pour préparer puis tourner une vidéo : le conducteur (les questions ou le texte), la liste des plans, le plan de la salle avec les caméras et les lumières, et le planning de la journée.

Le produit est conçu pour un créateur seul, qui débute dans l'organisation de tournage. Il ne cherche pas à lui apprendre une méthode : il lui donne une structure claire qui rend la méthode évidente. Le jour du tournage, une vue unique, « Aujourd'hui », rassemble l'essentiel pour qu'il n'ait plus qu'à agir.

Le projet part de zéro : aucun code n'existe encore.

---

## 2. Contexte et problème

L'utilisateur initial produit des vidéos de type podcast : une interview à deux (un journaliste, une personne interviewée), en intérieur, avec un objectif de présentation de métier. Il dispose de son matériel. Il n'a jamais utilisé d'outil de préparation de tournage.

Son problème n'est pas le manque d'information, mais **la dispersion et l'absence de fil conducteur** : les questions sont dans un document, les idées de plans dans la tête, le plan de la salle sur un papier, les horaires nulle part. Le jour J, il doit reconstituer mentalement ce qu'il avait prévu.

Les outils existants couvrent chacun un morceau :

- les outils de mise en scène (Shot Designer, Previs Pro) excellent sur le plan de salle mais ignorent le planning et le conducteur ;
- les outils de production (StudioBinder, Celtx, CineLog, Fuzzlecheck, Soldum) excellent sur le planning et le dépouillement mais réduisent le décor à un nom de lieu ;
- les outils de storyboard (Boords, Storyflow) soignent l'image mais ignorent la salle et la journée.

Aucun ne réunit **conducteur → plans → salle → planning → jour J** dans une interface simple, en français, utilisable sur PC, tablette et téléphone avec synchronisation.

---

## 3. Objectifs

### 3.1 Objectif produit

Être le **second cerveau du tournage** : toutes les informations nécessaires sont saisies une fois, reliées entre elles, et présentées au bon moment — en préparation comme sur le plateau.

Citation de référence de l'utilisateur :

> « Le logiciel doit être mon second cerveau, il doit tout me présenter afin que le jour du tournage je n'aie plus à réfléchir mais qu'à agir. »

### 3.2 Critères de succès

Le produit est réussi si :

1. **Préparation complète** : créer un tournage de A à Z (conducteur, 8 plans, salle avec 6 éléments, planning d'une journée) prend moins de 30 minutes la première fois, moins de 10 minutes pour un tournage similaire.
2. **Jour J** : depuis la vue « Aujourd'hui », toute information utile (prochain bloc, plan à tourner, plan de salle, question à poser) est atteignable en **deux gestes maximum**.
3. **Fiabilité** : une modification faite sur un appareil apparaît sur les autres en moins de 5 secondes lorsqu'ils sont en ligne ; aucune saisie n'est perdue hors ligne.
4. **Autonomie** : l'utilisateur n'a plus besoin d'un autre document (papier, tableur, note) pour préparer ou tourner.
5. **Usage réel** : le produit est utilisé sur au moins trois tournages consécutifs sans retour à l'ancienne méthode.

### 3.3 Non-objectifs (MVP)

Ces éléments sont explicitement hors périmètre de la première version :

- 3D, rendu photoréaliste, simulation photométrique de la lumière ;
- budget, devis, comptabilité, gestion de paie ;
- gestion d'équipe, rôles, permissions, collaboration multi-utilisateurs ;
- storyboard dessiné, import de storyboard, génération d'images ;
- écriture de scénario de fiction au format industriel (FDX, Fountain), correcteur de mise en page ;
- IA générative, suggestions automatiques, apprentissage ;
- applications natives iOS/Android (une PWA installable suffit) ;
- synchronisation avec Google Calendar, Outlook, Notion ;
- prompteur, capture vidéo, montage.

### 3.4 Anti-objectifs

Le produit échoue même s'il fonctionne techniquement si :

- il ajoute de la saisie sans retirer de charge mentale ;
- il oblige à naviguer pendant le tournage ;
- il devient un tableur déguisé ;
- il impose une méthode pédagogique ou des tutoriels non demandés ;
- il est plus lent à ouvrir qu'un document papier.

L'utilisateur a été clair : **« Je ne veux pas que le logiciel me donne la méthode. »** La structure de l'outil doit guider, pas professer.

---

## 4. Utilisateur et parcours

### 4.1 Profil

- Créateur vidéo indépendant, seul sur le tournage.
- Produit des interviews / podcasts en intérieur, deux personnes face à face.
- Possède son matériel (caméra, lumières, micros).
- À l'aise avec un ordinateur et une tablette, pas nécessairement avec le vocabulaire de la production.
- Utilise principalement un PC Windows pour la préparation, une tablette ou un téléphone sur le plateau.

### 4.2 Les trois temps

**Avant — préparer.**
Créer le tournage, écrire les questions, découper en plans, importer le plan de la salle et y placer caméras, lumières et personnes, construire la journée heure par heure.

**Pendant — tourner.**
Ouvrir « Aujourd'hui ». Voir le bloc en cours, la prochaine étape, cocher les plans tournés, noter un imprévu, consulter le plan de salle.

**Après — clôturer.**
Marquer le tournage comme tourné, exporter le dossier (PDF) pour archivage, dupliquer le tournage comme modèle pour le suivant.

### 4.3 Cas d'usage de référence

Tournage « Portrait de métier — épisode 1 » :

- une journée, de 9 h à 17 h ;
- deux personnes : journaliste et invité ;
- cinq sections de questions ;
- huit plans : un plan large deux personnes, un plan journaliste, un plan invité, un contrechamp, trois inserts (mains, écran, détail décor) ;
- une salle : plan importé, deux caméras, trois lumières, deux micros, une table, deux chaises ;
- le jour J, l'utilisateur ouvre la vue « Aujourd'hui » et coche les plans au fur et à mesure.

---

## 5. Périmètre fonctionnel

Chaque exigence est identifiée pour être testable et traçable. Les priorités sont :

- **P0** : indispensable au MVP ;
- **P1** : attendu, peut arriver dans une seconde livraison ;
- **P2** : plus tard, hors MVP.

### 5.1 Compte, synchronisation et hors-ligne

| ID | Priorité | Exigence |
|---|---|---|
| RF-COM-01 | P0 | Créer un compte et se connecter par lien magique envoyé par e-mail (pas de mot de passe à retenir). |
| RF-COM-02 | P0 | La session persiste entre les visites ; la déconnexion est explicite. |
| RF-COM-03 | P0 | Chaque utilisateur ne voit que ses propres données (isolation au niveau base de données). |
| RF-COM-04 | P0 | Chaque modification est enregistrée automatiquement et synchronisée avec le cloud. |
| RF-COM-05 | P0 | Un indicateur permanent montre l'état : « synchronisé », « synchronisation… », « hors ligne », « en attente ». |
| RF-COM-06 | P0 | Deux appareils connectés au même compte voient les modifications en quasi-temps réel (moins de 5 s). |
| RF-COM-07 | P0 | Hors ligne : l'application s'ouvre, le dernier tournage consulté est lisible, et les modifications sont mises en file d'attente puis rejouées au retour du réseau. |
| RF-COM-13 | P0 | Un bouton « Rendre disponible hors ligne » télécharge explicitement un tournage complet (données, image du plan) sur l'appareil, avec un indicateur et la date du dernier téléchargement. Le tournage du jour est proposé automatiquement au téléchargement. |
| RF-COM-08 | P0 | En cas de conflit entre deux appareils, la dernière modification enregistrée gagne (last-write-wins par enregistrement), sans perte silencieuse : un message signale le remplacement. |
| RF-COM-09 | P0 | L'application est installable comme PWA (icône, plein écran, démarrage rapide). |
| RF-COM-10 | P1 | Export complet des données du compte au format JSON. |
| RF-COM-11 | P0 | Suppression définitive du compte et de toutes les données, avec confirmation. |
| RF-COM-12 | P1 | Changement d'appareil sans friction : se connecter suffit, tout est déjà là. |

**Critère d'acceptation.** Couper le réseau, modifier un plan, le cocher, recharger l'application : la modification est visible. Rétablir le réseau : l'indicateur passe à « synchronisé » et l'autre appareil affiche la modification.

### 5.2 Accueil — tableau de bord des tournages

| ID | Priorité | Exigence |
|---|---|---|
| RF-ACC-01 | P0 | L'accueil affiche les tournages sous forme de cartes, une carte par tournage. |
| RF-ACC-02 | P0 | Chaque carte montre : titre, date de tournage, statut, vignette du plan de salle (ou visuel de remplacement), progression des plans (tournés / total). |
| RF-ACC-03 | P0 | Tri par défaut : tournages à venir par date croissante, puis tournages passés par date décroissante. |
| RF-ACC-04 | P0 | Créer un tournage (titre + date suffisent), le dupliquer, l'archiver, le supprimer avec confirmation. |
| RF-ACC-05 | P1 | Recherche par titre. |
| RF-ACC-06 | P1 | Filtre par statut (à venir, en préparation, prêt, tourné). |
| RF-ACC-07 | P0 | Si un tournage a lieu aujourd'hui, un accès direct « Aujourd'hui » est visible en haut de l'accueil. |
| RF-ACC-08 | P0 | État vide : une phrase simple et un bouton « Créer mon premier tournage ». |
| RF-ACC-09 | P0 | Dupliquer un tournage copie le conducteur, les plans, la salle (image et éléments) et le planning, mais réinitialise la date, les statuts, les notes de journée et la progression ; le titre devient « Copie de … ». |

### 5.3 Détail d'un tournage

| ID | Priorité | Exigence |
|---|---|---|
| RF-PRO-01 | P0 | L'en-tête affiche le titre, la date, le statut et la progression globale. |
| RF-PRO-02 | P0 | La navigation interne propose : Conducteur, Plans, Salle, Planning, Aujourd'hui. |
| RF-PRO-03 | P0 | Statuts du tournage : brouillon, en préparation, prêt, tourné, terminé. Changement manuel. |
| RF-PRO-04 | P1 | Notes générales du tournage (texte libre). |
| RF-PRO-05 | P0 | Le dernier onglet consulté est mémorisé par appareil. |

### 5.4 Conducteur

Le conducteur remplace le scénario pour un format interview : une trame de questions, organisée en sections.

| ID | Priorité | Exigence |
|---|---|---|
| RF-CON-01 | P0 | Créer des sections ordonnées : titre, durée prévue (minutes), notes. |
| RF-CON-02 | P0 | Ajouter des questions dans une section : texte de la question, notes, durée prévue. |
| RF-CON-03 | P0 | Modifier en place, supprimer avec confirmation, dupliquer, réordonner par glisser-déposer. |
| RF-CON-04 | P0 | La durée totale du conducteur est calculée et affichée. |
| RF-CON-05 | P1 | Une question sans plan associé est signalée discrètement. |
| RF-CON-06 | P1 | Mode lecture plein écran, texte agrandi, pour consultation sur le plateau. |
| RF-CON-07 | P2 | Import d'un texte brut ou d'un document pour préremplir les questions. |

**Règle de saisie.** Une question peut rester vide de notes et de durée : seuls le texte et la section sont obligatoires.

### 5.5 Plans

| ID | Priorité | Exigence |
|---|---|---|
| RF-PLA-01 | P0 | Un plan contient : numéro, description, section/question liée, valeur de plan, angle, mouvement, optique (mm), durée estimée, caméra associée (élément de la salle), statut, notes. |
| RF-PLA-02 | P0 | Les valeurs de plan proposées : très large, large, moyen, américain, rapproché, gros, très gros, insert. Un champ libre est possible. |
| RF-PLA-03 | P0 | Les mouvements proposés : fixe, panoramique, travelling, zoom, caméra épaule. Champ libre possible. |
| RF-PLA-04 | P0 | Statuts d'un plan : à tourner, tourné, à refaire, abandonné. |
| RF-PLA-05 | P0 | Numérotation automatique à la création, stable : un numéro supprimé n'est jamais réattribué. |
| RF-PLA-06 | P0 | Réordonner les plans ; dupliquer un plan. |
| RF-PLA-07 | P0 | Filtrer par statut et par section. |
| RF-PLA-08 | P0 | Afficher le nombre de plans et la durée estimée totale. |
| RF-PLA-09 | P1 | Signaler les sections sans aucun plan. |
| RF-PLA-10 | P1 | Associer un plan à une position de caméra de la salle ; le plan affiche alors l'optique et le cadrage prévus. |

**Critère d'acceptation.** Créer une section, trois questions, quatre plans liés ; le total des durées s'affiche ; cocher un plan le passe à « tourné » et met à jour la progression.

### 5.6 Salle — plan d'architecte

Le module central et différenciant. L'utilisateur importe un plan existant (photo d'un plan papier, export d'architecte, capture) et pose ses éléments dessus.

| ID | Priorité | Exigence |
|---|---|---|
| RF-SAL-01 | P0 | Créer une salle nommée et importer une image de plan (JPG, PNG, WebP, 10 Mo maximum), prise à plat ou exportée numériquement. Une rotation à 90° est possible. |
| RF-SAL-02 | P0 | L'image est affichée entière, ajustée à l'écran, sans déformation. |
| RF-SAL-03 | P0 | Navigation : déplacement, zoom molette sur PC, pincement sur tablette/téléphone, bouton « recadrer ». |
| RF-SAL-04 | P0 | Choix du mode : **indicatif** ou **à l'échelle**. Le mode est enregistré avec la salle. |
| RF-SAL-05 | P0 | En mode à l'échelle : calibrer en traçant un segment sur le plan et en saisissant sa longueur réelle en mètres. L'application en déduit l'échelle et affiche une barre d'échelle. |
| RF-SAL-06 | P0 | En mode indicatif : les cônes ont une taille relative fixe, sans conversion en mètres. |
| RF-SAL-07 | P0 | Palette d'éléments : caméra, lumière, micro, personne, décor/mobilier, autre. |
| RF-SAL-08 | P0 | Poser un élément par glisser-déposer ou par tap ; il apparaît au centre de la vue. |
| RF-SAL-09 | P0 | Déplacer, faire pivoter, redimensionner (décor et personnes), dupliquer, supprimer, verrouiller, changer l'ordre d'affichage. |
| RF-SAL-10 | P0 | Une caméra affiche un cône de champ orienté, dont l'angle est réglable (défaut 60°). L'angle peut être calculé à partir d'une largeur de capteur et d'une focale, ou saisi directement ; l'angle affiché reste la référence. |
| RF-SAL-11 | P0 | Une lumière affiche un cône orienté, avec angle de faisceau (défaut 60°), portée, type (principale, débouchage, contre, pratique) et température (chaude, neutre, froide) représentée par une teinte. |
| RF-SAL-12 | P0 | Une personne affiche un libellé (ex. « Journaliste », « Invité ») et une orientation. |
| RF-SAL-13 | P0 | Chaque élément possède un libellé et une note libre. |
| RF-SAL-14 | P0 | Annuler / rétablir les actions sur le plan (au moins 20 niveaux). |
| RF-SAL-15 | P0 | Grille optionnelle avec aimantation pour aligner les éléments. |
| RF-SAL-16 | P0 | Enregistrer la salle comme modèle réutilisable ; créer la salle d'un tournage à partir d'un modèle (copie indépendante). |
| RF-SAL-17 | P1 | Exporter le plan en PNG. |
| RF-SAL-18 | P1 | Légende automatique des éléments (icône, libellé, type). |
| RF-SAL-19 | P2 | Plusieurs salles par tournage (intérieur/extérieur). |
| RF-SAL-20 | P2 | Redresser une photo de plan prise en perspective (sélection des quatre coins). |

**Règles de calcul.**

- Échelle : `pixels_par_mètre = longueur_segment_px / longueur_réelle_m`.
- Champ de vision horizontal d'une caméra : `angle = 2 × atan((largeur_capteur / 2) / focale)`. L'angle peut aussi être saisi directement, sans capteur.
- Portée d'une lumière : en mode à l'échelle, convertie en pixels via l'échelle ; en mode indicatif, exprimée en unités relatives.
- Les coordonnées des éléments sont stockées en proportion de l'image (0 à 1), afin que l'affichage reste juste sur tous les écrans.

**Critère d'acceptation.** Importer un plan, le calibrer sur une porte de 0,90 m, poser une caméra à 3 m de l'invité : le cône couvre l'invité ; déplacer la caméra met le cône à jour ; rouvrir sur téléphone, le plan est identique.

### 5.7 Planning — une journée

| ID | Priorité | Exigence |
|---|---|---|
| RF-PLN-01 | P0 | Le planning porte sur une seule journée : date, heure de début, heure de fin souhaitée. |
| RF-PLN-02 | P0 | Blocs ordonnés : type (installation, tournage, pause, repas, démontage, autre), titre, durée en minutes, section/plan lié, notes, statut (à venir, en cours, terminé). |
| RF-PLN-03 | P0 | Les heures de début sont calculées automatiquement à partir de l'heure de début et des durées ; l'heure de fin est affichée. |
| RF-PLN-04 | P0 | Alerte visuelle si le total dépasse l'heure de fin souhaitée, avec le dépassement en minutes. |
| RF-PLN-05 | P0 | Réordonner les blocs par glisser-déposer ; dupliquer un bloc. |
| RF-PLN-06 | P0 | Un bloc de tournage peut être lié à une section ou à un plan. |
| RF-PLN-07 | P1 | Modèles de journée (ex. « interview 2 personnes, demi-journée »). |
| RF-PLN-08 | P1 | Afficher la durée totale de tournage et la durée totale de pauses. |

**Critère d'acceptation.** Créer une journée 9 h–17 h avec installation 45 min, trois blocs de tournage, une pause : les horaires se calculent, le total s'affiche, un dépassement est signalé.

### 5.8 Mode plateau — « Aujourd'hui »

| ID | Priorité | Exigence |
|---|---|---|
| RF-PLT-01 | P0 | Une vue dédiée rassemble l'essentiel du jour : date, heure courante, progression des plans, bloc en cours, bloc suivant. |
| RF-PLT-02 | P0 | La liste des plans est groupée par section, avec une action immédiate : « Tourné », « À refaire », « À tourner ». |
| RF-PLT-03 | P0 | Ajout rapide d'une note sur un plan ou sur la journée. |
| RF-PLT-04 | P0 | Accès en un geste au plan de salle et au conducteur. |
| RF-PLT-05 | P0 | Fonctionne hors ligne ; les changements se synchronisent au retour du réseau. |
| RF-PLT-06 | P0 | Cibles tactiles d'au moins 44 × 44 px, contraste élevé, lisibilité en extérieur. |
| RF-PLT-07 | P0 | Toute action destructrice demande une confirmation. |
| RF-PLT-08 | P1 | Marquer la journée comme terminée ; proposer de passer le tournage en « tourné ». |
| RF-PLT-09 | P2 | Minuteur de bloc et alerte de dépassement. |

**Critère d'acceptation.** À 10 h 15, avec un bloc 10 h–11 h, la vue affiche « En cours : Tournage — section 2 » et « Ensuite : Pause ». Cocher un plan met à jour la progression sans quitter l'écran.

### 5.9 Matériel — bibliothèque personnelle

| ID | Priorité | Exigence |
|---|---|---|
| RF-MAT-01 | P0 | Bibliothèque personnelle d'éléments réutilisables : caméras, optiques, lumières, micros, supports, décors. |
| RF-MAT-02 | P0 | Champs : nom, catégorie, icône, valeurs par défaut (angle de champ, angle de faisceau, portée, température), notes. |
| RF-MAT-03 | P0 | Ajouter, modifier, supprimer un élément ; la suppression n'affecte pas les éléments déjà posés sur un plan. |
| RF-MAT-04 | P0 | Poser un élément de la bibliothèque sur le plan : ses valeurs sont copiées à la pose, puis modifiables localement. |
| RF-MAT-05 | P0 | Une bibliothèque de départ générique est proposée (sans marque) : caméra, softbox, panneau LED, HMI, micro-cravate, micro canon, perche, table, chaise. |

### 5.10 Exports et impression

| ID | Priorité | Exigence |
|---|---|---|
| RF-EXP-01 | P0 | Export PDF du plan de salle : A4 paysage, titre, date, légende, barre d'échelle si mode à l'échelle. |
| RF-EXP-02 | P0 | Export PDF du planning : A4 portrait, horaires, blocs, totaux. |
| RF-EXP-03 | P0 | Export PDF de la liste des plans : numéro, description, valeur, mouvement, optique, durée, statut, notes. |
| RF-EXP-04 | P0 | Export PDF du conducteur : sections, questions, notes, durées. |
| RF-EXP-05 | P1 | Export « dossier de tournage » combinant les quatre documents. |
| RF-EXP-06 | P1 | Export PNG du plan seul. |
| RF-EXP-07 | P0 | Les exports respectent le format français : dates JJ/MM/AAAA, heures 24 h, virgule décimale. |

### 5.11 Réglages

| ID | Priorité | Exigence |
|---|---|---|
| RF-REG-01 | P0 | Profil : nom affiché, e-mail, fuseau horaire (Europe/Paris par défaut). |
| RF-REG-02 | P0 | Export des données et suppression du compte. |
| RF-REG-03 | P1 | Choix de la langue de l'interface (français par défaut ; anglais plus tard). |

---

## 6. Règles métier transverses

1. **Une seule source de vérité.** Un plan, une question, un bloc de planning existent une fois et sont référencés, jamais recopiés.
2. **Suppression et rattachements.** Toute suppression demande confirmation et affiche un message « Annuler » pendant 10 secondes. Supprimer une section supprime ses questions, mais conserve ses plans, qui deviennent « non rattachés ». Supprimer une question conserve ses plans, également non rattachés. Supprimer un plan utilisé par un bloc de planning laisse le bloc avec son titre et retire le lien. Supprimer une caméra liée à un plan conserve le plan et retire le lien. Il n'y a pas de corbeille dans le MVP : l'annulation immédiate suffit.
3. **Progression.** `plans tournés / plans actifs`, les plans abandonnés étant exclus du dénominateur.
4. **Durées.** Stockées en minutes entières ; affichées en heures/minutes. Une journée ne peut pas dépasser 24 h.
5. **Horaires.** Calculés en séquence ; une pause est un bloc comme un autre. Pas de chevauchement possible dans le modèle séquentiel.
6. **Prévu et réel.** Le planning est une prévision. La vue « Aujourd'hui » affiche l'heure prévue et, si le bloc a été démarré, l'heure réelle. Le bloc « en cours » est celui dont la plage prévue contient l'heure actuelle, sauf si l'utilisateur a explicitement démarré un autre bloc. Un dépassement ne décale pas automatiquement la suite : les blocs suivants gardent leurs heures prévues, et un bouton « Recaler la suite » décale les blocs non commencés à partir de l'heure réelle. Les heures de début et de fin réelles sont enregistrées.
7. **Numérotation.** Les plans sont numérotés à la création (1, 2, 3…). Un numéro supprimé n'est pas réutilisé. Une action « renuméroter » est proposée en P1.
8. **Échelle.** Le mode indicatif et le mode à l'échelle sont exclusifs pour une salle. Changer de mode conserve les positions relatives et demande confirmation.
9. **Synchronisation.** Chaque enregistrement porte `updated_at`. En cas de conflit, le plus récent gagne ; l'interface signale le remplacement.
10. **Unités.** Longueurs en mètres, avec un chiffre après la virgule ; angles en degrés entiers ; focales en millimètres.
11. **Fuseau horaire.** Toutes les dates et heures sont stockées en UTC et affichées dans le fuseau du profil.

---

## 7. Modèle de données

Les tables sont préfixées et protégées par des règles d'accès au niveau ligne (RLS) : chaque ligne appartient à un utilisateur.

### 7.1 `profiles`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | = auth.users.id |
| display_name | text | |
| timezone | text | défaut `Europe/Paris` |
| created_at | timestamptz | |

### 7.2 `projects`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | |
| title | text | obligatoire |
| shoot_date | date | |
| status | text | brouillon / preparation / pret / tourne / termine |
| notes | text | |
| cover_url | text | vignette optionnelle |
| created_at, updated_at | timestamptz | |

### 7.3 `sections`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| project_id | uuid | |
| position | int | ordre |
| title | text | |
| planned_minutes | int | |
| notes | text | |

### 7.4 `questions`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| section_id | uuid | |
| position | int | |
| text | text | obligatoire |
| notes | text | |
| planned_minutes | int | |

### 7.5 `shots`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| project_id | uuid | |
| section_id | uuid | nullable |
| question_id | uuid | nullable |
| number | int | stable |
| description | text | |
| shot_size | text | |
| angle | text | |
| movement | text | |
| lens_mm | int | |
| duration_min | int | |
| camera_element_id | uuid | nullable, élément de salle |
| status | text | a_tourner / tourne / a_refaire / abandonne |
| notes | text | |
| position | int | ordre d'affichage |

### 7.6 `rooms`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | |
| project_id | uuid | nullable si modèle |
| name | text | |
| plan_url | text | image importée |
| plan_width, plan_height | int | dimensions natives |
| scale_mode | text | indicatif / echelle |
| px_per_meter | numeric | nullable |
| is_template | boolean | |
| created_at, updated_at | timestamptz | |

### 7.7 `elements`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| room_id | uuid | |
| kind | text | camera / light / mic / person / prop / other |
| label | text | |
| x, y | numeric | 0 à 1, proportion de l'image |
| rotation | numeric | degrés |
| width, height | numeric | proportion de l'image |
| z_index | int | |
| locked | boolean | |
| fov_deg | numeric | caméra |
| sensor_width_mm | numeric | caméra, optionnel (calcul de l'angle) |
| beam_deg | numeric | lumière |
| range_m | numeric | lumière |
| light_type | text | key / fill / back / practical |
| temperature | text | warm / neutral / cool |
| facing_deg | numeric | personne |
| notes | text | |
| gear_item_id | uuid | nullable, origine bibliothèque |

### 7.8 `schedule_blocks`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| project_id | uuid | |
| position | int | |
| type | text | setup / shoot / break / meal / wrap / other |
| title | text | |
| duration_min | int | |
| section_id | uuid | nullable |
| shot_id | uuid | nullable |
| notes | text | |
| status | text | a_venir / en_cours / termine |
| started_at, ended_at | timestamptz | heures réelles, nullables |

### 7.9 `gear_items`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | |
| category | text | camera / lens / light / mic / support / prop / other |
| name | text | |
| icon | text | |
| defaults | jsonb | angle, portée, température… |
| notes | text | |

### 7.10 `day_notes`

| Champ | Type | Notes |
|---|---|---|
| id | uuid | |
| project_id | uuid | |
| content | text | |
| created_at | timestamptz | |

> Les notes par plan utilisent le champ `notes` de `shots`. Les notes de journée sont séparées pour être ajoutées vite depuis la vue « Aujourd'hui ».

---

## 8. Expérience utilisateur et navigation

### 8.1 Arborescence

```
Connexion
└── Accueil (cartes des tournages)
    ├── Aujourd'hui (si tournage du jour)
    └── Tournage
        ├── Conducteur
        ├── Plans
        ├── Salle
        ├── Planning
        └── Aujourd'hui
```

### 8.2 Principes d'interface

1. **Une vue = une intention.** Chaque onglet répond à une question : « Que vais-je dire ? », « Que vais-je filmer ? », « Où et avec quoi ? », « Quand ? », « Où j'en suis maintenant ? ».
2. **Deux gestes maximum le jour J.** La vue « Aujourd'hui » est la porte d'entrée ; le plan et le conducteur sont à un tap.
3. **Pas de modale profonde.** Les éditions se font en place ou dans un panneau latéral ; sur téléphone, en plein écran avec retour explicite.
4. **Le vide est un état, pas une erreur.** Chaque écran vide explique quoi faire en une phrase et propose une action.
5. **La sauvegarde est invisible.** Aucun bouton « Enregistrer » ; un indicateur de synchronisation suffit.
6. **Le tactile d'abord sur le plateau.** Les commandes critiques sont larges, espacées, utilisables avec des doigts, éventuellement avec des gants.
7. **Sobre.** Pas d'illustrations décoratives, pas d'animations gratuites. L'interface s'efface devant le contenu.

### 8.3 Adaptation aux écrans

| Contexte | Comportement |
|---|---|
| Téléphone (≥ 360 px) | Navigation par onglets en bas ; édition en plein écran ; plan de salle en plein écran avec pincement. |
| Tablette (≥ 768 px) | Deux colonnes possibles (liste + détail) ; plan de salle confortable ; commandes tactiles. |
| Ordinateur (≥ 1280 px) | Barre latérale de navigation ; panneaux redimensionnables ; raccourcis clavier (supprimer, annuler, rétablir, échapper). |

### 8.4 Plan de salle — interactions

- **Sélection** : tap sur un élément ; poignées de rotation et de redimensionnement.
- **Déplacement** : glisser ; aimantation si la grille est active.
- **Zoom** : molette ou pincement, centré sur le curseur ou les doigts.
- **Annulation** : bouton et raccourci `Ctrl/Cmd + Z` ; rétablissement `Ctrl/Cmd + Shift + Z`.
- **Suppression** : touche `Suppr` sur ordinateur, bouton sur mobile, avec confirmation si l'élément a des notes.
- **Vue** : bouton « recadrer » pour revenir à l'image entière.

### 8.5 Accessibilité

- Contraste conforme WCAG AA.
- Cibles tactiles ≥ 44 × 44 px.
- Navigation clavier complète sur ordinateur, focus visible.
- Libellés explicites pour les lecteurs d'écran ; les icônes ont un texte alternatif.
- Pas d'information portée uniquement par la couleur (les types de lumière ont aussi une forme ou un libellé).

---

## 9. Exigences non fonctionnelles

### 9.1 Performance

- Premier affichage utile en moins de 3 s sur 4G.
- Plan de salle fluide (60 images/s) avec 100 éléments sur une tablette de 2022 ou plus récente.
- Synchronisation d'une modification en moins de 5 s en ligne.
- Ouverture de la vue « Aujourd'hui » en moins de 1 s une fois l'application chargée.

### 9.2 Disponibilité et fiabilité

- Disponibilité cible : 99,5 % (hébergement managé).
- Aucune perte de saisie : écriture locale immédiate, envoi cloud ensuite.
- Sauvegardes quotidiennes de la base ; restauration possible sous 24 h.
- Les exports PDF ne dépendent pas d'un service tiers payant.

### 9.3 Sécurité

- HTTPS obligatoire.
- Isolation des données par utilisateur (RLS) testée.
- Images stockées dans un bucket privé, accès par URL signée.
- Aucune clé secrète exposée côté client.
- Limitation des tentatives de connexion par lien magique.
- Journalisation des erreurs sans données personnelles.

### 9.4 Données personnelles (RGPD)

- Hébergement dans l'Union européenne.
- Données minimales : e-mail, nom affiché, contenus de tournage.
- Export et suppression du compte en libre-service.
- Politique de confidentialité et mention des sous-traitants (hébergeur, e-mail).
- Pas de cookie publicitaire, pas de traceur tiers.

### 9.5 Compatibilité

- Chrome, Edge, Firefox, Safari : deux dernières versions majeures.
- iOS Safari 16+, Android Chrome 110+.
- PWA installable sur les trois plateformes.
- Mode portrait et paysage ; le plan de salle est optimisé pour le paysage.

### 9.6 Maintenabilité

- Code TypeScript strict.
- Séparation nette entre logique métier (testable) et interface.
- Aucune dépendance à un service propriétaire pour les fonctions cœur (hors hébergement et auth).
- Chaîne de tests automatisés exécutée avant chaque déploiement.

---

## 10. Architecture technique proposée

> Ces choix sont des propositions du rédacteur. Ils peuvent être revus, mais tout changement doit préserver les exigences ci-dessus.

### 10.1 Vue d'ensemble

```
Navigateur (PWA)
├── Next.js (App Router) + TypeScript
├── Tailwind CSS + composants d'interface
├── react-konva (plan de salle 2D)
├── Dexie (cache local + file d'attente hors ligne)
└── Service worker (coquille applicative)
        │
        ▼
Supabase (UE)
├── Auth (lien magique)
├── PostgreSQL + RLS
├── Storage (images de plans)
└── Realtime (synchronisation)
        │
        ▼
Vercel (hébergement de l'application)
```

### 10.2 Justification

- **Web plutôt que natif** : une seule base de code pour PC, tablette et téléphone ; installation possible en PWA ; mise à jour instantanée.
- **Next.js** : rendu rapide, routes protégées, écosystème mature, déploiement simple.
- **Supabase** : authentification, base relationnelle, stockage et temps réel dans un seul service, hébergement UE, offre gratuite suffisante pour un usage personnel.
- **react-konva** : canvas 2D performant, gestes tactiles, export image.
- **Dexie** : persistance locale et file d'attente pour le hors-ligne.
- **Impression CSS** : les PDF sont générés par le navigateur, sans dépendance payante.

### 10.3 Coûts prévisibles

| Poste | Coût |
|---|---|
| Vercel (offre gratuite) | 0 € |
| Supabase (offre gratuite) | 0 € |
| Nom de domaine | ~12 €/an |
| Supabase Pro (si volume) | ~25 $/mois |
| Total MVP | ~12 €/an |

**Prérequis de comptes.** La connexion par lien magique exige un service d'e-mail transactionnel (Resend, Brevo ou SMTP équivalent) et un domaine vérifié : l'envoi par défaut de Supabase est limité à quelques messages par heure. Les comptes Supabase, Vercel, nom de domaine et e-mail sont à créer ; leur titulaire et leur paiement restent à confirmer avec l'utilisateur.

### 10.4 Points de vigilance techniques

- **Hors-ligne** : limiter le cache au dernier tournage ouvert pour maîtriser la taille et les conflits.
- **Temps réel** : ne pas recharger tout l'écran à chaque événement ; appliquer la modification à l'enregistrement concerné.
- **Canvas** : stocker les coordonnées en proportion, jamais en pixels absolus.
- **Images de plans** : compresser à l'import (largeur maximale 3000 px) pour éviter des fichiers de 20 Mo.
- **PDF** : tester l'impression sur iOS Safari, réputé capricieux.

---

## 11. Livrables et jalons

La réalisation se fait **avec l'utilisateur**, par itérations courtes. Chaque jalon se termine par une démonstration sur un tournage réel et une validation avant de passer au suivant.

### Jalon 0 — Cadrage (ce document)

- Cahier des charges validé.
- Maquette fil de fer des cinq écrans principaux.
- Jeu de données de démonstration : « Portrait de métier — épisode 1 ».

### Jalon 1 — Socle

- Compte, connexion, accueil en cartes, création/duplication/suppression de tournage.
- Base de données et isolation des données.
- Déploiement en ligne, PWA installable.
- **Recette** : créer un tournage, le retrouver sur téléphone.

### Jalon 2 — Conducteur et plans

- Sections, questions, durées, réorganisation.
- Liste des plans, statuts, filtres, progression.
- **Recette** : préparer l'interview de référence de bout en bout.

### Jalon 3 — Salle

- Import et calibration du plan.
- Palette, placement, cônes, rotation, notes, annuler/rétablir.
- Modèles de salle.
- **Recette** : poser deux caméras et trois lumières sur un plan réel, export PNG.

### Jalon 4 — Planning et mode plateau

- Journée, blocs, calcul des horaires, alerte de dépassement.
- Vue « Aujourd'hui », cochage des plans, notes rapides.
- **Recette** : simuler une journée de tournage sur tablette, hors ligne.

### Jalon 5 — Exports et finition

- Quatre exports PDF, dossier combiné.
- Synchronisation temps réel, file hors ligne, indicateur d'état.
- Accessibilité, performance, tests.
- **Recette** : dossier de tournage imprimé, utilisation réelle.

### Jalon 6 — Mise en service

- Données réelles de l'utilisateur.
- Sauvegarde, export, suppression de compte.
- Documentation d'utilisation en une page.

---

## 12. Stratégie de test et recette

### 12.1 Tests automatisés

**Unitaires (logique métier)**

- Calcul des horaires de blocs, dépassement, durées totales.
- Calcul de l'échelle à partir d'un segment calibré.
- Calcul du champ de vision à partir de la focale et du capteur.
- Progression des plans (exclusion des abandonnés).
- Numérotation stable des plans.
- Fusion last-write-wins.

**Bout en bout (Playwright)**

1. Connexion → création d'un tournage → ajout de trois questions → ajout de deux plans → planning → vue « Aujourd'hui » → cocher un plan.
2. Import d'un plan → calibration → pose d'une caméra → déplacement → rechargement → position conservée.
3. Mode hors ligne → modification → retour en ligne → synchronisation.
4. Export PDF → présence des quatre documents.

### 12.2 Recette manuelle

| Scénario | Attendu |
|---|---|
| Créer un tournage sur PC, l'ouvrir sur téléphone | Même contenu, même plan, même progression |
| Couper le wifi sur tablette, cocher trois plans | Coches visibles immédiatement, indicateur « hors ligne » |
| Rétablir le wifi | Indicateur « synchronisé », PC à jour |
| Importer un plan photographié à plat (photo ou export) | Plan lisible, calibration possible |
| Calibrer sur 0,90 m, poser une caméra à 3 m | Cône cohérent avec la distance |
| Planning 9 h–17 h surchargé | Alerte de dépassement chiffrée |
| Ouvrir « Aujourd'hui » à l'heure du tournage | Bloc en cours et suivant corrects |
| Exporter le dossier | Quatre PDF lisibles, dates au format français |

### 12.3 Matrice d'appareils

- PC Windows 11, Chrome et Edge.
- Mac, Safari (si disponible).
- iPad, Safari, portrait et paysage.
- iPhone, Safari.
- Android, Chrome.

---

## 13. Risques et parades

| Risque | Impact | Parade |
|---|---|---|
| Le plan de salle tactile est difficile à manipuler sur téléphone | Élevé | Réserver l'édition fine à la tablette/PC ; sur téléphone, consultation et déplacements simples ; tester tôt sur un vrai appareil. |
| Une photo de plan prise en perspective fausse l'échelle | Moyen | Demander une photo à plat ; redressement en V2 ; avertir si la calibration paraît incohérente. |
| La synchronisation hors ligne crée des conflits | Élevé | Last-write-wins par enregistrement, indicateur explicite, cache limité au dernier tournage, tests de coupure réseau. |
| La saisie est trop longue, l'utilisateur abandonne | Élevé | Champs minimaux, duplication, modèles, bibliothèque de matériel, aucune obligation de tout remplir. |
| Le produit devient un tableur | Moyen | Une vue par intention, pas de colonnes configurables, pas de formules. |
| Les PDF sont illisibles ou mal paginés | Moyen | Feuilles de style d'impression dédiées, test sur iOS et Android, aperçu avant export. |
| Le périmètre gonfle (3D, budget, équipe) | Moyen | Non-objectifs écrits, backlog V2, validation à chaque jalon. |
| Dépendance à un service cloud | Moyen | Export JSON complet, base PostgreSQL standard, possibilité de migrer. |
| Coût d'hébergement qui dérape | Faible | Offres gratuites, compression des images, quotas, alerte. |

---

## 14. Benchmark concurrentiel

Étude de 18 outils, pages officielles consultées en octobre 2026. Les prix sont des ordres de grandeur, hors taxes, et bougent vite.

### 14.1 Trois familles, trois impasses

**Mise en scène et plan de feu**

| Outil | Force | Limite pour notre usage | Prix indicatif |
|---|---|---|---|
| **Shot Designer** | Plan 2D, caméras et personnages qui se recalculent, shot list liée au plan, symboles de lumière, import de plans d'architecte. Standard de fait du blocking. | Interface datée, pas d'annulation, pertes de sauvegarde signalées, aucun planning ni conducteur. | Gratuit limité ; Pro ~20 € |
| **Previs Pro** | 3D Apple, optiques réelles, lumières, personnages, animatique, import de scénario. | Verrouillé Apple, abonnement, bugs et support critiqués, aucun planning ni feuille de service. | 40 $/mois, 120 $/an, 360 $ à vie |
| **set.a.light 3D** | Simulation de lumière physique très réaliste, 90+ projecteurs, mesures. | Conçu pour la photo : pas de scénario, pas de planning, pas de collaboration cloud. | 129–329 $, licence à vie |
| **Virtual Lighting Studio** | Portrait 3D immédiat, gratuit, pédagogique. | Uniquement du portrait, pas de sauvegarde, aucun document de production. | Gratuit |

**Gestion de production**

| Outil | Force | Limite pour notre usage | Prix indicatif |
|---|---|---|---|
| **StudioBinder** | Très large : scénario, dépouillement, stripboard, shot list, storyboard, call sheets, contacts, tâches. UX soignée. | Pas de budget natif, pas de hors-ligne, pas de plan de salle ; call sheets erronées signalées ; cher. | 29–99 $/mois |
| **Celtx** | Couverture complète à petit prix, forte présence en éducation. | Bugs, formatage, pertes de script et support critiqués ; pas de plan de salle. | 15–25 $/mois |
| **CineLog** | UX moderne, hors-ligne, révisions de scénario propres, collaborateurs gratuits. | Produit jeune, pas de budget ni de plan de salle, workflows encore incomplets. | 15–90 $/mois |
| **Fuzzlecheck** | Profondeur assistant réalisateur : plan de travail, feuilles de service, disponibilités, multi-équipes. Adapté au marché français. | Desktop uniquement, interface datée, pas d'écriture ni de plan de salle. | 99–559 € (5 ans) |
| **Soldum** | Français, IA, devis CNC, planning optimisé, budget lié. | Produit jeune, pas de shot list ni de plan de salle, pas d'écriture. | 49–179 €/mois |
| **Yamdu** | Profondeur entreprise, sécurité, budget, call sheets, intégrations. | Cher, complexe, courbe d'apprentissage ; pas de plan de salle. | 45–265 $/mois |

**Storyboard et écriture**

| Outil | Force | Limite pour notre usage | Prix indicatif |
|---|---|---|---|
| **Boords** | Meilleur workflow de validation client, storyboard, animatique, shot list. | Pas de planning, budget, call sheet ni plan de salle ; conversion script→board non réversible. | 26–250 $/mois |
| **Storyflow** | Canvas infini + IA, script→board, shot list, call sheet, temps réel. | Jeune, pas d'animatique ni de timing, peu de profondeur production. | 8–49 $/mois |
| **Arc Studio Pro** | Écriture épurée, révisions, exports FDX/Fountain. | S'arrête au scénario : aucune production. | 69–99 $/an |

### 14.2 Les cinq archétypes d'interface

1. **Canvas spatial infini** (Shot Designer, Milanote, Storyflow) : on place des objets, la valeur vient de la disposition. Faiblesse : tout est manuel, peu de structure.
2. **Simulateur 3D temps réel** (Previs Pro, set.a.light, ShotPro) : on règle lumière et caméra, on regarde. Faiblesse : lourd, courbe d'apprentissage, aucun document de production.
3. **Stripboard** (StudioBinder, Celtx, CineLog, Fuzzlecheck, Yamdu) : le planning est la colonne vertébrale. Faiblesse : tout le reste devient formulaire.
4. **Formulaire documentaire** (budget, feuille de service, devis CNC) : précis mais déconnecté du spatial.
5. **Timeline / animatique** (Boords, Previs Pro) : on travaille le rythme. Faiblesse : s'arrête au board.

« Scenopia » emprunte le canvas au premier, la rigueur du planning au troisième, et refuse la 3D du deuxième.

### 14.3 Le socle attendu — et ce qu'on en garde

Les suites de gestion partagent un socle : import de scénario, dépouillement, shot list, storyboard, stripboard, feuille de service, cast/crew, exports PDF, collaboration.

Pour un créateur seul sur une interview, le socle utile se réduit à : **conducteur, plans, salle, planning, exports**. Le dépouillement automatique, le storyboard, le budget et la gestion d'équipe sont écartés du MVP : ils supposent un volume et une organisation que l'utilisateur n'a pas.

### 14.4 Frustrations documentées dont il faut s'écarter

- **Fiabilité** : pertes de sauvegarde chez Shot Designer, pertes de script chez Celtx, call sheets erronées chez StudioBinder. → Autosauvegarde, hors-ligne, export JSON.
- **Prix et upsells** : facturation par siège, fonctions verrouillées, crédits IA. → Outil personnel, coût quasi nul, pas de palier.
- **Complexité** : Yamdu, StudioBinder et Studiovity jugés trop lourds pour de petites équipes. → Cinq écrans, pas de colonnes configurables.
- **Verrouillage plateforme** : Previs Pro Apple only, Fuzzlecheck desktop only. → Web, trois plateformes.
- **IA opaque** : breakdowns et storyboards difficiles à corriger. → Pas d'IA dans le MVP.
- **Exécution sur le plateau** : les call sheets restent des PDF, l'état des plans n'est pas mis à jour en direct. → Vue « Aujourd'hui » et cochage en direct.

### 14.5 Le vide que « Scenopia » comble

La chaîne **conducteur → plans → salle 2D avec lumière → planning → jour J** n'existe nulle part de bout en bout.

- Les outils d'écriture s'arrêtent au script.
- Les suites de production s'arrêtent au planning et à la feuille de service.
- Les outils spatiaux s'arrêtent au plan et à la shot list.
- Le budget vit à côté.

Quelques ponts existent (CineLog, Celtx, StudioBinder relient script et planning ; Shot Designer relie plan et shot list), mais **personne ne relie le plan 2D éclairé au planning**, et personne ne le fait en français pour un créateur seul.

### 14.6 Spécificités françaises

- **Vocabulaire** : conducteur, dépouillement, découpage technique, plan de travail, feuille de service, pré-minutage. L'interface doit parler français, pas anglais.
- **CNC et droit du travail** : devis CNC, convention collective IDCC 2642, cachets, intermittents. Hors périmètre, mais le vocabulaire ne doit pas les exclure.
- **Habitudes** : Excel et Word dominent, la feuille de service circule en PDF ou imprimée, WhatsApp est le canal réel. Le logiciel doit produire des PDF propres, pas imposer un compte à l'équipe.
- **Confidentialité** : scénarios et cachets sont sensibles ; hébergement UE et données minimales.

### 14.7 Positionnement

« Scenopia » n'essaie pas de battre StudioBinder ou Shot Designer. C'est un **outil personnel, mono-utilisateur, spécialisé dans l'interview en intérieur**, qui relie quatre briques que les autres séparent. Sa force n'est pas la largeur fonctionnelle, c'est la **continuité** : la même information sert à préparer, à dessiner la salle, à planifier et à tourner.

### 14.8 Sources principales

- Shot Designer — https://www.hollywoodcamerawork.com/shot-designer.html
- Previs Pro — https://previspro.com/
- set.a.light 3D — https://www.elixxier.com/en/set-a-light-3d/
- StudioBinder — https://www.studiobinder.com/
- Celtx — https://www.celtx.com/product/pre-production/
- CineLog — https://cinelog.com/
- Fuzzlecheck — https://www.fuzzlecheck.com/index/FR/index.html
- Soldum — https://soldum.fr/
- Yamdu — https://yamdu.com/en/
- Boords — https://boords.com/
- Storyflow — https://storyflow.so/
- Modèles ARA (plan de travail, feuille de service) — https://www.arassocies.com/ressources/modeles/
- Devis CNC — https://directeursdepostprod.com/documentation/devis-cnc/

---

## 15. Annexes

### 15.1 Glossaire

| Terme | Définition |
|---|---|
| Conducteur | Trame ordonnée de ce qui sera dit ou demandé pendant le tournage. |
| Découpage | Liste des plans à tourner pour couvrir le conducteur. |
| Plan | Une prise de vue définie par un cadre, un axe, une optique et un mouvement. |
| Plan de salle | Vue du dessus de la salle, avec murs, mobilier, personnes, caméras et lumières. |
| Plan de feu | Organisation des lumières sur le plan de salle. |
| Valeur de plan | Échelle du cadre : large, moyen, gros, insert… |
| Champ / contrechamp | Deux axes opposés pour filmer deux personnes qui se font face. |
| Feuille de service | Document du jour listant les horaires, les scènes et les personnes attendues. |
| Échelle | Rapport entre les pixels du plan importé et les mètres réels. |

### 15.2 Backlog V2 (non engagé)

- Storyboard par plan (image de référence, vignette).
- Prompteur plein écran.
- Partage en lecture seule par lien.
- Plusieurs salles par tournage.
- Planning multi-jours.
- Import PDF/FDX/Fountain.
- Modèles de journée et de conducteur.
- Mode sombre.
- Notifications de rappel.
- Application native si les limites de la PWA sont atteintes.

### 15.3 Décisions prises par le rédacteur (à vérifier)

1. **Application web plutôt que native** : une base de code, trois plateformes, mise à jour immédiate.
2. **Une seule salle par tournage** : suffisant pour le cas d'usage ; le multi-salles est en V2.
3. **Une seule journée par planning** : conforme à la demande ; le multi-jours est en V2.
4. **Pas de storyboard** : non demandé, et le plan de salle couvre le besoin de repérage.
5. **Pas de budget** : hors sujet pour un créateur seul sur ce format.
6. **Pas de collaboration** : un seul utilisateur ; le partage viendra si le besoin apparaît.
7. **PDF par impression navigateur** : simple, gratuit, suffisant.
8. **Last-write-wins** : acceptable pour un utilisateur solo ; une fusion fine serait surdimensionnée.
9. **Bibliothèque de matériel générique** : l'utilisateur possède déjà son matériel et n'a pas exprimé de besoin de références marques.
10. **Français uniquement** : l'utilisateur est francophone ; les chaînes sont externalisées pour ajouter l'anglais plus tard.

---

*Fin du document.*
