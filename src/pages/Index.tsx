import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import ServiceOptions from "@/components/ServiceOptions";
import AudienceTypes from "@/components/AudienceTypes";
import KeyMetrics from "@/components/KeyMetrics";
import SocialProof from "@/components/SocialProof";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ValueProposition />
        <ServiceOptions />
        <AudienceTypes />
        <KeyMetrics />
        <SocialProof />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
