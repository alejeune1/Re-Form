import { motion } from 'framer-motion';

const features = [
  {
    title: 'Réutiliser l’existant',
    description: 'Chaque matière possède déjà une histoire. L’upcycling permet de la prolonger.',
    stat: '01',
  },
  {
    title: 'Créer sans uniformiser',
    description: 'Les pièces ne sont pas produites en série : chaque transformation devient unique.',
    stat: '02',
  },
  {
    title: 'Transformer l’inattendu',
    description: 'Tentes, sacs, vestes ou chutes textiles peuvent devenir de nouveaux vêtements.',
    stat: '03',
  },
];

export default function FeatureCards() {
  return (
    <section id="concept" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Pourquoi l’upcycling ?</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">
            La matière reste. La forme change.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -8, rotateX: 2, rotateY: index === 1 ? 0 : index === 0 ? -2 : 2 }}
              className="group relative overflow-hidden rounded-[2rem] border border-textile/10 bg-cream/62 p-7 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur transition-colors duration-300 hover:border-sage/35 hover:bg-white/32"
            >
              <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-sage/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100 md:opacity-0" />
              <div className="text-5xl font-black tracking-[-0.08em] text-sage/90">{feature.stat}</div>
              <h3 className="mt-8 text-2xl font-bold tracking-[-0.04em] text-ink">{feature.title}</h3>
              <p className="mt-4 leading-7 text-textile/72">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
