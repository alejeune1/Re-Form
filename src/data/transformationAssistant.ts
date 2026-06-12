export type AssistantProfile = {
  title: string;
  pieceType: string;
  material: string;
  condition: string;
  objective: string;
  skillLevel: string;
  timeBudget: string;
  notes: string;
};

export type TransformationRecommendation = {
  id: string;
  title: string;
  category: string;
  confidence: number;
  summary: string;
  estimatedTime: string;
  difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
  materials: string[];
  steps: string[];
  cautions: string[];
  tutorialIds: string[];
};

type RecommendationTemplate = TransformationRecommendation & {
  matches: Partial<Record<keyof AssistantProfile, string[]>>;
};

export const assistantOptions = {
  pieceTypes: ['Jean', 'Veste', 'Hoodie', 'Sac', 'Tente', 'Tissu', 'Pull', 'Autre'],
  materials: ['Denim', 'Coton', 'Canvas', 'Toile technique', 'Maille', 'Mix matières'],
  conditions: ['Troué', 'Taché', 'Déformé', 'Usé', 'Inutilisé', 'Chutes multiples'],
  objectives: ['Réparer', 'Transformer', 'Customiser', 'Créer un accessoire'],
  skillLevels: ['Débutant', 'Intermédiaire', 'Avancé'],
  timeBudgets: ['Moins de 1h', '1 à 3h', 'Demi-journée'],
};

export const initialAssistantProfile: AssistantProfile = {
  title: '',
  pieceType: 'Veste',
  material: 'Denim',
  condition: 'Troué',
  objective: 'Transformer',
  skillLevel: 'Débutant',
  timeBudget: '1 à 3h',
  notes: '',
};

const recommendationTemplates: RecommendationTemplate[] = [
  {
    id: 'visible-repair-panel',
    title: 'Réparation visible avec panneau contrasté',
    category: 'Réparation',
    confidence: 0,
    summary: 'Transformer une zone abîmée en détail graphique avec un grand panneau textile et quelques coutures visibles.',
    estimatedTime: '1h à 2h',
    difficulty: 'Facile',
    materials: ['Patch denim ou coton épais', 'Fil contrasté', 'Aiguille solide', 'Thermocollant optionnel'],
    steps: [
      'Isoler la zone fragile et couper un panneau plus large que le défaut.',
      'Positionner le patch sur l’extérieur pour assumer la réparation.',
      'Fixer avec une couture longue, irrégulière mais propre.',
      'Ajouter 2 à 3 points de renfort aux zones de tension.',
    ],
    cautions: ['Évite les petits patchs trop décoratifs si la matière est déjà très usée.'],
    tutorialIds: ['visible-patches-jacket', 'fabric-scrap-pouch'],
    matches: {
      condition: ['Troué', 'Usé', 'Taché'],
      objective: ['Réparer', 'Customiser'],
      skillLevel: ['Débutant', 'Intermédiaire'],
    },
  },
  {
    id: 'denim-utility-bag',
    title: 'Sac utilitaire à partir de panneaux denim',
    category: 'Transformation',
    confidence: 0,
    summary: 'Réutiliser les panneaux les plus solides pour créer un sac structuré avec poches existantes.',
    estimatedTime: '2h à 3h',
    difficulty: 'Intermédiaire',
    materials: ['Denim récupéré', 'Sangle ou ceinture', 'Doublure coton', 'Fil résistant'],
    steps: [
      'Découdre les zones exploitables sans couper les poches utiles.',
      'Composer deux grands panneaux recto/verso.',
      'Renforcer le fond avec une double épaisseur.',
      'Ajouter une sangle récupérée ou une ancienne ceinture.',
    ],
    cautions: ['Vérifie l’épaisseur avant couture machine pour éviter de casser l’aiguille.'],
    tutorialIds: ['jean-to-bag'],
    matches: {
      pieceType: ['Jean', 'Tissu'],
      material: ['Denim'],
      objective: ['Transformer', 'Créer un accessoire'],
      timeBudget: ['1 à 3h', 'Demi-journée'],
    },
  },
  {
    id: 'technical-pouch',
    title: 'Pochette technique imperméable',
    category: 'Accessoire',
    confidence: 0,
    summary: 'Valoriser une toile technique ou une tente en accessoire léger, résistant et urbain.',
    estimatedTime: '1h30 à 3h',
    difficulty: 'Avancé',
    materials: ['Toile technique', 'Zip récupéré', 'Biais ou sangle', 'Fil polyester'],
    steps: [
      'Nettoyer la toile et repérer les zones sans déchirure.',
      'Découper un rectangle principal et une poche frontale.',
      'Assembler avec couture anglaise ou biais pour protéger les bords.',
      'Ajouter un zip ou un rabat selon le matériel disponible.',
    ],
    cautions: ['Ne repasse pas directement les toiles techniques : elles peuvent fondre.'],
    tutorialIds: ['tent-to-technical-accessory', 'fabric-scrap-pouch'],
    matches: {
      pieceType: ['Tente', 'Sac', 'Tissu'],
      material: ['Toile technique', 'Canvas'],
      objective: ['Transformer', 'Créer un accessoire'],
      skillLevel: ['Intermédiaire', 'Avancé'],
    },
  },
  {
    id: 'hoodie-panel-reset',
    title: 'Hoodie reconstruit par empiècements',
    category: 'Mode',
    confidence: 0,
    summary: 'Rééquilibrer un hoodie fatigué avec de grands empiècements ton sur ton, façon streetwear premium.',
    estimatedTime: '2h à demi-journée',
    difficulty: 'Intermédiaire',
    materials: ['Coton épais', 'Chutes jersey', 'Fil ton sur ton', 'Épingles ou pinces'],
    steps: [
      'Identifier les zones déformées : manches, poche, capuche ou bord-côte.',
      'Découper 2 à 4 empiècements larges plutôt que beaucoup de petits patchs.',
      'Assembler en gardant les coutures alignées avec la coupe existante.',
      'Terminer par une surpiqûre discrète pour stabiliser le volume.',
    ],
    cautions: ['Sur la maille, évite de tirer pendant la couture pour ne pas gondoler.'],
    tutorialIds: ['visible-patches-jacket'],
    matches: {
      pieceType: ['Hoodie', 'Pull'],
      material: ['Coton', 'Maille', 'Mix matières'],
      condition: ['Déformé', 'Usé', 'Troué'],
      objective: ['Transformer', 'Customiser'],
    },
  },
  {
    id: 'scrap-modular-pouch',
    title: 'Pochette modulaire en chutes',
    category: 'Accessoire',
    confidence: 0,
    summary: 'Assembler des chutes multiples en petit objet utile, rapide et très accessible.',
    estimatedTime: '45 min à 1h30',
    difficulty: 'Facile',
    materials: ['Chutes textiles', 'Bouton pression ou lien', 'Doublure', 'Fil récupéré'],
    steps: [
      'Regrouper les chutes par épaisseur proche.',
      'Former un panneau patchwork simple en 3 à 5 morceaux maximum.',
      'Doubler le panneau pour cacher les marges de couture.',
      'Fermer avec un bouton, un lien ou un petit zip récupéré.',
    ],
    cautions: ['Mélange moins de matières si tu débutes : le rendu sera plus propre.'],
    tutorialIds: ['fabric-scrap-pouch'],
    matches: {
      pieceType: ['Tissu', 'Autre'],
      condition: ['Chutes multiples', 'Inutilisé'],
      objective: ['Créer un accessoire', 'Customiser'],
      timeBudget: ['Moins de 1h', '1 à 3h'],
    },
  },
];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function scoreTemplate(template: RecommendationTemplate, profile: AssistantProfile) {
  const fieldScore = Object.entries(template.matches).reduce((score, [field, acceptedValues]) => {
    const profileValue = profile[field as keyof AssistantProfile];

    return acceptedValues?.includes(profileValue) ? score + 18 : score;
  }, 32);

  const note = normalizeText(profile.notes);
  const title = normalizeText(template.title);
  const category = normalizeText(template.category);
  const noteScore = note
    ? note
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 12)
        .reduce((score, word) => (title.includes(word) || category.includes(word) ? score + 4 : score), 0)
    : 0;

  return Math.min(96, fieldScore + noteScore);
}

export function buildTransformationPlan(profile: AssistantProfile): TransformationRecommendation[] {
  return recommendationTemplates
    .map((template) => ({
      ...template,
      confidence: scoreTemplate(template, profile),
    }))
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 3)
    .map(({ matches: _matches, ...recommendation }) => recommendation);
}
