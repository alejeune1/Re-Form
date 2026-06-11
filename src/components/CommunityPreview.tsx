import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const actions = ['Poster ses créations', 'Voter pour des transformations', 'Participer aux concours', 'Partager des idées'];

export default function CommunityPreview() {
  return (
    <section id="community" className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-7xl rounded-[2.5rem] border border-textile/10 bg-cream/68 p-7 shadow-[0_28px_90px_rgba(90,70,50,0.12)] backdrop-blur sm:p-10 lg:p-14"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Communauté</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">
              Une communauté pour apprendre, transformer et montrer ce que la matière peut devenir.
            </h2>
            <Link
              to="/communaute"
              className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:bg-sage hover:text-ink"
            >
              Voir la communauté
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {actions.map((action) => (
              <div key={action} className="rounded-[1.25rem] border border-textile/10 bg-bone/30 p-4 text-sm font-semibold text-textile/76">
                {action}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
