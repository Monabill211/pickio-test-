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
            {isRTL ? 'لماذا Pickio Office؟' : 'Why Pickio Office'}
        </h1>

    

        <div className="space-y-2 text-white text-sm md:text-lg font-medium">
          <p>
            {isRTL ? 'تصميمات تناسب الشركات الكبرى خامات عالية الجودة ' : 'Designs suitable for large companies, high-quality materials'}
            
          
            </p>
          <p>
            {isRTL ? 'تنفيذ احترافي وتسليم في المواعيد خبرة في تجهيز المشاريع الكبرى' : 'Professional execution and on-time delivery; experience in preparing large projects.'}
            
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