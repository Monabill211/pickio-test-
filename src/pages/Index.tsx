import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoriesSection from '@/components/home/categroyslideroffice';
import CategoriesSectionhome from '@/components/home/categroysliderhome';
import FeaturedProducts from '@/components/home/officeProducts';
import HeroPageSilder from '@/components/home/HeroPageSilder';
import ContactMe from '@/components/home/ContactMe';
import Customers from '@/components/home/Customers';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import Whywe from '@/components/home/Whywe';
import ReviewsSection from '@/components/home/Reviews ';
import SocialFAB from '@/components/layout/Socialfab';
import OffersBanner from '@/components/home/ofeerbanar';
import HomeEssentialsSection from '@/components/home/sactionhome';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
       
        <HeroPageSilder />
        <CategoriesSection />
        <CategoriesSectionhome />
        <OffersBanner />
        <FeaturedProducts />
     <Whywe />
        <FeaturedProducts />
        {/* <ContactMe /> */}
        <HomeEssentialsSection />
        <FeaturedProducts />
        <OffersBanner />
        <FeaturedProducts />
        <FeaturedProducts />

     <ReviewsSection /> 
        <Customers />
      </main>
      <SocialFAB/>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Index;
