import { syncUser } from "@/actions/user.action";
import FeaturedProperties from "@/components/Home/FeaturedProperties";
import HeroSection from "@/components/Home/HeroSection";
import HowItWorks from "@/components/Home/HowItWorks";
import PopularCities from "@/components/Home/PopularCities";
import PreFooterCTA from "@/components/Home/PreFooterCTA";
import WhyChooseStayloft from "@/components/Home/WhyChooseStayloft";
import UserTypeModal from "@/components/UserTypeModal";

export default async function Home() {
  await syncUser();
  return (
    <>
      <UserTypeModal />
      <HeroSection />
      <FeaturedProperties />
      <PopularCities />
      <HowItWorks />
      <WhyChooseStayloft />
      <PreFooterCTA />
    </>
  );
}
