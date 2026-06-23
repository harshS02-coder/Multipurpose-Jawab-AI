import { motion } from "framer-motion";

const features = [
  {
    title: "Domain-Specific Summarization",
    desc: "Tailored insights for your exact field — legal, medical, academic, or finance.",
    icon: "🎯",
    span: "lg:col-span-2",
  },
  {
    title: "Study Mode",
    desc: "Flashcards, quizzes, and deep-dive explanations to learn faster.",
    icon: "📚",
    span: "",
  },
  {
    title: "Invoice Processing",
    desc: "Instantly extract key financial data from receipts and invoices.",
    icon: "🧾",
    span: "",
  },
  {
    title: "Conversation History",
    desc: "Never lose a thought; pick up right where you left off.",
    icon: "💬",
    span: "",
  },
  {
    title: "Lightning Fast Uploads",
    desc: "Process massive PDFs in seconds with zero waiting.",
    icon: "⚡",
    span: "lg:col-span-1",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">
              master your documents
            </span>
          </h2>
          <p className="mt-4 text-slate-400">
            Powerful AI features, designed to fit naturally into your workflow.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.12 }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-3xl glass p-7 transition ${f.span}`}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-violet/20 blur-2xl transition group-hover:bg-neon-cyan/25" />
              <div className="relative">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
