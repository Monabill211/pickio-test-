import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const ReturnsPolicy: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const returnSteps = [
    {
      icon: Clock,
      title: t('returns.window') || '30-Day Return Window',
      description: t('returns.windowDesc') || 'Return items within 30 days of purchase for a full refund or exchange.',
    },
    {
      icon: AlertCircle,
      title: t('returns.condition') || 'Condition Requirements',
      description: t('returns.conditionDesc') || 'Items must be unused, unworn, and in original packaging with all tags attached.',
    },
    {
      icon: RotateCcw,
      title: t('returns.process') || 'Return Process',
      description: t('returns.processDesc') || 'Contact us to receive a prepaid return label. Ship the item back at no cost.',
    },
    {
      icon: CheckCircle,
      title: t('returns.refund') || 'Refund Processing',
      description: t('returns.refundDesc') || 'Once received and inspected, refunds are processed within 5-7 business days.',
    },
  ];

  const canReturn = [
    t('returns.item1') || 'Clothing and accessories (unworn with tags)',
    t('returns.item2') || 'Electronics (unopened original packaging)',
    t('returns.item3') || 'Home goods (unused condition)',
    t('returns.item4') || 'Items purchased within 30 days',
  ];

  const cannotReturn = [
    t('returns.exclude1') || 'Items purchased more than 30 days ago',
    t('returns.exclude2') || 'Worn, damaged, or altered items',
    t('returns.exclude3') || 'Items without original tags or packaging',
    t('returns.exclude4') || 'Clearance or final sale items',
    t('returns.exclude5') || 'Custom or personalized orders',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <RotateCcw className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
            >
              {t('footer.returns') || 'Returns Policy'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {t('returns.subtitle') || 'We want you to be completely satisfied with your purchase. Here is how our return process works.'}
            </motion.p>
          </div>

          {/* Return Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {returnSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="rounded-2xl bg-card p-6 shadow-card hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Can and Cannot Return Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 grid gap-6 md:grid-cols-2"
          >
            {/* Can Return */}
            <div className="rounded-3xl bg-card p-8 shadow-card">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('returns.canReturn') || 'Can Be Returned'}
                </h2>
              </div>
              <ul className="space-y-3">
                {canReturn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cannot Return */}
            <div className="rounded-3xl bg-card p-8 shadow-card">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('returns.cannotReturn') || 'Cannot Be Returned'}
                </h2>
              </div>
              <ul className="space-y-3">
                {cannotReturn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Policy Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-card p-8 shadow-card md:p-12 mb-12"
          >
            <h2 className="mb-8 text-2xl font-semibold text-foreground">
              {t('returns.details') || 'Return Policy Details'}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-semibold text-foreground">
                  {t('returns.refundMethods') || 'Refund Methods'}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t('returns.refundMethodsDesc') || 'Refunds are issued to the original payment method. Credit card refunds may take an additional 1-2 billing cycles to appear on your account.'}
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-foreground">
                  {t('returns.exchanges') || 'Exchanges'}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t('returns.exchangesDesc') || 'Need a different size or color? We offer free exchanges within 30 days. Simply contact us with your order details.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Return Steps Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-3xl bg-card p-8 shadow-card md:p-12 mb-12"
          >
            <h2 className="mb-8 text-2xl font-semibold text-foreground">
              {t('returns.process') || 'How to Return Your Item'}
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: t('returns.step1Title') || 'Contact Us',
                  description: t('returns.step1Desc') || 'Reach out to our support team with your order number and reason for return.'
                },
                {
                  step: '2',
                  title: t('returns.step2Title') || 'Get Return Label',
                  description: t('returns.step2Desc') || 'We will provide you with a prepaid return shipping label via email.'
                },
                {
                  step: '3',
                  title: t('returns.step3Title') || 'Ship Your Item',
                  description: t('returns.step3Desc') || 'Pack your item securely and ship it using the provided label at no cost.'
                },
                {
                  step: '4',
                  title: t('returns.step4Title') || 'Receive Your Refund',
                  description: t('returns.step4Desc') || 'Once received and inspected, we will process your refund within 5-7 business days.'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 pb-6 border-b border-muted last:pb-0 last:border-0">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl bg-card p-8 text-center shadow-card md:p-12"
          >
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              {t('returns.needReturn') || 'Ready to start your return?'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t('returns.contactSupport') || 'Contact our support team to initiate your return process.'}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('footer.contactUs') || 'Contact Us'}
              <span>{isRTL ? '←' : '→'}</span>
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsPolicy;