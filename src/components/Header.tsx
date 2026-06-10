import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Concept', to: '/#concept', type: 'anchor' },
  { label: 'Tutoriels', to: '/tutoriels', type: 'route' },
  { label: 'Défis', to: '/defis', type: 'route' },
  { label: 'Communauté', to: '/#community', type: 'anchor' },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-warm-gray/30 bg-cream/72 px-4 py-3 shadow-[0_18px_70px_rgba(90,70,50,0.12)] backdrop-blur-xl sm:px-5">
        <Link to="/" className="text-lg font-black tracking-[-0.04em] text-ink">
          RE<span className="text-sage">:</span>FORM
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-textile/75 md:flex">
          {navItems.map((item) =>
            item.type === 'route' ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors duration-300 hover:text-ink ${isActive ? 'text-ink' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <Link
          to="/#upload"
          className="rounded-full border border-textile/20 bg-ink px-4 py-2 text-sm font-semibold text-cream transition-all duration-300 hover:border-sage hover:bg-sage hover:text-ink"
        >
          Commencer
        </Link>
      </div>
    </motion.header>
  );
}
