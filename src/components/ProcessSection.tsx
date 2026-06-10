import { motion } from 'framer-motion';

const steps = [
  {
    label: '01',
    title: 'Trouver la matière',
    description: 'Nous partons de vêtements, textiles techniques ou objets oubliés.',
  },
  {
    label: '02',
    title: 'Imaginer la coupe',
    description: 'Chaque défaut, texture ou trace devient une contrainte créative.',
  },
  {
    label: '03',
    title: 'Reconstruire la pièce',
    description: 'La matière est découpée, assemblée et transformée en vêtement unique.',
  },
];

const textureImage =
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80';

export default function ProcessSection() {
  return (
    <section id="process" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-textile/10 bg-bone/34 p-6 shadow-[0_28px_90px_rgba(90,70,50,0.1)] backdrop-blur md:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Process</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-5xl">
              La reconstruction comme méthode.
            </h2>
            <p className="mt-6 max-w-md leading-8 text-textile/75">
              Peu d’étapes, mais des choix nets. La coupe révèle la matière plutôt que de la masquer.
            </p>
            <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-textile/10 bg-cream/55">
              <img
                src={textureImage}
                alt="Portant de vêtements et textiles prêts à être transformés"
                className="h-64 w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

          <div className="grid gap-2">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.62, delay: index * 0.1, ease: 'easeOut' }}
                className="grid gap-5 border-t border-textile/14 py-7 transition-colors duration-300 hover:border-sage/45 sm:grid-cols-[112px_1fr]"
              >
                <div className="text-5xl font-black leading-none tracking-[-0.08em] text-sage/80">
                  {step.label}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.04em] text-ink">{step.title}</h3>
                  <p className="mt-3 leading-7 text-textile/74">{step.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
