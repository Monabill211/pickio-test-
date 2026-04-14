import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: t('faq.q1') || 'What is your return policy?',
      answer: t('faq.a1') || 'We offer a 30-day return policy on all items. Products must be unused and in original packaging. Simply contact our support team to initiate a return, and we will provide you with a prepaid shipping label.'
    },
    {
      id: '2',
      question: t('faq.q2') || 'Do you offer international shipping?',
      answer: t('faq.a2') || 'Yes, we ship to most countries worldwide. International shipping times and costs vary based on location. You will see the exact shipping cost at checkout before finalizing your order.'
    },
    {
      id: '3',
      question: t('faq.q3') || 'How can I track my order?',
      answer: t('faq.a3') || 'Once your order ships, you will receive a tracking number via email. You can use this number to monitor your package in real-time on the carrier website.'
    },
    {
      id: '4',
      question: t('faq.q4') || 'What payment methods do you accept?',
      answer: t('faq.a4') || 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and other digital payment methods for your convenience and security.'
    },
    {
      id: '5',
      question: t('faq.q5') || 'How long does shipping take?',
      answer: t('faq.a5') || 'Standard shipping typically takes 5-7 business days. Express options are available at checkout for 2-3 business days, or overnight delivery for 1 business day.'
    },
    {
      id: '6',
      question: t('faq.q6') || 'Can I modify or cancel my order?',
      answer: t('faq.a6') || 'Orders can be modified or cancelled within 24 hours of purchase. Please contact our support team immediately with your order number to request changes.'
    }
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
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
            >
              {t('footer.faq') || 'Frequently Asked Questions'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {t('faq.subtitle') || 'Find answers to common questions about our products, shipping, and policies.'}
            </motion.p>
          </div>

          {/* FAQ Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl space-y-4"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="rounded-2xl bg-card shadow-card overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  className={cn(
                    'w-full px-6 py-4 md:px-8 md:py-6 flex items-center justify-between transition-all hover:bg-card/80',
                    expandedId === item.id && 'bg-primary/5'
                  )}
                >
                  <h3 className="text-left font-semibold text-foreground text-lg">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-primary transition-transform flex-shrink-0',
                      expandedId === item.id && 'rotate-180'
                    )}
                  />
                </button>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-muted px-6 py-4 md:px-8 md:py-6"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 rounded-3xl bg-card p-8 text-center shadow-card md:p-12"
          >
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              {t('faq.notFound') || "Didn't find your answer?"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t('faq.contactSupport') || 'Our support team is here to help. Contact us for any additional questions.'}
            </p>
            <a
              href="/contact"
              className="inline-block rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('footer.contactUs') || 'Contact Us'}
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;