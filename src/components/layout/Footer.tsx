import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { FaTiktok } from "react-icons/fa";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const quickLinks = [
    { href: '/', label: t('common.home') },
    { href: '/shop', label: t('common.shop') },
    { href: '/categories', label: t('common.categories') },
    { href: '/about', label: t('footer.about') },
  ];

  const customerService = [
    { href: '/contact', label: t('footer.contactUs') },
    { href: '/faq', label: t('footer.faq') },
    { href: '/shipping', label: t('footer.shipping') },
    { href: '/returns', label: t('footer.returns') },
  ];



  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
             <span className="text-xl font-bold text-white md:text-2xl font-bold">
           Pic<span className='text-red-600 '>k</span>io
          </span>
            <p className="text-sm text-background/70 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex gap-4">
              <a href='https://www.facebook.com/pickioOffice/' target='_blank' rel='noopener noreferrer' className='transition-all duration-300 ease-in-out hover:-translate-y-1'>
                <FacebookIcon className=' hover:text-red-500' />
              </a>
              <a href='https://www.instagram.com/pickio_office/' target='_blank' rel='noopener noreferrer' className='transition-all duration-300 ease-in-out hover:-translate-y-1'>
                <InstagramIcon className=' hover:text-red-500' />
              </a>
              <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer' className='transition-all duration-300 ease-in-out hover:-translate-y-1'>
                <LinkedInIcon className=' hover:text-red-500' />
              </a>
              <a href='https://www.tiktok.com' target='_blank' rel='noopener noreferrer' className='transition-all duration-300 ease-in-out hover:-translate-y-1'>
                <FaTiktok className=' hover:text-red-500 cursor-pointer ' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.quickLinks')}</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-background/70  hover:text-red-500 transition-all duration-300 ease-in-out hover:-translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.customerService')}</h3>
            <nav className="flex flex-col gap-2">
              {customerService.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-background/70  hover:text-red-500 transition-all duration-300 ease-in-out hover:-translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.contactUs')}</h3>
            <div className="space-y-3">
               <a href="https://www.google.com/maps/place/pickio+furniture/@30.0806352,31.3366236,17z/data=!3m1!4b1!4m6!3m5!1s0x14583f71e6c55aa7:0xa9074f9f3f7f557f!8m2!3d30.0806306!4d31.3414945!16s%2Fg%2F11stcsl3vv?hl=en&entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D" >
              <div className="flex items-center gap-3 text-sm text-background/70 cursor-pointer hover:text-red-500 transition-all duration-300 ease-in-out hover:-translate-x-1">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </div> 
              </a>
               <a href="tel:+1234567890" >
              <div  style={{marginTop:"15px"}}  className="flex items-center gap-3 text-sm text-background/70 cursor-pointer hover:text-red-500 transition-all duration-300 ease-in-out hover:-translate-x-1">
            
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span dir="ltr">{t('footer.phone')}</span>
                
              </div></a>

               <a href="mailto:pickiofurniture@gmail.com"  >
              <div  style={{marginTop:"15px"}}  className="flex items-center gap-3 text-sm text-background/70 cursor-pointer hover:text-red-500 transition-all duration-300 ease-in-out hover:-translate-x-1">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>{t('footer.email')}</span>
              </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-background/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} {isRTL ? 'بيكيو' : 'Pickio'}. {t('footer.rights')}
            </p>
            <div className="flex gap-6 text-sm text-background/60">
              <Link to="/privacy" className="hover:text-background">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="hover:text-background">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
