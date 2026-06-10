import { motion } from 'framer-motion';
import ChallengeCard from '../components/ChallengeCard';
import { challenges } from '../data/challenges';

export default function Challenges() {
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
            Des défis mockés pour préparer les prochains tournois : thèmes, statuts, participation et règles à venir.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
