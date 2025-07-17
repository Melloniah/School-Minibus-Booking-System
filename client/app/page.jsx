import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import StatsCards from "../components/StatsCards";
import Mission from "../components/Mission";
import AboutSafeRide from "../components/AboutSafeRide";
import RouteMapSection from "../components/RouteMapSection";



export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <RouteMapSection />
      <AboutSafeRide />
      <Mission />
      <StatsCards />
      <Footer />
    </div>
  );
}
