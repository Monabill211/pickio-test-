import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 md:px-12 md:py-16"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-background" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-background" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20"
            >
              <Mail className="h-8 w-8 text-primary-foreground" />
            </motion.div>

            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              {t('newsletter.title')}
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              {t('newsletter.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className={cn(
                      "h-12 border-0 bg-primary-foreground text-foreground placeholder:text-muted-foreground",
                      isRTL ? "pr-12" : "pl-12"
                    )}
                    required
                  />
                  <Mail
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground",
                      isRTL ? "right-4" : "left-4"
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {t('newsletter.success')}
                    </span>
                  ) : (
                    t('newsletter.button')
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
