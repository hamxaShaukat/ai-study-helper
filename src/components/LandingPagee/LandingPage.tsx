import { Hero } from "./Hero";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { CTA } from "./CTA";
import { Navbar } from "./Navbar";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}