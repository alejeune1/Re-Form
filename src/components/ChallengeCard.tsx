import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Challenge } from '../data/challenges';

type ChallengeCardProps = {
  challenge: Challenge;
  index?: number;
  compact?: boolean;
};

export default function ChallengeCard({ challenge, index = 0, compact = false }: ChallengeCardProps) {
  return (
    <motion.article
      id={challenge.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.62, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -7 }}
      className="rounded-[2rem] border border-textile/10 bg-cream/68 p-6 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur transition-all duration-300 hover:border-sage/40"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-sage/14 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sage">
          {challenge.status}
        </span>
        <span className="text-sm font-semibold text-textile/65">{challenge.participants} participants</span>
      </div>
      <h3 className="mt-6 text-2xl font-bold tracking-[-0.04em] text-ink">{challenge.title}</h3>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-sage">{challenge.theme}</p>
      <p className="mt-4 leading-7 text-textile/72">{challenge.description}</p>
      <Link
        to={compact ? '/defis' : `/defis#${challenge.id}`}
        className="mt-6 inline-flex rounded-full border border-textile/14 px-4 py-2 text-sm font-bold text-ink transition-colors duration-300 hover:border-sage/50 hover:bg-sage/10"
      >
        {compact ? (challenge.status === 'En cours' ? 'Voir le défi' : 'Participer bientôt') : 'Détails bientôt'}
      </Link>
    </motion.article>
  );
}
