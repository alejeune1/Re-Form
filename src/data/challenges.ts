export type Challenge = {
  id: string;
  title: string;
  theme: string;
  status: 'Bientôt' | 'En cours';
  participants: number;
  description: string;
};

export const challenges: Challenge[] = [
  {
    id: 'denim-second-life',
    title: 'Défi denim : seconde vie d’un jean',
    theme: 'Denim',
    status: 'En cours',
    participants: 128,
    description: 'Transformer un jean oublié en vêtement, sac ou objet textile utile.',
  },
  {
    id: 'technical-textile',
    title: 'Transformer un textile technique',
    theme: 'Tentes, bâches, sacs',
    status: 'Bientôt',
    participants: 64,
    description: 'Imaginer une pièce à partir de matières résistantes ou imperméables.',
  },
  {
    id: 'visible-repair',
    title: 'Patch visible : réparer sans cacher',
    theme: 'Réparation créative',
    status: 'En cours',
    participants: 213,
    description: 'Faire de la réparation un détail graphique, assumé et désirable.',
  },
  {
    id: 'bag-to-garment',
    title: 'De sac à vêtement',
    theme: 'Détournement',
    status: 'Bientôt',
    participants: 47,
    description: 'Réinventer sangles, poches et panneaux pour construire une nouvelle silhouette.',
  },
];
