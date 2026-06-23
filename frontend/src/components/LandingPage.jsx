import LandingNavbar from "./LandingNavbar";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#070710] text-slate-100 antialiased">
      <LandingNavbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}