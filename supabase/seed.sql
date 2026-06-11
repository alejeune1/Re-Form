insert into public.tutorials (id, title, material, difficulty, duration, category, image, description, is_published)
values
  (
    'jean-to-bag',
    'Transformer un vieux jean en sac',
    'Denim usé',
    'Intermédiaire',
    '2h30',
    'Transformation',
    'denim',
    'Créer un sac solide à partir de jambes de jean, poches existantes et coutures renforcées.',
    true
  ),
  (
    'visible-patches-jacket',
    'Réparer une veste avec des patchs visibles',
    'Veste coton ou denim',
    'Facile',
    '1h15',
    'Réparation',
    'patch',
    'Assumer la réparation avec des empiècements contrastés et une couture volontairement apparente.',
    true
  ),
  (
    'fabric-scrap-pouch',
    'Créer une pochette avec une chute de tissu',
    'Chutes textiles',
    'Facile',
    '45 min',
    'Accessoire',
    'scrap',
    'Assembler une petite pochette utile à partir de restes de toile, coton ou doublure.',
    true
  ),
  (
    'tent-to-technical-accessory',
    'Upcycler une tente en accessoire technique',
    'Toile technique',
    'Avancé',
    '3h',
    'Technique',
    'tent',
    'Réutiliser une toile résistante pour créer un accessoire léger, imperméable et durable.',
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  material = excluded.material,
  difficulty = excluded.difficulty,
  duration = excluded.duration,
  category = excluded.category,
  image = excluded.image,
  description = excluded.description,
  is_published = excluded.is_published;

insert into public.challenges (id, title, theme, status, participants, description, is_published)
values
  (
    'denim-second-life',
    'Défi denim : seconde vie d’un jean',
    'Denim',
    'En cours',
    128,
    'Transformer un jean oublié en vêtement, sac ou objet textile utile.',
    true
  ),
  (
    'technical-textile',
    'Transformer un textile technique',
    'Tentes, bâches, sacs',
    'Bientôt',
    64,
    'Imaginer une pièce à partir de matières résistantes ou imperméables.',
    true
  ),
  (
    'visible-repair',
    'Patch visible : réparer sans cacher',
    'Réparation créative',
    'En cours',
    213,
    'Faire de la réparation un détail graphique, assumé et désirable.',
    true
  ),
  (
    'bag-to-garment',
    'De sac à vêtement',
    'Détournement',
    'Bientôt',
    47,
    'Réinventer sangles, poches et panneaux pour construire une nouvelle silhouette.',
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  theme = excluded.theme,
  status = excluded.status,
  participants = excluded.participants,
  description = excluded.description,
  is_published = excluded.is_published;

notify pgrst, 'reload schema';
