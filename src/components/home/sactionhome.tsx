import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface EssentialCategory {
  id: string;
  words: string[]; // each word on its own line
  image: string;
}

const essentialCategories: EssentialCategory[] = [
  {
    id: 'bedroom',
    words: ['أساسيات', 'غرفة', 'النوم'],
    image: 'https://loremflickr.com/640/640/bedroom,furniture',
  },
  {
    id: 'living',
    words: ['أساسيات', 'غرفة', 'المعيشه'],
    image: 'https://loremflickr.com/640/640/sofa,livingroom',
  },
  {
    id: 'dining',
    words: ['أساسيات', 'غرفة', 'السفرة'],
    image: 'https://loremflickr.com/640/640/dining,table',
  },
  {
    id: 'office',
    words: ['أساسيات', 'المكتب'],
    image: 'https://loremflickr.com/640/640/office,desk',
  },
];

const HomeEssentialsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
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