import { motion } from 'framer-motion';
import { useCallback } from 'react';
import TutorialCard from '../components/TutorialCard';
import { tutorials } from '../data/tutorials';
import { useRepositoryList } from '../hooks/useRepositoryList';
import { getTutorials } from '../services/reformRepository';

export default function Tutorials() {
  const loadTutorials = useCallback(() => getTutorials(), []);
  const { items, isLoading, source } = useRepositoryList(loadTutorials, tutorials);

  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Tutoriels</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-ink sm:text-7xl">
            Apprendre les gestes de l’upcycling.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-textile/74">
            Une base reliée à Supabase quand la configuration est présente, avec fallback mock pour garder le site utilisable.
          </p>
          {source === 'supabase' ? (
            <p className="mt-4 w-fit rounded-full bg-sage/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">
              Données Supabase
            </p>
          ) : null}
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy={isLoading}>
          {items.map((tutorial, index) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
