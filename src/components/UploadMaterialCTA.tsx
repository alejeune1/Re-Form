import { motion } from 'framer-motion';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { saveMaterialCreation } from '../services/reformRepository';

type MaterialDraft = {
  id: string;
  title: string;
  pieceType: string;
  condition: string;
  goal: string;
  material: string;
  notes: string;
  visibility: 'private' | 'public';
  imageName: string;
  imageDataUrl: string;
  createdAt: string;
};

type UploadFormState = Omit<MaterialDraft, 'id' | 'imageName' | 'imageDataUrl' | 'createdAt'>;

const STORAGE_KEY = 'reform:material-uploads';
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_STORED_DRAFTS = 3;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const ACCEPTED_IMAGE_PREFIXES = ['data:image/jpeg;', 'data:image/png;', 'data:image/webp;'];

const pieceTypes = ['Jean', 'Veste', 'Sac', 'Tente', 'Tissu', 'Autre'];
const conditions = ['Abîmé', 'Troué', 'Taché', 'Inutilisé'];
const goals = ['Réparer', 'Transformer', 'Customiser'];
const materials = ['Denim', 'Coton', 'Toile technique', 'Canvas', 'Maille', 'Mix matières'];

const initialForm: UploadFormState = {
  title: '',
  pieceType: 'Veste',
  condition: 'Abîmé',
  goal: 'Transformer',
  material: 'Denim',
  notes: '',
  visibility: 'private',
};

function clampText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function isAllowedImageDataUrl(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= Math.ceil(MAX_FILE_SIZE_BYTES * 1.4) &&
    ACCEPTED_IMAGE_PREFIXES.some((prefix) => value.startsWith(prefix))
  );
}

function isStoredDraft(value: unknown): value is MaterialDraft {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const draft = value as Partial<MaterialDraft>;

  return (
    typeof draft.id === 'string' &&
    typeof draft.title === 'string' &&
    draft.title.length <= 80 &&
    typeof draft.pieceType === 'string' &&
    pieceTypes.includes(draft.pieceType) &&
    typeof draft.condition === 'string' &&
    conditions.includes(draft.condition) &&
    typeof draft.goal === 'string' &&
    goals.includes(draft.goal) &&
    typeof draft.material === 'string' &&
    materials.includes(draft.material) &&
    typeof draft.notes === 'string' &&
    draft.notes.length <= 500 &&
    (draft.visibility === 'private' || draft.visibility === 'public') &&
    typeof draft.imageName === 'string' &&
    draft.imageName.length <= 120 &&
    isAllowedImageDataUrl(draft.imageDataUrl) &&
    typeof draft.createdAt === 'string' &&
    !Number.isNaN(Date.parse(draft.createdAt))
  );
}

function readStoredDrafts() {
  try {
    const rawDrafts = localStorage.getItem(STORAGE_KEY);
    const parsedDrafts = rawDrafts ? JSON.parse(rawDrafts) : [];

    return Array.isArray(parsedDrafts) ? parsedDrafts.filter(isStoredDraft).slice(0, MAX_STORED_DRAFTS) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function createDraftId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function UploadMaterialCTA() {
  const [form, setForm] = useState<UploadFormState>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [savedDrafts, setSavedDrafts] = useState<MaterialDraft[]>([]);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSavedDrafts(readStoredDrafts());
  }, []);

  const canSave = useMemo(() => Boolean(preview && form.title.trim()), [form.title, preview]);

  function updateField(field: keyof UploadFormState, value: string) {
    const maxLength = field === 'notes' ? 500 : 80;
    setForm((current) => ({ ...current, [field]: value.slice(0, maxLength) }));
    setStatus('');
  }

  function persistDrafts(nextDrafts: MaterialDraft[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts.slice(0, MAX_STORED_DRAFTS)));
    setSavedDrafts(nextDrafts.slice(0, MAX_STORED_DRAFTS));
  }

  function resetForm(clearStatus = true) {
    setForm(initialForm);
    setPreview(null);
    setImageName('');
    if (clearStatus) {
      setStatus('');
    }
  }

  function handleFile(file: File) {
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
      setImageName(file.name.slice(0, 120));
      setStatus('');
    };
    reader.onerror = () => setStatus('Impossible de lire cette image.');
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!preview || !form.title.trim()) {
      setStatus('Ajoute une photo et un nom de pièce avant de sauvegarder.');
      return;
    }

    if (!isAllowedImageDataUrl(preview)) {
      setStatus('Image refusée : les données stockées ne sont pas valides.');
      return;
    }

    const draft: MaterialDraft = {
      ...form,
      id: createDraftId(),
      title: clampText(form.title, 80),
      notes: clampText(form.notes, 500),
      imageName,
      imageDataUrl: preview,
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);

    try {
      const remoteResult = await saveMaterialCreation(draft);

      try {
        persistDrafts([draft, ...savedDrafts]);
      } catch {
        setStatus(
          remoteResult.mode === 'supabase'
            ? 'Fiche envoyée vers Supabase, mais copie locale impossible.'
            : 'Sauvegarde impossible : l’image est probablement trop lourde pour le stockage local.',
        );
        return;
      }

      if (remoteResult.mode === 'supabase') {
        setStatus(
          draft.visibility === 'public'
            ? 'Création publiée dans la communauté et conservée localement.'
            : 'Fiche matière privée envoyée vers Supabase et conservée localement.',
        );
      } else if (remoteResult.reason === 'not-authenticated') {
        setStatus('Fiche sauvegardée localement. Connecte-toi pour publier dans la communauté.');
      } else if (remoteResult.reason === 'remote-error') {
        setStatus('Fiche sauvegardée localement. Envoi Supabase indisponible pour le moment.');
      } else {
        setStatus('Fiche matière sauvegardée localement. Configure Supabase pour l’envoi serveur.');
      }

      resetForm(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section id="upload" className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto grid max-w-7xl gap-8 rounded-[2.5rem] border border-textile/10 bg-bone/36 p-6 shadow-[0_28px_90px_rgba(90,70,50,0.11)] backdrop-blur md:p-10 lg:grid-cols-[0.82fr_1.18fr] lg:p-14"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Uploader une matière</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-5xl">
            Et si cette pièce devenait autre chose ?
          </h2>
          <p className="mt-6 max-w-xl leading-8 text-textile/75">
            Ajoute une photo, qualifie la matière, puis sauvegarde une fiche. Connecté, tu peux aussi la publier dans la communauté RE:FORM.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-textile/10 bg-cream/58 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage">Phase 5</p>
            <p className="mt-3 text-sm leading-6 text-textile/72">
              Envoi Supabase sécurisé si un utilisateur est connecté. Sinon, fallback local. Formats acceptés : JPG, PNG, WebP. Limite : 2 Mo.
            </p>
          </div>
        </div>

        <form className="grid gap-4 rounded-[2rem] border border-textile/10 bg-cream/70 p-4 sm:p-5" onSubmit={handleSubmit}>
          <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-textile/25 bg-white/24 p-6 text-center transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10">
            {preview ? (
              <div className="relative h-full w-full">
                <img src={preview} alt="Aperçu de la matière uploadée" className="h-64 w-full rounded-[1.1rem] object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-cream/86 px-3 py-1 text-xs font-bold text-textile backdrop-blur">
                  {imageName}
                </span>
              </div>
            ) : (
              <>
                <span className="text-4xl">＋</span>
                <span className="mt-3 text-sm font-bold text-ink">Ajouter une photo</span>
                <span className="mt-1 text-sm text-textile/64">Preview immédiate + sauvegarde progressive</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleFile(file);
                }
                event.currentTarget.value = '';
              }}
            />
          </label>

          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Nom de la pièce ou matière"
            maxLength={80}
            className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
          />

          <div className="grid gap-3 md:grid-cols-3">
            <select
              value={form.pieceType}
              onChange={(event) => updateField('pieceType', event.target.value)}
              className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
            >
              {pieceTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select
              value={form.condition}
              onChange={(event) => updateField('condition', event.target.value)}
              className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
            >
              {conditions.map((condition) => (
                <option key={condition}>{condition}</option>
              ))}
            </select>
            <select
              value={form.goal}
              onChange={(event) => updateField('goal', event.target.value)}
              className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
            >
              {goals.map((goal) => (
                <option key={goal}>{goal}</option>
              ))}
            </select>
          </div>

          <select
            value={form.material}
            onChange={(event) => updateField('material', event.target.value)}
            className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
          >
            {materials.map((material) => (
              <option key={material}>{material}</option>
            ))}
          </select>

          <textarea
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Décris les défauts, dimensions, textures ou idées de transformation..."
            rows={4}
            maxLength={500}
            className="resize-none rounded-[1.25rem] border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold leading-6 text-textile outline-none placeholder:text-textile/45"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-textile/10 bg-bone/28 p-4">
            <input
              type="checkbox"
              checked={form.visibility === 'public'}
              onChange={(event) => {
                setForm((current) => ({ ...current, visibility: event.target.checked ? 'public' : 'private' }));
                setStatus('');
              }}
              className="mt-1 h-4 w-4 accent-sage"
            />
            <span>
              <span className="block text-sm font-bold text-ink">Publier dans la communauté</span>
              <span className="mt-1 block text-sm leading-6 text-textile/64">
                La création sera visible dans le feed après sauvegarde Supabase. Sans connexion, elle reste uniquement locale.
              </span>
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={!canSave || isSaving}
              className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-all duration-300 hover:bg-textile disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder la fiche'}
            </button>
            <button
              type="button"
              onClick={() => resetForm()}
              className="rounded-full border border-textile/14 px-5 py-3 text-sm font-bold text-ink transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10"
            >
              Réinitialiser
            </button>
          </div>

          {status ? <p className="text-sm font-semibold text-textile/72">{status}</p> : null}

          {savedDrafts.length > 0 ? (
            <div className="mt-3 grid gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">Matières sauvegardées</p>
              {savedDrafts.map((draft) => (
                <article key={draft.id} className="grid grid-cols-[72px_1fr] gap-4 rounded-[1.25rem] border border-textile/10 bg-bone/30 p-3">
                  <img src={draft.imageDataUrl} alt="" className="h-[72px] w-[72px] rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold tracking-[-0.03em] text-ink">{draft.title}</h3>
                    <p className="mt-1 text-sm text-textile/68">
                      {draft.pieceType} · {draft.condition} · {draft.visibility === 'public' ? 'Publié' : 'Privé'}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-textile/54">
                      {new Date(draft.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </form>
      </motion.div>
    </section>
  );
}
