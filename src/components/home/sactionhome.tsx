import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import imgdinerroom from '@/assets/modern-dining-room-in-black-and-white-dining-room-set-vitrine-furniture-8096136.webp';
import imgliveingroom from '@/assets/l-shaped-sectional-modern-comfort-style-l-shape-sofa-set-vitrine-furniture-5724595.webp';
import imgbadroom from '@/assets/full_bed_room.webp';
import imghome from '@/assets/tv-unit-sleek-design-with-space-saving-shelves-furniture-vitrine-furniture-520299.webp';
import { useLanguage } from '@/contexts/LanguageContext';

interface EssentialCategory {
  id: string;
  matchNames: string[]; // كل الكلمات (عربي وإنجليزي) اللي ممكن تطابق اسم الكاتجوري في فايرستور
  words: { ar: string[]; en: string[] }; // نص الكارد بكل لغة
  image: string;
}

const essentialCategories: EssentialCategory[] = [
  {
    id: 'bedroom',
    matchNames: ['نوم', 'bedroom'],
    words: {
      ar: ['أساسيات', 'غرفة', 'النوم'],
      en: ['Bedroom', 'Essentials'],
    },
    image: imgbadroom,
  },
  {
    id: 'living',
    matchNames: ['معيشة', 'living'],
    words: {
      ar: ['أساسيات', 'غرفة', 'المعيشه'],
      en: ['Living Room', 'Essentials'],
    },
    image: imgliveingroom,
  },
  {
    id: 'dining',
    matchNames: ['سفرة', 'dining'],
    words: {
      ar: ['أساسيات', 'غرفة', 'السفرة'],
      en: ['Dining Room', 'Essentials'],
    },
    image: imgdinerroom,
  },
  {
    id: 'office',
    matchNames: ['عمل', 'مكاتب', 'office'],
    words: {
      ar: ['أساسيات', 'المنزل'],
      en: ['Home', 'Essentials'],
    },
    image: imghome,
  },
];

interface FirestoreCategory {
  id: string;
  name: string | { ar?: string; en?: string };
}

// بيرجع الاسم بالعربي والإنجليزي مع بعض عشان نقدر نطابق أي لغة
const getCategoryAllNames = (name: FirestoreCategory['name']): string[] => {
  if (!name) return [];
  if (typeof name === 'string') return [name];
  return [name.ar, name.en].filter(Boolean) as string[];
};

const HomeEssentialsSection: React.FC = () => {
  const navigate = useNavigate();
  const { isRTL, language } = useLanguage();
  const [categoryIdMap, setCategoryIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAndMatchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const firestoreCategories: FirestoreCategory[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        const map: Record<string, string> = {};

        essentialCategories.forEach((essential) => {
          const found = firestoreCategories.find((fc) => {
            const allNames = getCategoryAllNames(fc.name);
            return essential.matchNames.some((matchWord) =>
              allNames.some((name) => name.toLowerCase().includes(matchWord.toLowerCase()))
            );
          });
          if (found) {
            map[essential.id] = found.id;
          }
        });

        setCategoryIdMap(map);
      } catch (error) {
        console.error('خطأ في جلب الكاتجوريز لمطابقة الأساسيات:', error);
      }
    };

    fetchAndMatchCategories();
  }, []);

  const handleClick = (essentialId: string) => {
    const realCategoryId = categoryIdMap[essentialId];
    if (realCategoryId) {
      navigate(`/shop?category=${realCategoryId}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <section style={{ paddingBlock: 'clamp(40px, 6vw, 64px)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-extrabold"
          style={{
            color: '#1c2b45',
            fontSize: 'clamp(28px, 4vw, 44px)',
            marginBottom: 'clamp(24px, 4vw, 40px)',
            letterSpacing: '0.5px',
          }}
        >
          {isRTL ? 'تسوق حسب أساسيات المنزل' : 'Shop by Home Essentials'}
        </motion.h2>

        {/* Cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '2px' }}>
          {essentialCategories.map((category, index) => {
            const displayWords = isRTL ? category.words.ar : category.words.en;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleClick(category.id)}
                className="flex h-full w-full overflow-hidden text-right"
                style={{ minHeight: '160px' }}
              >
                {/* Image side */}
                <div className="relative flex-[1.4] overflow-hidden">
                  <img
                    src={category.image}
                    alt={displayWords.join(' ')}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>

                {/* Text panel side */}
                <div
                  className="flex flex-1 flex-col items-center justify-center"
                  style={{ backgroundColor: '#f1e7da', padding: '12px 6px' }}
                >
                  {displayWords.map((word, i) => (
                    <span
                      key={i}
                      className="font-bold leading-tight"
                      style={{
                        color: '#1c2b45',
                        fontSize: 'clamp(14px, 1.6vw, 18px)',
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeEssentialsSection;