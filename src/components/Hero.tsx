import { motion } from 'framer-motion';
import { useState } from 'react';
import AnimatedHeroImage from './AnimatedHeroImage';
import PatchedTypography from './PatchedTypography';

const textileBadges = ['Denim', 'Patchwork', 'Réparé', 'Recréé', 'Pièce unique'];

export default function Hero() {
  const [isCollectionHovering, setIsCollectionHovering] = useState(false);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-textile/15 bg-cream/65 px-4 py-2 text-xs uppercase tracking-[0.32em] text-textile/70 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-sage shadow-[0_0_24px_rgba(138,154,123,0.65)]" />
            Atelier textile circulaire
          </div>

          <h1 className="max-w-5xl text-6xl font-black leading-[0.88] tracking-[-0.08em] text-textile [text-shadow:0_1px_0_rgba(246,240,230,0.62),0_18px_34px_rgba(90,70,50,0.14)] sm:text-7xl md:text-8xl lg:text-9xl">
            <span className="block w-fit text-left">
              <span className="block">Redonner</span>
              <span className="block">vie</span>
            </span>
            <span className="sr-only"> à la matière.</span>
            <motion.span
              className="mt-2 block w-full max-w-[760px] origin-left sm:mt-3 sm:max-w-[820px] lg:max-w-[720px] xl:max-w-[780px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              whileHover={{ y: -2 }}
            >
              <PatchedTypography className="h-auto w-full" />
            </motion.span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-textile/78 sm:text-xl">
            Des textiles oubliés transformés en pièces uniques, entre création, réparation et nouvelle identité.
          </p>

          <div className="mt-7 flex max-w-2xl flex-wrap gap-3">
            {textileBadges.map((badge) => (
              <motion.span
                key={badge}
                whileHover={{ y: -3, scale: 1.03 }}
                className="rounded-full border border-textile/14 bg-cream/70 px-4 py-2 text-sm font-semibold text-textile/76 shadow-sm backdrop-blur transition-colors duration-300 hover:border-sage/50 hover:bg-sage/15"
              >
                {badge}
              </motion.span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#tutorials"
              onMouseEnter={() => setIsCollectionHovering(true)}
              onMouseLeave={() => setIsCollectionHovering(false)}
              onFocus={() => setIsCollectionHovering(true)}
              onBlur={() => setIsCollectionHovering(false)}
              className="group inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-bold text-cream shadow-[0_22px_55px_rgba(90,70,50,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-textile"
            >
              Explorer les tutoriels
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <a
              href="#upload"
              className="inline-flex items-center justify-center rounded-full border border-textile/16 bg-cream/60 px-6 py-4 text-sm font-semibold text-ink shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/50 hover:bg-sage/15"
            >
              Uploader une matière
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="relative z-10 min-h-[360px] sm:min-h-[460px] lg:min-h-[640px]"
        >
          <AnimatedHeroImage intensify={isCollectionHovering} />
        </motion.div>
      </div>
    </section>
  );
}
