import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Truck, Shield, Users, Star, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-living-room.jpg';

const About: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const values = [
    {
      icon: Award,
      title: isRTL ? 'جودة استثنائية' : 'Exceptional Quality',
      description: isRTL
        ? 'نستخدم أفضل الخامات والمواد لضمان متانة وجمال كل قطعة أثاث'
        : 'We use the finest materials to ensure durability and beauty of every piece',
    },
    {
      icon: Truck,
      title: isRTL ? 'توصيل سريع' : 'Fast Delivery',
      description: isRTL
        ? 'نوصل إلى جميع أنحاء مصر مع ضمان سلامة المنتجات'
        : 'We deliver across Egypt with guaranteed product safety',
    },
    {
      icon: Shield,
      title: isRTL ? 'ضمان شامل' : 'Full Warranty',
      description: isRTL
        ? 'جميع منتجاتنا مغطاة بضمان شامل لراحة بالك'
        : 'All our products are covered by a comprehensive warranty',
    },
    {
      icon: Users,
      title: isRTL ? 'دعم متميز' : 'Excellent Support',
      description: isRTL
        ? 'فريق خدمة العملاء لدينا متاح لمساعدتك في أي وقت'
        : 'Our customer service team is available to help you anytime',
    },
  ];

  const stats = [
    { value: '15+', label: isRTL ? 'سنة خبرة' : 'Years Experience' },
    { value: '10K+', label: isRTL ? 'عميل سعيد' : 'Happy Customers' },
    { value: '500+', label: isRTL ? 'تصميم فريد' : 'Unique Designs' },
    { value: '50+', label: isRTL ? 'حرفي ماهر' : 'Skilled Craftsmen' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="About us"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/70" />
          </div>
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-4xl font-bold text-background md:text-5xl lg:text-6xl">
                {t('footer.about')}
              </h1>
              <p className="mt-6 text-lg text-background/80 md:text-xl">
                {isRTL
                  ? 'نحن شركة مصرية رائدة في مجال الأثاث الفاخر، نجمع بين الحرفية التقليدية والتصميم العصري لنقدم لك قطعاً استثنائية تدوم مدى الحياة.'
                  : 'We are a leading Egyptian furniture company, combining traditional craftsmanship with modern design to bring you exceptional pieces that last a lifetime.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-foreground md:text-4xl"
              >
                {isRTL ? 'قصتنا' : 'Our Story'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-lg leading-relaxed text-muted-foreground"
              >
                {isRTL
                  ? 'بدأت رحلتنا منذ أكثر من 15 عاماً في قلب القاهرة، حيث جمعنا بين شغفنا بالتصميم وحبنا للحرفة اليدوية. اليوم، نفخر بخدمة آلاف العائلات المصرية وتحويل منازلهم إلى أماكن تعكس شخصياتهم وأذواقهم الفريدة. كل قطعة نصنعها هي نتاج ساعات من العمل الدقيق والاهتمام بأدق التفاصيل.'
                  : 'Our journey began over 15 years ago in the heart of Cairo, where we combined our passion for design with our love for handcraftsmanship. Today, we are proud to serve thousands of Egyptian families and transform their homes into places that reflect their unique personalities and tastes. Every piece we make is the result of hours of meticulous work and attention to the finest details.'}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl"
            >
              {isRTL ? 'قيمنا' : 'Our Values'}
            </motion.h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl bg-card p-6 text-center shadow-card"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Heart className="mx-auto mb-6 h-12 w-12 text-primary-foreground" />
              <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
                {isRTL ? 'مهمتنا' : 'Our Mission'}
              </h2>
              <p className="mt-6 text-lg text-primary-foreground/80">
                {isRTL
                  ? 'نسعى لجعل الأثاث الفاخر متاحاً لكل منزل مصري، مع الحفاظ على أعلى معايير الجودة والتصميم. نؤمن بأن كل منزل يستحق أن يكون جميلاً ومريحاً.'
                  : 'We strive to make luxury furniture accessible to every Egyptian home while maintaining the highest standards of quality and design. We believe every home deserves to be beautiful and comfortable.'}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
