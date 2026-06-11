export type CommunityComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  authorName: string;
  authorRole: string;
  title: string;
  description: string;
  material: string;
  technique: string;
  challenge: string;
  challengeId?: string;
  imageVariant: 'denim' | 'canvas' | 'sage' | 'technical';
  likes: number;
  commentsCount: number;
  comments?: CommunityComment[];
  votes: number;
  viewerHasLiked?: boolean;
  viewerHasVoted?: boolean;
  createdAt: string;
};

export const communityPosts: CommunityPost[] = [
  {
    id: 'patchwork-bomber',
    authorName: 'Maya R.',
    authorRole: 'Designer textile',
    title: 'Bomber reconstruit en denim',
    description: 'Assemblage de trois jeans usés, poches conservées et surpiqûres visibles pour garder la mémoire de la matière.',
    material: 'Denim récupéré',
    technique: 'Patchwork structuré',
    challenge: 'Défi denim',
    challengeId: 'denim-second-life',
    imageVariant: 'denim',
    likes: 142,
    commentsCount: 18,
    votes: 74,
    createdAt: '2026-06-02',
  },
  {
    id: 'canvas-market-bag',
    authorName: 'Nora Atelier',
    authorRole: 'Réparation créative',
    title: 'Sac marché en toile canvas',
    description: 'Ancienne housse de mobilier transformée en sac rigide, avec doublure coton et anses renforcées.',
    material: 'Canvas beige',
    technique: 'Renforts visibles',
    challenge: 'Objet utile',
    challengeId: 'visible-repair',
    imageVariant: 'canvas',
    likes: 96,
    commentsCount: 11,
    votes: 39,
    createdAt: '2026-05-26',
  },
  {
    id: 'sage-knit-repair',
    authorName: 'Eliott C.',
    authorRole: 'Upcycler débutant',
    title: 'Maille réparée au fil sauge',
    description: 'Pull troué repris avec une broderie lente, pensée comme un détail graphique plutôt qu’une réparation cachée.',
    material: 'Maille coton',
    technique: 'Broderie visible',
    challenge: 'Réparer sans cacher',
    challengeId: 'visible-repair',
    imageVariant: 'sage',
    likes: 121,
    commentsCount: 24,
    votes: 52,
    createdAt: '2026-05-18',
  },
  {
    id: 'technical-tote',
    authorName: 'Studio Refaire',
    authorRole: 'Collectif local',
    title: 'Tote technique en toile de tente',
    description: 'Découpe minimale dans une toile imperméable, couture anglaise et détails noirs pour un rendu plus urbain.',
    material: 'Toile technique',
    technique: 'Détournement',
    challenge: 'Textile technique',
    challengeId: 'technical-textile',
    imageVariant: 'technical',
    likes: 188,
    commentsCount: 31,
    votes: 86,
    createdAt: '2026-05-09',
  },
];
