export type Tutorial = {
  id: string;
  title: string;
  material: string;
  difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
  duration: string;
  category: string;
  image: string;
  description: string;
};

export const tutorials: Tutorial[] = [
  {
    id: 'jean-to-bag',
    title: 'Transformer un vieux jean en sac',
    material: 'Denim usé',
    difficulty: 'Intermédiaire',
    duration: '2h30',
    category: 'Transformation',
    image: 'denim',
    description: 'Créer un sac solide à partir de jambes de jean, poches existantes et coutures renforcées.',
  },
  {
    id: 'visible-patches-jacket',
    title: 'Réparer une veste avec des patchs visibles',
    material: 'Veste coton ou denim',
    difficulty: 'Facile',
    duration: '1h15',
    category: 'Réparation',
    image: 'patch',
    description: 'Assumer la réparation avec des empiècements contrastés et une couture volontairement apparente.',
  },
  {
    id: 'fabric-scrap-pouch',
    title: 'Créer une pochette avec une chute de tissu',
    material: 'Chutes textiles',
    difficulty: 'Facile',
    duration: '45 min',
    category: 'Accessoire',
    image: 'scrap',
    description: 'Assembler une petite pochette utile à partir de restes de toile, coton ou doublure.',
  },
  {
    id: 'tent-to-technical-accessory',
    title: 'Upcycler une tente en accessoire technique',
    material: 'Toile technique',
    difficulty: 'Avancé',
    duration: '3h',
    category: 'Technique',
    image: 'tent',
    description: 'Réutiliser une toile résistante pour créer un accessoire léger, imperméable et durable.',
  },
];
