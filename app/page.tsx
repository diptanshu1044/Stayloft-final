import FeaturedProperties from "@/components/Home/FeaturedProperties";
import HeroSection from "@/components/Home/HeroSection";
import HowItWorks from "@/components/Home/HowItWorks";
import PopularCities from "@/components/Home/PopularCities";
import PreFooterCTA from "@/components/Home/PreFooterCTA";
import WhyChooseStayloft from "@/components/Home/WhyChooseStayloft";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <PopularCities />
      <HowItWorks />
      <WhyChooseStayloft />
      <PreFooterCTA />
    </>
  );
}
