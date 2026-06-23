import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div
          className={`flex w-full items-center justify-between rounded-2xl px-5 py-3 transition-all ${
            scrolled ? "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/30" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.svg" /* Make sure your path is correct here */
              alt="Jawab AI Logo" 
              className="h-8 w-auto rounded-md object-contain" 
            />
            <span className="text-lg font-semibold tracking-tight text-white">
              Jawab<span className="text-neon-cyan"> AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-slate-300 transition hover:text-white">
                {l.label}
              </a>
            ))}
            <Link
              to="/upload"
              className="rounded-xl bg-gradient-to-r from-neon-violet to-neon-cyan px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition hover:shadow-neon-cyan/40"
            >
              Upload & Chat
            </Link>
          </div>

          <button onClick={() => setOpen((o) => !o)} className="md:hidden" aria-label="Toggle menu">
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mx-4 mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:hidden">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-slate-300">
              {l.label}
            </a>
          ))}
          <Link to="/upload" className="mt-2 block rounded-xl bg-gradient-to-r from-neon-violet to-neon-cyan px-5 py-2 text-center font-semibold text-white">
            Upload & Chat
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}