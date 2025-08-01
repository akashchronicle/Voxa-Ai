"use client";
import HeroSection from "../components/HeroSection";
import { FeaturesShowcase } from "../components/FeaturesShowcase";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { DeveloperSection } from "../components/DeveloperSection";
import { Footer } from "../components/Footer";

export const HomeView = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesShowcase />
      <TestimonialsSection />
      <DeveloperSection />
      <Footer />
    </div>
  );
};
