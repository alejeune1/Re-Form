import { motion } from 'framer-motion';

const workshopImage =
  'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=80';

export default function NarrativeSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] border border-textile/10 bg-cream/58 shadow-[0_28px_90px_rgba(90,70,50,0.12)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="p-7 sm:p-10 lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Seconde vie</p>
          <p className="mt-8 max-w-4xl text-3xl font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-5xl">
            Un vêtement abîmé n’est pas une fin. Une tente usée, un sac oublié ou un jean déchiré peuvent devenir le point de départ d’une nouvelle silhouette.
          </p>
        </div>

        <div className="relative min-h-[320px] overflow-hidden md:min-h-full">
          <img
            src={workshopImage}
            alt="Atelier textile avec matières, tissus et gestes de couture"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,240,230,0.26),transparent_45%),linear-gradient(0deg,rgba(90,70,50,0.22),transparent_48%)]" />
        </div>
      </motion.div>
    </section>
  );
}
