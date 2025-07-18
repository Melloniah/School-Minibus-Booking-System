import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import StatsCards from "../components/StatsCards";
import Mission from "../components/Mission";
import AboutSafeRide from "../components/AboutSafeRide";
import RouteMapSection from "../components/RouteMapSection";
import Testimonials from "../components/Testimonials";
import OurSpecialty from '../components/OurSpecialty';



export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <RouteMapSection />
      <Testimonials/>
      <AboutSafeRide />
      <Mission />
      <StatsCards />
      <OurSpecialty/>
      <Footer />
    </div>
  );
}
