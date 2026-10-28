import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Pipeline } from "@/components/Pipeline";
import { Comparison } from "@/components/Comparison";
import { SetupGuide } from "@/components/SetupGuide";
import { TerminalStudio } from "@/components/TerminalStudio";
import { Benchmarks } from "@/components/Benchmarks";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080A0F] text-[#F1F5F9] relative selection:bg-[#E5C07B]/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Pipeline />
        <Comparison />
        <SetupGuide />
        <TerminalStudio />
        <Benchmarks />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
