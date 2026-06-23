import { Link } from "react-router-dom";

const socials = [
  { label: "X", href: "#", icon: "𝕏" },
  { label: "GitHub", href: "#", icon: "⌥" },
  { label: "LinkedIn", href: "#", icon: "in" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <img 
              src="/logo.svg" /* Make sure your path is correct here */
              alt="Jawab AI Logo" 
              className="h-8 w-auto rounded-md object-contain" 
          />
          <span className="font-semibold">
            Jawab<span className="text-neon-cyan"> AI</span>
          </span>
        </div>

        <div className="flex gap-6 text-sm text-slate-400">
          <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link to="/terms" className="transition hover:text-white">Terms</Link>
        </div>

        <div className="flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="grid h-9 w-9 place-items-center rounded-full glass text-sm transition hover:bg-white/10 hover:text-neon-cyan"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Jawab AI. All rights reserved.
      </p>
    </footer>
  );
}
