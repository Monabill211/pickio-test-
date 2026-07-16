import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import imgdinerroom from '@/assets/modern-dining-room-in-black-and-white-dining-room-set-vitrine-furniture-8096136.webp';
import imgliveingroom from '@/assets/l-shaped-sectional-modern-comfort-style-l-shape-sofa-set-vitrine-furniture-5724595.webp';
import imgbadroom from '@/assets/full_bed_room.webp';
import imghome from '@/assets/tv-unit-sleek-design-with-space-saving-shelves-furniture-vitrine-furniture-520299.webp';

interface EssentialCategory {
  id: string; // matchName: النص اللي هنبحث بيه في اسم الكاتجوري الحقيقي
  matchName: string;
  words: string[];
  image: string;
}

const essentialCategories: EssentialCategory[] = [
  {
    id: 'bedroom',
    matchName: 'نوم', // أي كاتجوري اسمها فيه كلمة "نوم" هتترابط تلقائي
    words: ['أساسيات', 'غرفة', 'النوم'],
    image: imgbadroom,
  },
  {
    id: 'living',
    matchName: 'معيشة',
    words: ['أساسيات', 'غرفة', 'المعيشه'],
    image: imgliveingroom,
  },
  {
    id: 'dining',
    matchName: 'سفرة',
    words: ['أساسيات', 'غرفة', 'السفرة'],
    image: imgdinerroom,
  },
  {
    id: 'office',
    matchName: 'عمل', // غيّر الكلمة دي لو اسم الكاتجوري في فايرستور مختلف
    words: ['أساسيات', 'المنزل'],
    image: imghome,
  },
];

interface FirestoreCategory {
  id: string;
  name: string | { ar?: string; en?: string };
}

const getCategoryDisplayName = (name: FirestoreCategory['name']): string => {
  if (!name) return '';
  if (typeof name === 'string') return name;
  return name.ar || name.en || '';
};

const HomeEssentialsSection: React.FC = () => {
  const navigate = useNavigate();
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
          const found = firestoreCategories.find((fc) =>
            getCategoryDisplayName(fc.name).includes(essential.matchName)
          );
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
      // لو مفيش مطابقة، روح لصفحة الشوب عادي من غير فلتر
      navigate('/shop');
    }
  };

  return (
    <section style={{ paddingBlock: 'clamp(40px, 6vw, 64px)' }} dir="rtl">
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
          تسوق حسب أساسيات المنزل
        </motion.h2>

        {/* Cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '2px' }}>
          {essentialCategories.map((category, index) => (
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
                  alt={category.words.join(' ')}
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
                {category.words.map((word, i) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeEssentialsSection;