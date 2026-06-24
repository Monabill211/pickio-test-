import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext';
import bgImage from '@/assets/1777414338894_9uRBlAvqTpScomHq7m9aow.jpg'

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
        <h5 className='text-4xl'>+1000</h5>
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
        <h5 className='text-4xl'>+3000</h5>
        <h6 className='text-base'>
                      {isRTL ? 'منتج' : ' Project '}
          
           </h6>      
        </div>
      </div>
      <div className='flex  flex-wrap  justify-between flex-col md:flex-row gap-5 bg-gray-200 'style={{padding:'10px'}}>
        <div className='w-550px '>
            <img src={bgImage} alt="" className='rounded-lg'style={{height:"450px"}} />
        </div>
        <div className='text-start'>
            <h1 className='text-4xl font-black flex justify-center items-center flex-row-reverse' >
  <div>
                  Pic<span className='text-red-500'>k</span>io   
              </div>
              {isRTL ?  '   من هم    ' : ' Who are they? '}
            
              
              </h1>
            <p className='text-lg leading-relaxed w-400px md:w-[630px]' style={{padding:"45px"}}>
{isRTL ? 

'هي شركة مصرية متخصصة في تصنيع وتوريد األثاث المكتبي الراقي، تجمع بين خبرة التصنيع وجودة الخام  Pickio Furnitureات والتصميم العصري لتقديم حلول متكاملة تلبي احتياجات الشركات والمساحات اإلدارية الحديثة. نفخر بامتالكنا مصنعًا مجهز ًا بأحدث التقنيات ومعارض متعددة، مما يتيح لنا تقديم تجربة متكاملة تبدأ من التصميم واإلنتاج وحتى التسليم والتركيب، مع االلتزام بأعلى معايير ال جودة والدقة في التنفيذ. نؤمن بأن لكل عميل رؤية مختلفة، لذلك نوفر خدمة التصميم والتصنيع حسب الطلب (  Customization)، حيث يمكن تنفيذ وتعديل المقاسات، والخامات، واأللوان، وتخصيص أي موديل بما يتناسب مع هوية الشركة واحتياجاتها العملية. على مدار سنوات من الخبرة، ن جحنا في بناء ثقة عمالئنا من خالل تقديم منتجات تجمع بين الفخامة، والعملية، والمتانة، لنصنع مساحات عمل تعكس االحترافية وتدوم لسنوات.  …نصنع بيئات عمل استثنائية تجمع بين الجودة، واالبتكار، والتفاصيل التي تصنع  Pickio Furniture' : 'Our journey began with a simple belief: that a comfortable work environment makes a real difference in productivity and creativity. That is why we are committed to providing office furniture that combines high quality, modern design, and practical comfort to meet the needs of todays companies and organizations.Throughout our journey, we have worked to deliver comprehensive office solutions for businesses of all sizes, from ergonomic office chairs and executive desks to meeting tables and reception counters that create the first impression your clients deserve.  '}
</p>
            <p className='text-lg leading-relaxed w-400px md:w-[630px]' style={{padding:"45px"}}>
              {isRTL ? 'نقدم خدماتنا في القاهرة وجميع أنحاء مصر، مع خبرة في تجهيز مكاتب الشركات في مدينة نصر، التجمع، والشيخ زايد، المعادي ، أكتوبر ، الإسكندرية ، الغردقة .' : ' We offer our services in Cairo and throughout Egypt, with expertise in equipping corporate offices in Nasr City, New Cairo, Sheikh Zayed, Maadi, 6th of October City, Alexandria, and Hurghada.  '}

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
