import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type MaterialDraft = {
  id: string;
  title: string;
  pieceType: string;
  condition: string;
  goal: string;
  material: string;
  notes: string;
  imageName: string;
  imageDataUrl: string;
  createdAt: string;
};

type UploadFormState = Omit<MaterialDraft, 'id' | 'imageName' | 'imageDataUrl' | 'createdAt'>;

const STORAGE_KEY = 'reform:material-uploads';
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
};

function readStoredDrafts() {
  try {
    const rawDrafts = localStorage.getItem(STORAGE_KEY);
    return rawDrafts ? (JSON.parse(rawDrafts) as MaterialDraft[]) : [];
  } catch {
    return [];
  }
}

export default function UploadMaterialCTA() {
  const [form, setForm] = useState<UploadFormState>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [savedDrafts, setSavedDrafts] = useState<MaterialDraft[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setSavedDrafts(readStoredDrafts());
  }, []);

  const canSave = useMemo(() => Boolean(preview && form.title.trim()), [form.title, preview]);

  function updateField(field: keyof UploadFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus('');
  }

  function persistDrafts(nextDrafts: MaterialDraft[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
    setSavedDrafts(nextDrafts);
  }

  function resetForm(clearStatus = true) {
    setForm(initialForm);
    setPreview(null);
    setImageName('');
    if (clearStatus) {
      setStatus('');
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
            Tu as une veste abîmée, une tente usée ou un sac oublié ? Ajoute une photo et sauvegarde une fiche matière temporaire côté navigateur.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-textile/10 bg-cream/58 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage">Phase 3</p>
            <p className="mt-3 text-sm leading-6 text-textile/72">
              Upload front uniquement : aucune image n’est envoyée à un serveur. Les fiches sont conservées en local dans ce navigateur.
            </p>
          </div>
        </div>

        <form
          className="grid gap-4 rounded-[2rem] border border-textile/10 bg-cream/70 p-4 sm:p-5"
          onSubmit={(event) => {
            event.preventDefault();

            if (!preview || !form.title.trim()) {
              setStatus('Ajoute une photo et un nom de pièce avant de sauvegarder.');
              return;
            }

            const draft: MaterialDraft = {
              ...form,
              id: crypto.randomUUID(),
              title: form.title.trim(),
              imageName,
              imageDataUrl: preview,
              createdAt: new Date().toISOString(),
            };

            try {
              persistDrafts([draft, ...savedDrafts].slice(0, 6));
              setStatus('Fiche matière sauvegardée localement.');
              resetForm(false);
            } catch {
              setStatus('Sauvegarde impossible : l’image est probablement trop lourde pour le stockage local.');
            }
          }}
        >
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
                <span className="mt-1 text-sm text-textile/64">Preview + sauvegarde temporaire locale</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                  setPreview(String(reader.result));
                  setImageName(file.name);
                  setStatus('');
                };
                reader.onerror = () => setStatus('Impossible de lire cette image.');
                reader.readAsDataURL(file);
              }}
            />
          </label>

          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Nom de la pièce ou matière"
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
            className="resize-none rounded-[1.25rem] border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold leading-6 text-textile outline-none placeholder:text-textile/45"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-all duration-300 hover:bg-textile disabled:cursor-not-allowed disabled:opacity-45"
            >
              Sauvegarder localement
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
                      {draft.pieceType} · {draft.condition} · {draft.goal}
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
