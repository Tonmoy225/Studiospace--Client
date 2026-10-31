import { HeroSlider, Categories, HowBookingWorks, HostGuarantee } from "@/components/HomeSections";
import FeaturedStudios from "@/components/FeaturedStudios";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <Categories />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}
