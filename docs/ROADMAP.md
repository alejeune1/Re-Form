# RE:FORM Roadmap

## Phase 1
Homepage plateforme avec sections tutoriels, upload, défis et communauté.

## Phase 2
Pages dédiées Tutoriels et Défis avec données mockées.
- Routing React côté front.
- Page `/tutoriels` avec grille des tutoriels mockés.
- Page `/defis` avec grille des défis mockés.

## Phase 3
Upload réel avec preview, formulaire complet et sauvegarde locale temporaire.
- Sélection réelle d’image côté front.
- Preview immédiate dans la section upload.
- Formulaire matière complet : nom, type, état, objectif, matière, notes.
- Sauvegarde temporaire dans `localStorage`.
- Liste des dernières matières sauvegardées localement.
- Validation front : formats JPG/PNG/WebP, limite 2 Mo, champs bornés.

## Phase 4
Connexion backend Supabase.
- Client Supabase typé côté front.
- Variables d’environnement documentées.
- Lecture Supabase des tutoriels et défis avec fallback mock.
- Préparation upload Supabase Storage des créations avec fallback local.
- Schéma SQL avec tables `profiles`, `tutorials`, `creations`, `challenges`, `votes`.
- Row Level Security activée sur les tables.
- Politiques Storage pour limiter les uploads aux utilisateurs authentifiés.

## Phase 5
Communauté :
- page `/communaute`
- posts de créations avec fallback mock
- auth email/mot de passe via Supabase
- profil utilisateur public modifiable
- publication d’une création dans la communauté depuis l’upload
- interactions Supabase : likes, commentaires, votes
- fallback local si l’utilisateur n’est pas connecté
- tables Supabase `creation_likes` et `creation_comments`
- politiques RLS pour interactions communautaires

## Phase 6
Concours / tournois :
- page `/concours`
- inscription Supabase aux concours publiés
- soumission d’une création publique à un concours
- vote communautaire sur les soumissions
- classement par concours
- archive des anciens concours
- tables Supabase `challenge_registrations` et `challenge_submissions`
- politiques RLS pour inscriptions et soumissions

## Phase 7
Assistant de transformation :
- page `/assistant`
- upload photo textile local avec validation JPG/PNG/WebP et limite 2 Mo
- analyse manuelle guidée par matière, état, objectif, niveau et temps disponible
- suggestions de transformations explicables par règles éditoriales
- tutoriels recommandés selon la piste retenue
- historique local minimal sans stocker l’image
- aucune image envoyée à un serveur, IA prévue plus tard
