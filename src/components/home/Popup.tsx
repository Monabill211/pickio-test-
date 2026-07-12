'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoPopup: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // يظهر مرة واحدة بس في كل جلسة تصفح
    const alreadyShown = sessionStorage.getItem('promoPopupShown');
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('promoPopupShown', 'true');
      }, 1200); // تأخير بسيط عشان الصفحة تحمل الأول

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleShopNow = () => {
    setIsOpen(false);
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
            className="relative w-full max-w-md overflow-hidden rounded-2xl"
            style={{ backgroundColor: '#f1e7da' }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/10"
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" style={{ color: '#1c2b45' }} />
            </button>

            {/* Banner image */}
            <div className="relative h-48 w-full overflow-hidden sm:h-56">
              <img
                src="https://loremflickr.com/800/500/livingroom,furniture"
                alt="عرض خاص"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center" style={{ padding: '28px 24px' }}>
              <span
                className="mb-2 rounded-full font-bold"
                style={{
                  backgroundColor: '#1c2b45',
                  color: '#f1e7da',
                  padding: '4px 16px',
                  fontSize: '13px',
                }}
              >
                عرض لفترة محدودة
              </span>

              <h3
                className="font-extrabold"
                style={{ color: '#1c2b45', fontSize: '26px', marginTop: '8px' }}
              >
                خصم 20% على أول طلب
              </h3>

              <p
                className="text-muted-foreground"
                style={{ marginTop: '8px', fontSize: '15px', color: '#4a4a4a' }}
              >
                استخدم الكود عند إتمام الطلب واستمتع بخصم فوري على جميع المنتجات
              </p>

              <div
                className="font-bold tracking-widest"
                style={{
                  marginTop: '16px',
                  border: '2px dashed #1c2b45',
                  borderRadius: '10px',
                  padding: '10px 24px',
                  color: '#1c2b45',
                  fontSize: '18px',
                }}
              >
                WELCOME20
              </div>

              <button
                onClick={handleShopNow}
                className="w-full font-bold transition-opacity hover:opacity-90"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#1c2b45',
                  color: '#f1e7da',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '16px',
                }}
              >
                تسوق الآن
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;