import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Newsletter from '@/components/home/Newsletter';
import HeroPageSilder from '@/components/home/HeroPageSilder';
import ContactMe from '@/components/home/ContactMe';
import Customers from '@/components/home/Customers';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import Aboutinhome from '@/components/home/Aboutinhome';
import Whywe from '@/components/home/Whywe';
import ReviewsSection from '@/components/home/Reviews ';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
       
        <HeroPageSilder />
        <CategoriesSection />
        <Aboutinhome />
        <FeaturedProducts />
     <Whywe />
        <ContactMe />
     <ReviewsSection /> 
        <Customers />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Index;
