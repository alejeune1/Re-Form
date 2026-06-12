import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthPanel from '../components/AuthPanel';
import { contests as fallbackContests, type Contest } from '../data/contests';
import { useAuth } from '../hooks/useAuth';
import { useRepositoryList } from '../hooks/useRepositoryList';
import {
  getContests,
  getUserPublicCreations,
  submitCreationToContest,
  toggleContestRegistration,
  toggleContestVote,
  type UserCreationOption,
} from '../services/reformRepository';

type ContestFormState = {
  creationId: string;
  statement: string;
};

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString('fr-FR') : 'Date à préciser';
}

function getStatusClass(status: Contest['status']) {
  if (status === 'En cours') {
    return 'bg-sage/16 text-sage';
  }

  if (status === 'Terminé') {
    return 'bg-textile/10 text-textile/60';
  }

  return 'bg-bone/54 text-textile/70';
}

export default function Contests() {
  const { user } = useAuth();
  const loadContests = useCallback(() => getContests(user?.id), [user?.id]);
  const { items, source, isLoading, reload } = useRepositoryList(loadContests, fallbackContests);
  const [userCreations, setUserCreations] = useState<UserCreationOption[]>([]);
  const [forms, setForms] = useState<Record<string, ContestFormState>>({});
  const [statusByContestId, setStatusByContestId] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    getUserPublicCreations().then((creations) => {
      if (isActive) {
        setUserCreations(creations);
      }
    });

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const activeContests = useMemo(() => items.filter((contest) => contest.status !== 'Terminé'), [items]);
  const archivedContests = useMemo(() => items.filter((contest) => contest.status === 'Terminé'), [items]);

  function updateContestForm(contestId: string, patch: Partial<ContestFormState>) {
    setForms((current) => ({
      ...current,
      [contestId]: {
        creationId: current[contestId]?.creationId ?? '',
        statement: current[contestId]?.statement ?? '',
        ...patch,
      },
    }));
    setStatusByContestId((current) => ({ ...current, [contestId]: '' }));
  }

  async function handleRegistration(contest: Contest) {
    if (!user) {
      setStatusByContestId((current) => ({ ...current, [contest.id]: 'Connecte-toi pour t’inscrire.' }));
      return;
    }

    setIsSubmitting(true);
    const result = await toggleContestRegistration(contest.id, !contest.viewerRegistered);
    setIsSubmitting(false);

    if (result.ok) {
      setStatusByContestId((current) => ({
        ...current,
        [contest.id]: contest.viewerRegistered ? 'Inscription retirée.' : 'Inscription confirmée.',
      }));
      reload();
      return;
    }

    setStatusByContestId((current) => ({ ...current, [contest.id]: 'Inscription impossible côté Supabase.' }));
  }

  async function handleSubmission(contest: Contest) {
    const form = forms[contest.id];

    if (!user) {
      setStatusByContestId((current) => ({ ...current, [contest.id]: 'Connecte-toi pour soumettre une création.' }));
      return;
    }

    if (!form?.creationId) {
      setStatusByContestId((current) => ({ ...current, [contest.id]: 'Choisis une création publique à soumettre.' }));
      return;
    }

    setIsSubmitting(true);
    const result = await submitCreationToContest(contest.id, form.creationId, form.statement);
    setIsSubmitting(false);

    if (result.ok) {
      setStatusByContestId((current) => ({ ...current, [contest.id]: 'Soumission ajoutée au concours.' }));
      reload();
      return;
    }

    setStatusByContestId((current) => ({
      ...current,
      [contest.id]: 'Soumission impossible. Vérifie que la création est publique et que le concours est en cours.',
    }));
  }

  async function handleVote(contest: Contest, creationId: string, viewerHasVoted?: boolean) {
    if (!user) {
      setStatusByContestId((current) => ({ ...current, [contest.id]: 'Connecte-toi pour voter.' }));
      return;
    }

    setIsSubmitting(true);
    const result = await toggleContestVote(contest.id, creationId, !viewerHasVoted);
    setIsSubmitting(false);

    if (result.ok) {
      setStatusByContestId((current) => ({ ...current, [contest.id]: viewerHasVoted ? 'Vote retiré.' : 'Vote enregistré.' }));
      reload();
      return;
    }

    setStatusByContestId((current) => ({ ...current, [contest.id]: 'Vote impossible côté Supabase.' }));
  }

  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.58fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Concours</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-ink sm:text-7xl">
              Des tournois pour transformer mieux.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-textile/74">
              Inscris-toi, soumets une création publique, vote pour les pièces les plus fortes et suis le classement communautaire.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-sage/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">
                {source === 'supabase' ? 'Données Supabase' : 'Fallback mock'}
              </span>
              <span className="rounded-full border border-textile/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-textile/62">
                Inscriptions · Soumissions · Classements
              </span>
            </div>
          </motion.div>

          <AuthPanel />
        </div>

        <div className="mt-12 grid gap-6" aria-busy={isLoading}>
          {activeContests.map((contest, index) => (
            <motion.article
              key={contest.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: index * 0.06, ease: 'easeOut' }}
              className="grid gap-6 rounded-[2.25rem] border border-textile/10 bg-cream/70 p-5 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur lg:grid-cols-[0.85fr_1.15fr] lg:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${getStatusClass(contest.status)}`}>
                    {contest.status}
                  </span>
                  <span className="rounded-full border border-textile/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-textile/56">
                    {contest.participants} inscrits
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-ink sm:text-4xl">{contest.title}</h2>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-sage">{contest.theme}</p>
                <p className="mt-4 leading-7 text-textile/72">{contest.description}</p>
                <p className="mt-4 text-sm font-semibold text-textile/58">
                  {formatDate(contest.startsAt)} → {formatDate(contest.endsAt)}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting || contest.status === 'Terminé'}
                    onClick={() => handleRegistration(contest)}
                    className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:bg-sage hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {contest.viewerRegistered ? 'Quitter le concours' : 'S’inscrire'}
                  </button>
                </div>

                {contest.status === 'En cours' ? (
                  <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-textile/10 bg-bone/28 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Soumettre une création</p>
                    <select
                      value={forms[contest.id]?.creationId ?? ''}
                      onChange={(event) => updateContestForm(contest.id, { creationId: event.target.value })}
                      className="rounded-full border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold text-textile outline-none"
                    >
                      <option value="">Création publique à choisir</option>
                      {userCreations.map((creation) => (
                        <option key={creation.id} value={creation.id}>
                          {creation.title} · {creation.material}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={forms[contest.id]?.statement ?? ''}
                      onChange={(event) => updateContestForm(contest.id, { statement: event.target.value.slice(0, 500) })}
                      maxLength={500}
                      rows={3}
                      placeholder="Explique l’intention de transformation..."
                      className="resize-none rounded-[1.25rem] border border-textile/12 bg-cream px-4 py-3 text-sm font-semibold leading-6 text-textile outline-none placeholder:text-textile/45"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSubmission(contest)}
                      className="w-fit rounded-full border border-textile/14 px-5 py-3 text-sm font-bold text-ink transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Soumettre au concours
                    </button>
                  </div>
                ) : null}

                {statusByContestId[contest.id] ? <p className="mt-4 text-sm font-semibold text-textile/70">{statusByContestId[contest.id]}</p> : null}
              </div>

              <div className="rounded-[1.75rem] border border-textile/10 bg-bone/24 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Classement</p>
                <div className="mt-4 grid gap-3">
                  {contest.submissions.length > 0 ? (
                    contest.submissions.map((submission, submissionIndex) => (
                      <article
                        key={submission.id}
                        className="grid gap-3 rounded-[1.25rem] border border-textile/10 bg-cream/68 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-black text-cream">
                          #{submissionIndex + 1}
                        </span>
                        <div>
                          <h3 className="font-black tracking-[-0.04em] text-ink">{submission.title}</h3>
                          <p className="mt-1 text-sm font-semibold text-textile/60">
                            {submission.authorName} · {submission.material} · {submission.technique}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isSubmitting || contest.status !== 'En cours'}
                          onClick={() => handleVote(contest, submission.creationId, submission.viewerHasVoted)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${
                            submission.viewerHasVoted ? 'bg-sage text-cream' : 'border border-textile/14 text-ink hover:bg-sage/12'
                          }`}
                        >
                          {submission.votes + (submission.viewerHasVoted ? 0 : 0)} votes
                        </button>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-[1.25rem] bg-cream/60 p-4 text-sm font-semibold leading-6 text-textile/66">
                      Aucune soumission encore. Publie une création dans la communauté, puis soumets-la ici.
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Archives</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-ink sm:text-5xl">Anciens concours.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {archivedContests.map((contest) => (
              <article key={contest.id} className="rounded-[1.75rem] border border-textile/10 bg-cream/64 p-5 shadow-[0_18px_60px_rgba(90,70,50,0.08)]">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${getStatusClass(contest.status)}`}>
                  {contest.status}
                </span>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-ink">{contest.title}</h3>
                <p className="mt-3 text-sm leading-6 text-textile/70">{contest.description}</p>
                <p className="mt-4 text-sm font-bold text-sage">
                  Gagnant : {contest.submissions[0]?.title ?? 'Archive en cours'}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
