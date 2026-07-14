import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoriesSection from '@/components/home/categroyslideroffice';
import CategoriesSectionhome from '@/components/home/categroysliderhome';
import OfficeProducts from '@/components/home/officeProducts';
import MeetingProducts from '@/components/home/meetingProducts';
import DadroomProducts from '@/components/home/badroomProducts';
import FeaturedProducts from '@/components/home/deckorProducts';
import DinerProducts from '@/components/home/deinerroomProducts';
import ContactMe from '@/components/home/ContactMe';
import Customers from '@/components/home/Customers';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import Whywe from '@/components/home/Whywe';
import ReviewsSection from '@/components/home/Reviews ';
import SocialFAB from '@/components/layout/Socialfab';
import OffersBannerhome from '@/components/home/ofeerbanarhome';
import OffersBanneroffice from '@/components/home/ofeerbanaroffice';
import HomeEssentialsSection from '@/components/home/sactionhome';
import PromoPopup from '@/components/home/Popup';
import HeroPageSilder from '@/components/home/HeroPageSilder';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col"
    style={{overflow:"hidden"}}>
            <PromoPopup />
    
      <Header />
      <main className="flex-1">
       
        <HeroPageSilder />
        <CategoriesSection />
        <CategoriesSectionhome />
        <OffersBanneroffice />
        <OfficeProducts />
        <MeetingProducts />
        <HomeEssentialsSection />
        <DadroomProducts />
        <OffersBannerhome />
        <DinerProducts />
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
