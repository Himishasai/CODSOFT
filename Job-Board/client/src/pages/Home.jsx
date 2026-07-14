import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustedCompanies from "../components/TrustedCompanies";
import Stats from "../components/Stats";
import JobCategories from "../components/JobCategories";
import FeaturedJobs from "../components/FeaturedJobs";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      <main>

        {/* Hero */}
        <Hero />

        {/* Trusted Companies */}
        <TrustedCompanies />

        {/* Statistics */}
        <Stats />

        {/* Job Categories */}
        <JobCategories />

        {/* Featured Jobs */}
        <FeaturedJobs />

        {/* Why Choose HireHub */}
        <WhyChoose />

        {/* Testimonials */}
        <Testimonials />

      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;