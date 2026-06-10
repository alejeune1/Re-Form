import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

type AnimatedHeroImageProps = {
  intensify?: boolean;
};

const sewingElements = [
  {
    src: '/images/carreTissus.png',
    className: 'left-[4%] top-[12%] w-24 sm:w-28 lg:w-36',
    rotate: -13,
    delay: 0,
    duration: 7.2,
  },
  {
    src: '/images/aiguille.png',
    className: 'right-[6%] top-[11%] w-20 sm:w-24 lg:w-28',
    rotate: 29,
    delay: 0.25,
    duration: 6.8,
  },
  {
    src: '/images/machine.png',
    className: 'bottom-[7%] left-[6%] hidden w-28 md:block lg:w-40',
    rotate: -5,
    delay: 0.55,
    duration: 8.4,
  },
];

function FloatingSewingElement({
  src,
  className,
  rotate,
  delay,
  duration,
  intensify,
}: {
  src: string;
  className: string;
  rotate: number;
  delay: number;
  duration: number;
  intensify: boolean;
}) {
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute hidden select-none object-contain opacity-75 drop-shadow-[0_16px_26px_rgba(90,70,50,0.18)] sm:block ${className}`}
      initial={{ opacity: 0, y: 16, scale: 0.88, rotate }}
      animate={{
        opacity: intensify ? 0.9 : 0.76,
        y: intensify ? [-8, 10, -8] : [-5, 6, -5],
        rotate: intensify ? [rotate - 2, rotate + 2, rotate - 2] : [rotate - 1, rotate + 1, rotate - 1],
        scale: intensify ? 1.03 : 1,
      }}
      transition={{
        opacity: { duration: 0.55, delay },
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: duration + 0.8, repeat: Infinity, ease: 'easeInOut', delay },
        scale: { duration: 0.35 },
      }}
    />
  );
}

export default function AnimatedHeroImage({ intensify = false }: AnimatedHeroImageProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.4 });
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [1.8, -1.8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-2.4, 2.4]);

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[3rem]"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="absolute inset-0 rounded-[3rem] border border-textile/10 bg-[linear-gradient(145deg,rgba(246,240,230,0.78),rgba(232,220,200,0.5),rgba(255,255,255,0.3))] shadow-[0_28px_110px_rgba(90,70,50,0.18)] backdrop-blur-sm" />
      <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,240,230,0.92),rgba(232,220,200,0.28),transparent_68%)] blur-2xl" />

      {sewingElements.map((element) => (
        <FloatingSewingElement key={element.src} {...element} intensify={intensify} />
      ))}

      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-8 py-10 sm:px-10 lg:px-12"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: intensify ? 1.02 : 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ x: translateX, y: translateY, rotateX, rotateY, transformPerspective: 900 }}
      >
        <motion.div
          className="relative w-full max-w-[520px]"
          animate={{
            y: intensify ? [-10, 10, -10] : [-7, 7, -7],
            rotate: intensify ? [-1.4, 1.4, -1.4] : [-0.9, 0.9, -0.9],
          }}
          transition={{ duration: intensify ? 4.8 : 6.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {hasImageError ? (
            <div className="flex aspect-square items-center justify-center rounded-[2rem] border border-dashed border-textile/25 bg-cream/65 p-8 text-center text-sm font-semibold text-textile/70 shadow-[0_20px_60px_rgba(90,70,50,0.12)]">
              Image hero à ajouter dans `public/images/hero-upcycled-jacket.png`
            </div>
          ) : (
            <img
              src="/images/hero-upcycled-jacket.png"
              alt="Veste en jean upcyclée RE:FORM"
              className="mx-auto max-h-[500px] w-full object-contain drop-shadow-[0_32px_40px_rgba(90,70,50,0.22)]"
              onError={() => setHasImageError(true)}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
