import { CTASection } from "./components/cta-section";
import { Footer } from "./components/footer";
import { HeroSection } from "./components/hero-section";
import { Navbar } from "./components/navbar";
import { SplitConversationDemo } from "./components/split-conversation-demo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <SplitConversationDemo />
      <CTASection />
      <Footer />
    </div>
  );
}
