import React from 'react'
import { Link } from 'react-router-dom'
import bgImage from '@/assets/hero-living-room.jpg'

export default function Whywe() {
  return (
    <div
      className="w-full py-20 bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      {/* Box */}
      <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 max-w-2xl w-[90%] text-center shadow-xl">
        
        <h1 className="text-2xl md:text-3xl text-red-500 font-bold mb-3">
          لماذا تختارنا؟
        </h1>

        <h2 className="text-base md:text-xl text-[#00bacf] mb-4">
          لماذا تختار Pic<span className='text-red-500'>k</span>io؟
        </h2>

        <div className="space-y-2 text-white text-sm md:text-lg font-medium">
          <p>لأن مكتبك يستحق الأفضل!</p>
          <p>العلامة رقم 1 في الأثاث المكتبي</p>
          <p>خبرة مع أكبر الشركات</p>
          <p>تصميمات فاخرة بأجود الخامات</p>
          <p>معاينة مجانية من مهندسين محترفين</p>
        </div>

        <Link to="/about">
          <button className="mt-6 bg-red-500 text-white py-2 px-5 rounded-full text-sm md:text-base
          hover:bg-red-600 transition hover:-translate-y-1">
            معرفة المزيد
          </button>
        </Link>

      </div>
    </div>
  )
}