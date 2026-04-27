import React from 'react'
import { Link } from 'react-router-dom'
import bgImage from '@/assets/hero-living-room.jpg'
import { useLanguage } from '@/contexts/LanguageContext';

export default function Whywe() {
    const { language, isRTL } = useLanguage();
  
  return (
    <div
      className="w-full py-20 bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      {/* Box */}
      <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 max-w-2xl w-[90%] text-center shadow-xl">
        
        <h1 className="text-2xl md:text-3xl text-red-500 font-bold mb-3">
            {isRTL ? '  لماذا تختارنا ؟' : 'Why choose us ?'}
        </h1>

        <h2 className="text-base md:text-xl text-[#00bacf] mb-4">
            {isRTL ? 'لماذا تختار ' : ' Why choose '}
           Pic<span className='text-red-500'>k</span>io ?
        </h2>

        <div className="space-y-2 text-white text-sm md:text-lg font-medium">
          <p>
            {isRTL ? '  لأن مكتبك يستحق الأفضل! ' : 'Because your office deserves the best!'}
            
          
            </p>
          <p>
            {isRTL ? 'العلامة رقم 1 في الأثاث المكتبي' : 'The number 1 brand in office furniture'}
            
           </p>
          <p>
            {isRTL ? '  خبرة مع أكبر الشركات' : 'Experience with the largest companies'}
            
           </p>
          <p>
            {isRTL ? '  تصميمات فاخرة بأجود الخامات' : 'Luxurious designs using the finest materials'}
            </p>
          <p>
            {isRTL ? '  معاينة مجانية من مهندسين محترفين' : 'Free consultation from professional engineers'}
            
           </p>
        </div>

        <Link to="/about">
          <button className="mt-6 bg-red-500 text-white py-2 px-5 rounded-full text-sm md:text-base
          hover:bg-red-600 transition hover:-translate-y-1">
            {isRTL ? '   معرفة المزيد' : 'Learn more'}

           
          </button>
        </Link>

      </div>
    </div>
  )
}