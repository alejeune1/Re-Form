import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Tutorial } from '../data/tutorials';

const swatches: Record<string, string> = {
  denim: 'from-[#496C83] via-[#6E8FA3] to-[#E8DCC8]',
  patch: 'from-[#8A9A7B] via-[#D3BE9C] to-[#5A4632]',
  scrap: 'from-[#F6F0E6] via-[#D7C6AA] to-[#8A9A7B]',
  tent: 'from-[#5A4632] via-[#A89F91] to-[#536B7F]',
};

type TutorialCardProps = {
  tutorial: Tutorial;
  index?: number;
  compact?: boolean;
};

export default function TutorialCard({ tutorial, index = 0, compact = false }: TutorialCardProps) {
  return (
    <motion.article
      id={tutorial.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.62, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-textile/10 bg-cream/68 p-4 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur transition-all duration-300 hover:border-sage/40"
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.45rem] bg-gradient-to-br ${swatches[tutorial.image]}`}>
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,rgba(246,240,230,0.7)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute bottom-4 left-4 rounded-full bg-cream/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-textile backdrop-blur">
          {tutorial.category}
        </div>
      </div>
      <div className="px-1 py-5">
        <h3 className="text-xl font-bold tracking-[-0.04em] text-ink">{tutorial.title}</h3>
        <p className="mt-3 text-sm leading-6 text-textile/72">{tutorial.description}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-textile/70">
          <span className="rounded-full bg-bone/50 px-3 py-1">{tutorial.material}</span>
          <span className="rounded-full bg-bone/50 px-3 py-1">{tutorial.difficulty}</span>
          <span className="rounded-full bg-bone/50 px-3 py-1">{tutorial.duration}</span>
        </div>
        <Link
          to={compact ? '/tutoriels' : `/tutoriels#${tutorial.id}`}
          className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream transition-colors duration-300 hover:bg-textile"
        >
          {compact ? 'Voir le tuto' : 'Ouvrir bientôt'}
        </Link>
      </div>
    </motion.article>
  );
}
