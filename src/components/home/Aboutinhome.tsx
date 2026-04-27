import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext';

export default function Aboutinhome() {
      const { language, isRTL } = useLanguage();
  
  return (
    <div >
      <div className='bg-red-500 flex flex-col gap-6   md:flex-row justify-around text-center text-white ' style={{padding:'30px'}}>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>
           +5,000</h5>
        <h6 className='text-base'>
                      {isRTL ? 'مشاريع تم تسليمها' : ' Projects delivered '}
           </h6>
        </div>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>+100</h5>
        <h6 className='text-base'>
                      {isRTL ? '    عملاء راضون  ' : '  Satisfied customers '}

         
           </h6>  
        </div>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>+10</h5>
        <h6 className='text-base'>
                      {isRTL ? 'سنوات من الخبرة  ' : '  Years of experience '}
          
      </h6>      
        </div>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>+1000</h5>
        <h6 className='text-base'>
                      {isRTL ? 'منتج' : ' Project '}
          
           </h6>      
        </div>
      </div>
      <div className='flex  flex-wrap  justify-between flex-col md:flex-row gap-5 bg-gray-200 'style={{padding:'10px'}}>
        <div className='w-550px '>
            <img src="/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg" alt="" className=''style={{height:"450px"}} />
        </div>
        <div className='text-start'>
            <h1 className='text-4xl font-black flex justify-center items-center flex-row-reverse' >
  <div>
                  Pic<span className='text-red-500'>k</span>io   
              </div>
              {isRTL ?  '   من هم    ' : ' Who are they? '}
            
              
              </h1>
            <p className='text-lg leading-relaxed w-400px md:w-[630px]' style={{padding:"45px"}}>
                                    {isRTL ? '               نحن شركة متخصصة في تصميم وتصنيع الأثاث المكتبي الحديث، حيث نؤمن أن بيئة العمل القوية  تبدأ من تفاصيل المكان.بدأت رحلتنا بورشة صغيرة تعتمد على الشغف والجودة، ثم تطورنا من خلال التسويق والعمل المستمر حتى تمكنا من إنشاء أول معرض لنا،  لنقترب أكثر من عملائنا ونفهم احتياجاتهم بشكل أفضل. ' : ' We are a company specializing in the design and manufacture of modern office furniture, as we believe that a strong work environment starts with the details of the space. Our journey began with a small workshop based on passion and quality, and then we developed through marketing and continuous work until we were able to establish our first showroom, to get closer to our customers and better understand their needs.  '}

</p>
<Link to="/about" className='flex justify-center items-center'>
<button className='bg-red-500 text-white py-2 px-4 rounded-3xl text-center transition-all duration-300 ease-in-out hover:bg-red-600 cursor-pointer hover:-translate-y-2' >
      {isRTL ? 'معرفة المزيد عن ' : 'Learn more about '}

  Pickio </button>
</Link>
        </div>
      </div>
    </div>
  )
}
