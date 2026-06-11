import { useEffect, useState, type FormEvent } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

type AuthPanelProps = {
  compact?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthPanel({ compact = false }: AuthPanelProps) {
  const { user, profile, isAuthLoading, signIn, signUp, signOut, updateDisplayName } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
  }, [profile?.display_name]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setStatus('Entre une adresse email valide.');
      return;
    }

    if (password.length < 8) {
      setStatus('Utilise au moins 8 caractères pour le mot de passe.');
      return;
    }

    setIsSubmitting(true);
    const error =
      mode === 'sign-in'
        ? await signIn(email, password)
        : await signUp(email, password, displayName || email.split('@')[0]);

    setStatus(error ?? (mode === 'sign-in' ? 'Connexion réussie.' : 'Compte créé. Vérifie ton email si Supabase le demande.'));
    setIsSubmitting(false);
  }

  async function handleProfileUpdate() {
    const error = await updateDisplayName(displayName);
    setStatus(error ?? 'Profil mis à jour.');
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-[1.5rem] border border-textile/10 bg-cream/68 p-5 text-sm leading-6 text-textile/72">
        Supabase n’est pas configuré. La communauté fonctionne en mode local.
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="rounded-[1.5rem] border border-textile/10 bg-cream/68 p-5 text-sm font-semibold text-textile/72">
        Vérification de la session...
      </div>
    );
  }

  if (user) {
    return (
      <section className="rounded-[1.75rem] border border-textile/10 bg-cream/72 p-5 shadow-[0_18px_60px_rgba(90,70,50,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Profil connecté</p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-ink">
          {profile?.display_name || user.email}
        </h2>
        <p className="mt-1 text-sm font-semibold text-textile/60">{user.email}</p>
        <div className={`mt-5 grid gap-3 ${compact ? '' : 'sm:grid-cols-[1fr_auto_auto]'}`}>
          <input
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value.slice(0, 80));
              setStatus('');
            }}
            maxLength={80}
            placeholder="Nom public"
            className="rounded-full border border-textile/12 bg-bone/30 px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
          />
          <button
            type="button"
            onClick={handleProfileUpdate}
            className="rounded-full border border-textile/14 px-4 py-3 text-sm font-bold text-ink transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10"
          >
            Mettre à jour
          </button>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full bg-ink px-4 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:bg-sage hover:text-ink"
          >
            Déconnexion
          </button>
        </div>
        {status ? <p className="mt-3 text-sm font-semibold text-textile/68">{status}</p> : null}
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-textile/10 bg-cream/72 p-5 shadow-[0_18px_60px_rgba(90,70,50,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Compte communauté</p>
      <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-ink">
        {mode === 'sign-in' ? 'Se connecter' : 'Créer un profil'}
      </h2>
      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        {mode === 'sign-up' ? (
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value.slice(0, 80))}
            maxLength={80}
            placeholder="Nom public"
            className="rounded-full border border-textile/12 bg-bone/30 px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
          />
        ) : null}
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value.slice(0, 120));
            setStatus('');
          }}
          placeholder="Email"
          className="rounded-full border border-textile/12 bg-bone/30 px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value.slice(0, 120));
            setStatus('');
          }}
          placeholder="Mot de passe"
          className="rounded-full border border-textile/12 bg-bone/30 px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:bg-sage hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'En cours...' : mode === 'sign-in' ? 'Connexion' : 'Créer le compte'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
              setStatus('');
            }}
            className="rounded-full border border-textile/14 px-5 py-3 text-sm font-bold text-ink transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10"
          >
            {mode === 'sign-in' ? 'Créer un compte' : 'J’ai déjà un compte'}
          </button>
        </div>
      </form>
      {status ? <p className="mt-3 text-sm font-semibold text-textile/68">{status}</p> : null}
    </section>
  );
}
