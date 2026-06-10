import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { tutorials } from '../data/tutorials';
import TutorialCard from './TutorialCard';

export default function TutorialsPreview() {
  return (
    <section id="tutorials" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Tutoriels populaires</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">
              Des gestes simples pour commencer.
            </h2>
          </motion.div>
          <Link
            to="/tutoriels"
            className="inline-flex w-fit rounded-full border border-textile/16 bg-cream/64 px-5 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:border-sage/50 hover:bg-sage/15"
          >
            Voir tous les tutoriels
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tutorials.map((tutorial, index) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} index={index} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
