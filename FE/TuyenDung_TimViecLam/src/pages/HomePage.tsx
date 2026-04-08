import Header from '../layouts/Header';
import HeroSection from '../components/home/HeroSection';

import JobCategories from '../components/home/JobCategories';
import FeaturedJobs from '../components/home/FeaturedJobs';
import TopEmployers from '../components/home/TopEmployers';
import Footer from '../layouts/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <HeroSection />
        <JobCategories />
        <FeaturedJobs />
        <TopEmployers />
        {/* Additional sections can be added here */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
