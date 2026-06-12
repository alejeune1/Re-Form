export type ContestSubmission = {
  id: string;
  creationId: string;
  title: string;
  authorName: string;
  material: string;
  technique: string;
  votes: number;
  viewerHasVoted?: boolean;
  createdAt: string;
};

export type Contest = {
  id: string;
  title: string;
  theme: string;
  status: 'Bientôt' | 'En cours' | 'Terminé';
  description: string;
  participants: number;
  startsAt: string | null;
  endsAt: string | null;
  viewerRegistered?: boolean;
  submissions: ContestSubmission[];
};

export const contests: Contest[] = [
  {
    id: 'denim-second-life',
    title: 'Défi denim : seconde vie d’un jean',
    theme: 'Denim',
    status: 'En cours',
    description: 'Transformer un jean oublié en vêtement, sac ou objet textile utile.',
    participants: 128,
    startsAt: '2026-06-01',
    endsAt: '2026-06-30',
    submissions: [
      {
        id: 'demo-denim-1',
        creationId: 'demo-denim-1',
        title: 'Bomber reconstruit en denim',
        authorName: 'Maya R.',
        material: 'Denim récupéré',
        technique: 'Patchwork structuré',
        votes: 74,
        createdAt: '2026-06-02',
      },
      {
        id: 'demo-denim-2',
        creationId: 'demo-denim-2',
        title: 'Sac banane depuis deux jambes de jean',
        authorName: 'Atelier Nord',
        material: 'Jean brut',
        technique: 'Détournement',
        votes: 61,
        createdAt: '2026-06-04',
      },
    ],
  },
  {
    id: 'visible-repair',
    title: 'Patch visible : réparer sans cacher',
    theme: 'Réparation créative',
    status: 'En cours',
    description: 'Faire de la réparation un détail graphique, assumé et désirable.',
    participants: 213,
    startsAt: '2026-05-20',
    endsAt: '2026-06-20',
    submissions: [
      {
        id: 'demo-repair-1',
        creationId: 'demo-repair-1',
        title: 'Maille réparée au fil sauge',
        authorName: 'Eliott C.',
        material: 'Maille coton',
        technique: 'Broderie visible',
        votes: 52,
        createdAt: '2026-05-18',
      },
    ],
  },
  {
    id: 'technical-textile',
    title: 'Transformer un textile technique',
    theme: 'Tentes, bâches, sacs',
    status: 'Bientôt',
    description: 'Imaginer une pièce à partir de matières résistantes ou imperméables.',
    participants: 64,
    startsAt: '2026-07-01',
    endsAt: '2026-07-31',
    submissions: [],
  },
  {
    id: 'winter-archive',
    title: 'Archive : manteaux réparés',
    theme: 'Archive concours',
    status: 'Terminé',
    description: 'Ancien concours autour des vestes et manteaux renforcés pour l’hiver.',
    participants: 89,
    startsAt: '2026-01-05',
    endsAt: '2026-01-31',
    submissions: [
      {
        id: 'demo-archive-1',
        creationId: 'demo-archive-1',
        title: 'Parka doublée en chutes de laine',
        authorName: 'Studio Refaire',
        material: 'Laine et toile',
        technique: 'Doublure reconstruite',
        votes: 118,
        createdAt: '2026-01-19',
      },
    ],
  },
];
