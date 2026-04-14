import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Truck, Clock, Globe, PackageCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const ShippingDelivery: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const shippingMethods = [
    {
      icon: Truck,
      name: t('shipping.standard') || 'Standard Shipping',
      duration: t('shipping.standardDays') || '5-7 business days',
      cost: t('shipping.standardCost') || 'FREE on orders over $50',
    },
    {
      icon: Clock,
      name: t('shipping.express') || 'Express Shipping',
      duration: t('shipping.expressDays') || '2-3 business days',
      cost: '$15.99',
    },
    {
      icon: PackageCheck,
      name: t('shipping.overnight') || 'Overnight Shipping',
      duration: t('shipping.overnightDays') || '1 business day',
      cost: '$29.99',
    },
    {
      icon: Globe,
      name: t('shipping.international') || 'International Shipping',
      duration: t('shipping.internationalDays') || '10-21 business days',
      cost: t('shipping.internationalCost') || 'Calculated at checkout',
    },
  ];

  const deliveryInfo = [
    {
      icon: CheckCircle2,
      title: t('shipping.tracking') || 'Tracking Your Order',
      description: t('shipping.trackingDesc') || 'Once your order ships, you will receive a tracking number via email. Use this number to monitor your package in real-time on the carrier website.'
    },
    {
      icon: CheckCircle2,
      title: t('shipping.address') || 'Delivery Address',
      description: t('shipping.addressDesc') || 'Please ensure your delivery address is correct at checkout. We cannot be responsible for packages delivered to incorrect addresses.'
    },
    {
      icon: CheckCircle2,
      title: t('shipping.signature') || 'Signature Required',
      description: t('shipping.signatureDesc') || 'For high-value items, signature may be required upon delivery. Our courier will attempt delivery multiple times if you are not available.'
    },
  ];

  const shippingBenefits = [
    {
      title: t('shipping.packaging') || 'Safe Packaging',
      description: t('shipping.packagingDesc') || 'All items are carefully packaged to ensure safe delivery. We use high-quality materials and secure packaging methods to protect your purchase during transit.'
    },
    {
      title: t('shipping.insurance') || 'Shipping Insurance',
      description: t('shipping.insuranceDesc') || 'Your package is covered by shipping insurance. In the unlikely event of damage or loss, we will work with the carrier to resolve the issue promptly.'
    },
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
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
            >
              {t('footer.shipping') || 'Shipping & Delivery'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {t('shipping.subtitle') || 'Fast, reliable shipping options for your peace of mind.'}
            </motion.p>
          </div>

          {/* Shipping Methods Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {shippingMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="rounded-2xl bg-card p-6 shadow-card hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 font-semibold text-foreground">{method.name}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('shipping.deliveryTime') || 'Delivery Time'}
                      </p>
                      <p className="font-medium text-foreground">{method.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('shipping.cost') || 'Cost'}
                      </p>
                      <p className="font-semibold text-primary">{method.cost}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Delivery Information Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 grid gap-6 md:grid-cols-3"
          >
            {deliveryInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-2xl bg-card p-6 shadow-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 font-semibold text-foreground">
                  {info.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Shipping Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-card p-8 shadow-card md:p-12 mb-12"
          >
            <h2 className="mb-8 text-2xl font-semibold text-foreground">
              {t('shipping.info') || 'Why Choose Us'}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {shippingBenefits.map((benefit, index) => (
                <div key={index}>
                  <h3 className="mb-4 font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Timeline/Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl bg-card p-8 shadow-card md:p-12 mb-12"
          >
            <h2 className="mb-8 text-2xl font-semibold text-foreground">
              {t('shipping.process') || 'How Your Order Ships'}
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: t('shipping.processStep1') || 'Order Placed',
                  description: t('shipping.processStep1Desc') || 'Your order is received and confirmed. You will receive a confirmation email with order details.'
                },
                {
                  step: '2',
                  title: t('shipping.processStep2') || 'Processing',
                  description: t('shipping.processStep2Desc') || 'We carefully pack your items and prepare them for shipment within 24-48 hours.'
                },
                {
                  step: '3',
                  title: t('shipping.processStep3') || 'Shipped',
                  description: t('shipping.processStep3Desc') || 'Your package is shipped and you receive a tracking number via email to monitor delivery.'
                },
                {
                  step: '4',
                  title: t('shipping.processStep4') || 'Delivered',
                  description: t('shipping.processStep4Desc') || 'Your order arrives at your doorstep. We ensure safe delivery and provide delivery confirmation.'
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

          {/* FAQ Link Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-primary/5 border border-primary/20 p-8 shadow-card md:p-12 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-foreground">
                  {t('shipping.moreQuestions') || 'More Questions?'}
                </h2>
                <p className="text-muted-foreground">
                  {t('shipping.checkFAQ') || 'Check our FAQ section for more detailed answers about shipping, returns, and policies.'}
                </p>
              </div>
              <a
                href="/faq"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t('footer.faq') || 'View FAQ'}
                <span>{isRTL ? '←' : '→'}</span>
              </a>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-3xl bg-card p-8 text-center shadow-card md:p-12"
          >
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              {t('shipping.questions') || 'Questions about shipping?'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t('shipping.contactSupport') || 'Contact our support team for any shipping inquiries or concerns.'}
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

export default ShippingDelivery;