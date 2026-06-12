import { motion } from 'framer-motion';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  assistantOptions,
  buildTransformationPlan,
  initialAssistantProfile,
  type AssistantProfile,
  type TransformationRecommendation,
} from '../data/transformationAssistant';
import { tutorials } from '../data/tutorials';

type AssistantHistoryItem = {
  id: string;
  title: string;
  material: string;
  pieceType: string;
  topRecommendation: string;
  createdAt: string;
};

const STORAGE_KEY = 'reform:assistant-history';
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_HISTORY_ITEMS = 4;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const ACCEPTED_IMAGE_PREFIXES = ['data:image/jpeg;', 'data:image/png;', 'data:image/webp;'];

function isAllowedImageDataUrl(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= Math.ceil(MAX_FILE_SIZE_BYTES * 1.4) &&
    ACCEPTED_IMAGE_PREFIXES.some((prefix) => value.startsWith(prefix))
  );
}

function createSafeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isHistoryItem(value: unknown): value is AssistantHistoryItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<AssistantHistoryItem>;

  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    item.title.length <= 80 &&
    typeof item.material === 'string' &&
    item.material.length <= 80 &&
    typeof item.pieceType === 'string' &&
    item.pieceType.length <= 80 &&
    typeof item.topRecommendation === 'string' &&
    item.topRecommendation.length <= 140 &&
    typeof item.createdAt === 'string' &&
    !Number.isNaN(Date.parse(item.createdAt))
  );
}

function readHistory() {
  try {
    const rawHistory = localStorage.getItem(STORAGE_KEY);
    const parsedHistory = rawHistory ? JSON.parse(rawHistory) : [];

    return Array.isArray(parsedHistory) ? parsedHistory.filter(isHistoryItem).slice(0, MAX_HISTORY_ITEMS) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function persistHistory(items: AssistantHistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)));
}

export default function TransformationAssistant() {
  const [profile, setProfile] = useState<AssistantProfile>(initialAssistantProfile);
  const [preview, setPreview] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<TransformationRecommendation[]>([]);
  const [history, setHistory] = useState<AssistantHistoryItem[]>(readHistory);
  const [status, setStatus] = useState('');

  const tutorialById = useMemo(
    () =>
      tutorials.reduce<Record<string, (typeof tutorials)[number]>>((tutorialMap, tutorial) => {
        tutorialMap[tutorial.id] = tutorial;
        return tutorialMap;
      }, {}),
    [],
  );

  function updateProfile(field: keyof AssistantProfile, value: string) {
    const maxLength = field === 'notes' ? 500 : 80;
    setProfile((current) => ({ ...current, [field]: value.slice(0, maxLength) }));
    setStatus('');
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.currentTarget.value = '';

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
      setStatus('Format refusé. Utilise une image JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setStatus('Image trop lourde. Limite actuelle : 2 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);

      if (!isAllowedImageDataUrl(result)) {
        setStatus('Image refusée : format de données non autorisé.');
        return;
      }

      setPreview(result);
      setStatus('');
    };
    reader.onerror = () => setStatus('Impossible de lire cette image.');
    reader.readAsDataURL(file);
  }

  function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!preview) {
      setStatus('Ajoute une photo textile avant de générer les pistes.');
      return;
    }

    if (!profile.title.trim()) {
      setStatus('Ajoute un nom court pour cette matière.');
      return;
    }

    const nextRecommendations = buildTransformationPlan({
      ...profile,
      title: profile.title.trim().slice(0, 80),
      notes: profile.notes.trim().slice(0, 500),
    });
    const nextHistory = [
      {
        id: createSafeId(),
        title: profile.title.trim().slice(0, 80),
        material: profile.material,
        pieceType: profile.pieceType,
        topRecommendation: nextRecommendations[0]?.title ?? 'Analyse textile',
        createdAt: new Date().toISOString(),
      },
      ...history,
    ].slice(0, MAX_HISTORY_ITEMS);

    setRecommendations(nextRecommendations);
    setHistory(nextHistory);

    try {
      persistHistory(nextHistory);
      setStatus('Analyse locale générée. Aucune image n’a été envoyée.');
    } catch {
      setStatus('Analyse générée, mais l’historique local n’a pas pu être sauvegardé.');
    }
  }

  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-5xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Assistant de transformation</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-ink sm:text-7xl">
            Lire une matière, choisir une direction.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-textile/74">
            Upload local, analyse manuelle guidée, suggestions de transformation et tutoriels recommandés. L’IA pourra être branchée plus tard, mais aucune image n’est envoyée aujourd’hui.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.form
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="grid gap-4 rounded-[2.25rem] border border-textile/10 bg-cream/72 p-5 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur"
            onSubmit={handleAnalyze}
          >
            <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.6rem] border border-dashed border-textile/25 bg-bone/24 p-5 text-center transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10">
              {preview ? (
                <img src={preview} alt="Aperçu textile analysé localement" className="h-72 w-full rounded-[1.25rem] object-cover" />
              ) : (
                <>
                  <span className="text-4xl">＋</span>
                  <span className="mt-3 text-sm font-bold text-ink">Ajouter une photo textile</span>
                  <span className="mt-1 max-w-sm text-sm leading-6 text-textile/64">
                    JPG, PNG ou WebP. L’image reste dans le navigateur.
                  </span>
                </>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFile} />
            </label>

            <input
              value={profile.title}
              onChange={(event) => updateProfile('title', event.target.value)}
              maxLength={80}
              placeholder="Nom de la matière ou pièce"
              className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={profile.pieceType}
                onChange={(event) => updateProfile('pieceType', event.target.value)}
                className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
              >
                {assistantOptions.pieceTypes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={profile.material}
                onChange={(event) => updateProfile('material', event.target.value)}
                className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
              >
                {assistantOptions.materials.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={profile.condition}
                onChange={(event) => updateProfile('condition', event.target.value)}
                className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
              >
                {assistantOptions.conditions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={profile.objective}
                onChange={(event) => updateProfile('objective', event.target.value)}
                className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
              >
                {assistantOptions.objectives.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={profile.skillLevel}
                onChange={(event) => updateProfile('skillLevel', event.target.value)}
                className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
              >
                {assistantOptions.skillLevels.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={profile.timeBudget}
                onChange={(event) => updateProfile('timeBudget', event.target.value)}
                className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
              >
                {assistantOptions.timeBudgets.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <textarea
              value={profile.notes}
              onChange={(event) => updateProfile('notes', event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Décris rapidement : zones abîmées, dimensions, pièces récupérables, contraintes..."
              className="resize-none rounded-[1.25rem] border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold leading-6 text-textile outline-none placeholder:text-textile/45"
            />

            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:bg-sage hover:text-ink"
            >
              Générer les pistes
            </button>

            {status ? <p className="text-sm font-semibold text-textile/70">{status}</p> : null}
          </motion.form>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-textile/10 bg-bone/30 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">Mode actuel</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-ink">Analyse locale guidée.</h2>
              <p className="mt-3 text-sm leading-7 text-textile/72">
                Les recommandations sont générées par règles éditoriales : matière, état, objectif, niveau et temps disponible. C’est volontairement explicable et sécurisé avant une future couche IA.
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map((recommendation) => (
                  <article key={recommendation.id} className="rounded-[1.75rem] border border-textile/10 bg-cream/72 p-5 shadow-[0_18px_60px_rgba(90,70,50,0.08)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-sage/14 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sage">
                        {recommendation.category}
                      </span>
                      <span className="text-sm font-bold text-textile/62">{recommendation.confidence}% cohérent</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-ink">{recommendation.title}</h3>
                    <p className="mt-3 leading-7 text-textile/74">{recommendation.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-bone/42 px-3 py-1 text-xs font-bold text-textile/70">{recommendation.difficulty}</span>
                      <span className="rounded-full bg-bone/42 px-3 py-1 text-xs font-bold text-textile/70">{recommendation.estimatedTime}</span>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage">Étapes</p>
                        <ol className="mt-3 grid gap-2 text-sm leading-6 text-textile/72">
                          {recommendation.steps.map((step) => (
                            <li key={step}>— {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage">Matériel</p>
                        <ul className="mt-3 grid gap-2 text-sm leading-6 text-textile/72">
                          {recommendation.materials.map((material) => (
                            <li key={material}>— {material}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {recommendation.tutorialIds.map((tutorialId) => (
                        <Link
                          key={tutorialId}
                          to={`/tutoriels#${tutorialId}`}
                          className="rounded-full border border-textile/14 px-4 py-2 text-sm font-bold text-ink transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10"
                        >
                          {tutorialById[tutorialId]?.title ?? 'Voir tutoriel'}
                        </Link>
                      ))}
                    </div>
                    {recommendation.cautions.length > 0 ? (
                      <p className="mt-4 rounded-[1rem] bg-bone/36 p-3 text-sm leading-6 text-textile/68">
                        {recommendation.cautions[0]}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-textile/10 bg-cream/68 p-6 text-textile/72 shadow-[0_18px_60px_rgba(90,70,50,0.08)]">
                Ajoute une photo et quelques informations pour obtenir trois pistes de transformation.
              </div>
            )}
          </div>
        </div>

        {history.length > 0 ? (
          <section className="mt-14">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Historique local</p>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {history.map((item) => (
                <article key={item.id} className="rounded-[1.5rem] border border-textile/10 bg-cream/62 p-4 shadow-[0_14px_48px_rgba(90,70,50,0.07)]">
                  <h3 className="font-black tracking-[-0.04em] text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-textile/64">
                    {item.pieceType} · {item.material}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-sage">{item.topRecommendation}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
