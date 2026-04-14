import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-living-room.jpg';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury furniture living room"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative flex min-h-[85vh] items-center">
        <div className="max-w-2xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              {t('hero.title')}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="gap-2 px-8" onClick={() => navigate('/shop')}>
                {t('hero.cta')}
                <ArrowIcon className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="px-8" onClick={() => navigate('/contact')}>
                {t('hero.secondaryCta')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { label: t('common.freeDelivery'), icon: '🚚' },
              { label: t('common.qualityGuarantee'), icon: '✨' },
              { label: t('common.customerSupport'), icon: '💬' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-default"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: index * 0.5 }}
                  className="text-lg"
                >
                  {feature.icon}
                </motion.span>
                <span>{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
