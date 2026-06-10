const socialLinks = ['Instagram', 'TikTok', 'Lookbook'];

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-textile/10 bg-cream/64 p-6 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <a href="#" className="text-2xl font-black tracking-[-0.05em] text-ink">
            RE<span className="text-sage">:</span>FORM
          </a>
          <p className="mt-3 max-w-md leading-7 text-textile/72">
            Vêtements upcyclés, silhouettes reconstruites et matières revalorisées pour une garde-robe plus rare.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-full border border-textile/12 px-4 py-2 text-sm text-textile/78 transition-all duration-300 hover:border-sage/50 hover:bg-sage/10 hover:text-ink"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
