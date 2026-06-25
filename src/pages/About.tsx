import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Truck, Shield, Users, Star, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';

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
    { value: '10+', label: isRTL ? 'سنة خبرة' : 'Years Experience' },
    { value: '5K+', label: isRTL ? 'عميل سعيد' : 'Happy Customers' },
    { value: '2k+', label: isRTL ? 'تصميم فريد' : 'Unique Designs' },
    { value: '20+', label: isRTL ? 'حرفي ماهر' : 'Skilled Craftsmen' },
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
                  ? 
                 'هي شركة مصرية متخصصة في تصنيع وتوريد األثاث المكتبي الراقي، تجمع بين خبرة التصنيع وجودة الخام  Pickio Furnitureات والتصميم العصري لتقديم حلول متكاملة تلبي احتياجات الشركات والمساحات اإلدارية الحديثة. نفخر بامتالكنا مصنعًا مجهز ًا بأحدث التقنيات ومعارض متعددة، مما يتيح لنا تقديم تجربة متكاملة تبدأ من التصميم واإلنتاج وحتى التسليم والتركيب، مع االلتزام بأعلى معايير ال جودة والدقة في التنفيذ. نؤمن بأن لكل عميل رؤية مختلفة، لذلك نوفر خدمة التصميم والتصنيع حسب الطلب (  Customization)، حيث يمكن تنفيذ وتعديل المقاسات، والخامات، واأللوان، وتخصيص أي موديل بما يتناسب مع هوية الشركة واحتياجاتها العملية. على مدار سنوات من الخبرة، ن جحنا في بناء ثقة عمالئنا من خالل تقديم منتجات تجمع بين الفخامة، والعملية، والمتانة، لنصنع مساحات عمل تعكس االحترافية وتدوم لسنوات.  …نصنع بيئات عمل استثنائية تجمع بين الجودة، واالبتكار، والتفاصيل التي تصنع  Pickio Furniture'
                  : 'Our journey began with a simple belief: that a comfortable work environment makes a real difference in productivity and creativity. That is why we are committed to providing office furniture that combines high quality, modern design, and practical comfort to meet the needs of todays companies and organizations.Throughout our journey, we have worked to deliver comprehensive office solutions for businesses of all sizes, from ergonomic office chairs and executive desks to meeting tables and reception counters that create the first impression your clients deserve.We believe that every office tells a success story. For this reason, we focus on offering products that combine elegance, durability, and attention to detail, adding real value to every workspace. Our goal is not only to sell furniture but also to help create work environments that are more comfortable, professional, and inspiring.Today, we take pride in the trust our customers place in us as their partner in furnishing and equipping their offices. We continue to develop our products and services to remain the first choice for anyone seeking office furniture that combines quality, design, and value.'}
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
                  className="rounded-2xl bg-card p-6 text-center shadow-card cursor-pointer hover:shadow-lg shadow-red-500 transition-all duration-300 ease-in-out hover:-translate-y-3"
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
                  ?  'في Furniture Pickio تتمثل مهمتنا في تقديم حلول أثاث مكتبي مبتكرة تجمع بين الجودة العالية، والتصميم العصري، والوظائف العملية، لنساعد الشركات على إنشاء بيئات عمل تعزز اإلنتاجية وتعكس هويتها االحترافية.ومن خالل قدراتنا التصنيعية وخدمات التخصيص حسب الطلب، نسعى إلى تحويل أفكار عمالئنا إلى واقع، مع االلتزام بأعلى معايير الجودة، واالهتمام بأدق التفاصيل، وتقديم تجربة متكاملة تبدأ من التصميم وتنتهي بالتسليم والتركيب.'
: 'We aim to redefine workspaces by providing innovative office furniture that combines luxury, functionality, and modern design. We strive to deliver comprehensive solutions for companies and offices, helping create comfortable and inspiring work environments while maintaining the highest standards of quality, craftsmanship, and finishing. We believe that a professional workspace is the foundation of success, creativity, and sustainable growth.'}
              </p>
            </div>
          </div>
        </section>
      </main>
      <FloatingWhatsApp />  
      
      <Footer />
    </div>
  );
};

export default About;
