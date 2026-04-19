import React from 'react'
import { Link } from 'react-router-dom'

export default function Aboutinhome() {
  return (
    <div >
      <div className='bg-red-500 flex flex-col gap-6   md:flex-row justify-around text-center text-white ' style={{padding:'30px'}}>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'> +5,000</h5>
        <h6 className='text-base'>مشاريع تم تسليمها  </h6>
        </div>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>+100</h5>
        <h6 className='text-base'>عملاء راضون  </h6>  
        </div>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>+10</h5>
        <h6 className='text-base'>سنوات من الخبرة  </h6>      
        </div>
        <div className='flex flex-col gap-4'>
        <h5 className='text-4xl'>+1000</h5>
        <h6 className='text-base'> منتج  </h6>      
        </div>
      </div>
      <div className='flex justify-between flex-col md:flex-row gap-5 bg-gray-200 'style={{paddingTop:'20px'}}>
        <div className='w-550px '>
            <img src="/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg" alt="" className=''style={{height:"450px"}} />
        </div>
        <div className='text-start text-'>
            <h1 className='text-4xl text-center font-black'>عن Pic<span className='text-red-500'>k</span>io</h1>
            <p className='text-lg leading-relaxed ' style={{padding:"45px"}}> نحن شركة متخصصة في تصميم وتصنيع الأثاث المكتبي الحديث، حيث نؤمن أن بيئة العمل القوية <br></br> تبدأ من تفاصيل المكان.بدأت رحلتنا بورشة صغيرة تعتمد على الشغف والجودة،  <br/>ثم تطورنا من خلال التسويق والعمل المستمر حتى تمكنا من إنشاء أول معرض لنا،<br/>  لنقترب أكثر من عملائنا ونفهم احتياجاتهم بشكل أفضل.
</p>
<Link to="/about">
<button className='bg-red-500 text-white py-2 px-4 rounded-3xl text-center transition-all duration-300 ease-in-out hover:bg-red-600 cursor-pointer hover:-translate-y-2' style={{marginRight:'30%'}}>معرفة المزيد عن Pickio </button>
</Link>
        </div>
      </div>
    </div>
  )
}
