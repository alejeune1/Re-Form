import { motion } from 'framer-motion';
import { products } from '../data/products';

export default function CollectionPreview() {
  return (
    <section id="collection" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Collection preview</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">
              Des pièces lisibles, jamais standardisées.
            </h2>
          </motion.div>
          <a
            href="#"
            className="inline-flex w-fit items-center rounded-full border border-textile/16 bg-cream/60 px-5 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:border-sage/50 hover:bg-sage/15"
          >
            Voir tout
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -9 }}
              className="group overflow-hidden rounded-[2rem] border border-textile/10 bg-cream/62 p-3 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur transition-all duration-300 hover:border-sage/40 hover:shadow-[0_30px_90px_rgba(90,70,50,0.16)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-bone/50">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  loading={index > 1 ? 'lazy' : 'eager'}
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(90,70,50,0.28),transparent_48%)] opacity-70" />
                {product.unique ? (
                  <span className="absolute left-4 top-4 rounded-full bg-cream/82 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-textile backdrop-blur">
                    Pièce unique
                  </span>
                ) : null}
              </div>

              <div className="px-2 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">{product.material}</p>
                <h3 className="mt-3 text-xl font-bold tracking-[-0.04em] text-ink">{product.title}</h3>
                <p className="mt-3 text-sm leading-6 text-textile/72">{product.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
