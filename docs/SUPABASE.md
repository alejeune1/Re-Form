# Supabase — Phases 4 à 6

## Objectif

Brancher RE:FORM sur Supabase sans rendre le front dépendant du backend pendant le développement.

- Sans variables Supabase : le site utilise les données mockées et l’upload reste local.
- Avec variables Supabase : tutoriels, défis, communauté et concours sont lus depuis Supabase.
- Avec utilisateur connecté : les créations peuvent envoyer l’image vers Supabase Storage et créer une ligne `creations`.
- Avec utilisateur connecté : likes, commentaires, votes, inscriptions et soumissions sont synchronisés côté Supabase.

## Configuration

1. Créer un projet Supabase.
2. Exécuter `supabase/schema.sql` dans le SQL editor Supabase.
3. Si nécessaire, exécuter `supabase/phase5-community-interactions.sql`.
4. Pour la Phase 6 concours, exécuter `supabase/phase6-contests.sql`.
5. Ajouter les données de démonstration avec `supabase/seed.sql`.
6. Copier `.env.example` vers `.env.local`.
7. Renseigner :

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

La clé `anon` est publique côté front. Ne jamais placer la clé `service_role` dans Vite.

## Vérification

Après configuration :

```bash
npm run verify:supabase
npm run build
npm audit --audit-level=moderate
```

`verify:supabase` vérifie les tables attendues et prévient si les tutoriels/défis publiés sont vides.

## Tables prévues

- `profiles` : profils liés à `auth.users`.
- `tutorials` : contenus tutoriels publiés.
- `challenges` : défis et concours publiés.
- `creations` : fiches matières/créations des utilisateurs.
- `votes` : votes uniques par utilisateur, défi et création.
- `creation_likes` : likes uniques par utilisateur et création.
- `creation_comments` : commentaires bornés et rattachés à une création.
- `challenge_registrations` : inscriptions aux concours publiés.
- `challenge_submissions` : soumissions de créations publiques aux concours.
- Storage `creation-images` : bucket privé, images limitées à 2 Mo et aux MIME `image/jpeg`, `image/png`, `image/webp`.

## Sécurité

- RLS activé sur toutes les tables.
- Les tutoriels et défis sont lisibles uniquement si `is_published = true`.
- Les créations privées sont lisibles uniquement par leur propriétaire.
- Les inserts/updates/deletes de créations exigent `auth.uid() = owner_id`.
- Les likes/commentaires sont possibles seulement sur les créations visibles par l’utilisateur.
- Les votes exigent une création publique et un défi publié.
- Les inscriptions exigent un utilisateur connecté et un concours publié.
- Les soumissions exigent une création publique appartenant à l’utilisateur.
- Les images sont uploadables et lisibles uniquement dans un dossier portant l’ID utilisateur.
- Le front garde les validations UX, mais le schéma SQL impose aussi tailles, types et ownership.

## Limites actuelles

- Si Supabase est configuré mais qu’aucun utilisateur n’est connecté, l’upload et les interactions retombent en local.
- Les rôles d’administration éditoriale ne sont pas encore modélisés côté UI.
