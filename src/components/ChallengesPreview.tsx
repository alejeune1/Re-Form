import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { challenges } from '../data/challenges';
import { useRepositoryList } from '../hooks/useRepositoryList';
import { getChallenges } from '../services/reformRepository';
import ChallengeCard from './ChallengeCard';

export default function ChallengesPreview() {
  const initialChallenges = useMemo(() => challenges.slice(0, 4), []);
  const loadChallenges = useCallback(() => getChallenges(4), []);
  const { items, isLoading } = useRepositoryList(loadChallenges, initialChallenges);

  return (
    <section id="challenges" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Défis créatifs</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">
            Des contraintes pour créer mieux.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2" aria-busy={isLoading}>
          {items.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
