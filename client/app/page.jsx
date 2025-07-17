import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import { StatsCards } from "../components/StartsCards";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsCards />
      <Footer />
    </div>
  );
}
