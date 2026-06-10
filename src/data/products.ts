export type Product = {
  title: string;
  material: string;
  image: string;
  description: string;
  alt: string;
  unique?: boolean;
};

export const products: Product[] = [
  {
    title: 'Veste reconstruite',
    material: 'Ancien denim + chutes de coton',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    description: 'Une pièce unique assemblée à partir de matières récupérées.',
    alt: 'Veste de mode streetwear photographiée en extérieur',
    unique: true,
  },
  {
    title: 'Hoodie patchwork',
    material: 'Sweats déclassés + panneaux textiles',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
    description: 'Des volumes confortables reconstruits par blocs de couleurs et textures.',
    alt: 'Hoodie et vêtements urbains avec matières contrastées',
    unique: true,
  },
  {
    title: 'Jean retravaillé',
    material: 'Denim usé + coutures contrastées',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    description: 'Un jean marqué par l’usage, renforcé et redessiné en atelier.',
    alt: 'Jean denim retravaillé avec détails de matière',
  },
  {
    title: 'Sac textile transformé',
    material: 'Bâche technique + ancien sac à dos',
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80',
    description: 'Un accessoire souple qui détourne les textiles robustes du rebut.',
    alt: 'Atelier textile avec couture et matières récupérées',
    unique: true,
  },
];
