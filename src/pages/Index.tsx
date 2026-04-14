import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Newsletter from '@/components/home/Newsletter';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        {/* <Newsletter /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
