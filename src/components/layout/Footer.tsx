import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: linkedin, href: '#', label: 'linkedin' },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {isRTL ? 'بيكيو' : 'Pickio'}
            </h3>
            <p className="text-sm text-background/70 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
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
                  className="text-sm text-background/70 transition-colors hover:text-background"
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
                  className="text-sm text-background/70 transition-colors hover:text-background"
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
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span dir="ltr">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>{t('footer.email')}</span>
              </div>
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
