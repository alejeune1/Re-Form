import { motion } from 'framer-motion';
import { useCallback } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import { challenges } from '../data/challenges';
import { useRepositoryList } from '../hooks/useRepositoryList';
import { getChallenges } from '../services/reformRepository';

export default function Challenges() {
  const loadChallenges = useCallback(() => getChallenges(), []);
  const { items, isLoading, source } = useRepositoryList(loadChallenges, challenges);

  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Défis</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-ink sm:text-7xl">
            Les futurs concours créatifs RE:FORM.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-textile/74">
            Des défis reliés à Supabase quand la configuration est présente, avec fallback mock pour préserver l’expérience.
          </p>
          {source === 'supabase' ? (
            <p className="mt-4 w-fit rounded-full bg-sage/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">
              Données Supabase
            </p>
          ) : null}
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2" aria-busy={isLoading}>
          {items.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
