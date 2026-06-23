import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Scene3D from "./Scene3D";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:pt-40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Text */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-neon-cyan"
          >
            ✨ AI-powered document intelligence
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Stop reading PDFs.{" "}
            <span className="bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink bg-clip-text text-transparent">
              Start chatting
            </span>{" "}
            with them.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg text-slate-300"
          >
            Jawab AI turns any document into a conversation. Ask questions,
            extract data, generate summaries, and study smarter — all in seconds.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/upload"
              className="rounded-xl bg-gradient-to-r from-neon-violet to-neon-cyan px-7 py-3 font-semibold shadow-lg shadow-neon-violet/30 transition hover:scale-[1.03] hover:shadow-neon-cyan/40"
            >
              Get Started — Free
            </Link>
            <a
              href="#features"
              className="rounded-xl glass px-7 py-3 font-semibold transition hover:bg-white/10"
            >
              Explore Features
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex gap-8 text-sm text-slate-400">
            <div><span className="text-xl font-bold text-white">10s</span><br />avg. processing</div>
            <div><span className="text-xl font-bold text-white">500+</span><br />pages supported</div>
            <div><span className="text-xl font-bold text-white">99.9%</span><br />uptime</div>
          </motion.div>
        </motion.div>

        {/* 3D Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[360px] sm:h-[460px] lg:h-[560px]"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-neon-violet/20 blur-3xl" />
          <Scene3D />
        </motion.div>
      </div>
    </section>
  );
}
