import { motion } from 'framer-motion';

const pillars = [
  {
    title: 'Apprendre',
    description: 'Des tutoriels simples pour transformer vêtements, tissus, sacs ou matières oubliées.',
    marker: '01',
  },
  {
    title: 'Transformer',
    description: 'Uploade une pièce ou une matière, puis découvre des idées de transformation adaptées.',
    marker: '02',
  },
  {
    title: 'Participer',
    description: 'Rejoins des défis créatifs et concours autour de l’upcycling textile.',
    marker: '03',
  },
];

export default function PlatformPillars() {
  return (
    <section id="concept" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Explorer l’upcycling</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">
            Une plateforme pour apprendre, transformer, partager.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.62, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[2rem] border border-textile/10 bg-cream/68 p-7 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur transition-all duration-300 hover:border-sage/40 hover:bg-white/35"
            >
              <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-sage/14 blur-3xl" />
              <div className="text-5xl font-black tracking-[-0.08em] text-sage/80">{pillar.marker}</div>
              <h3 className="mt-8 text-2xl font-bold tracking-[-0.04em] text-ink">{pillar.title}</h3>
              <p className="mt-4 leading-7 text-textile/72">{pillar.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
