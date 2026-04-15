"use client";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import SendIcon from "@mui/icons-material/Send";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import Inputphone from "@/assets/inputs/Inputphone";
import InputName from "@/assets/inputs/InputName";

export default function ContactMe() {
  return (
    <div id="contact" className="px-4 md:px-10 py-10">
      
      {/* العنوان */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl text-red-600 font-bold">
          تواصل معانا
        </h1>
        <h2 className="text-lg md:text-2xl text-[#00bacf] mt-3">
          نحن هنا لخدمتك تواصل معنا ولا تتردد
        </h2>
      </div>

      {/* المحتوى */}
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        
        {/* الفورم */}
        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-center font-black text-2xl md:text-3xl mb-6">
            ارسل لنا رسالتك
          </h2>

          <form className="space-y-4">
            
            {/* الاسم + رقم الهاتف */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  الاسم بالكامل:
                </label>
                <InputName />
              </div>

              <div className="w-full">
                <label className="block mb-1 font-medium">
                  رقم الهاتف:
                </label>
                <Inputphone />
              </div>
            </div>

            {/* الرسالة */}
            <div>
              <label className="block mb-1 font-medium">الرسالة:</label>
              <textarea
                rows={4}
                placeholder="اكتب رسالتك هنا..."
                className="w-full resize-none border-2 border-red-400 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* زرار */}
            <button
              type="submit"
              className="w-full bg-white border border-red-600 py-3 rounded-full font-bold transition-all duration-300 ease-in-out  hover:bg-red-600 hover:text-white hover:-translate-y-2 transition flex items-center justify-center gap-2"
            >
              ارسال رسالة <SendIcon />
            </button>
          </form>
        </div>

        {/* بيانات التواصل */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          
          {/* Card Component */}
          {[
            {
              title: "رقم الهاتف",
              value: "01016434958",
              icon: <CallIcon />,
              link: "tel:+201016434958",
            },
            {
              title: "الواتساب",
              value: "01016434958",
              icon: <WhatsAppIcon />,
              link: "https://wa.me/201016434958",
            },
            {
              title: "الايميل",
              value: "pickiofurniture@gmail.com",
              icon: <AttachEmailIcon />,
              link: "mailto:pickiofurniture@gmail.com",
            },
            {
              title: "العنوان",
              value: "  ٧ شارع عصمت الخضري متفرع من شارع النزهه خلف معرض سيارات الليثي للسيارات مدينة نصر",
              icon: <AddLocationAltIcon />,
              link: "https://www.google.com/maps/place/pickio+furniture/@30.0806352,31.3366236,17z/data=!3m1!4b1!4m6!3m5!1s0x14583f71e6c55aa7:0xa9074f9f3f7f557f!8m2!3d30.0806306!4d31.3414945!16s%2Fg%2F11stcsl3vv?hl=en&entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
            },
          ].map((item, i) => (
            <a key={i} href={item.link}>
              <div className="flex justify-between items-center gap-4 cursor-pointer bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition transition-all duration-300 ease-in-out hover:-translate-x-2 border border-transparent hover:border-red-400">
                
                <div className="text-right">
                  <h1 className="text-gray-500 text-sm">
                    :{item.title}
                  </h1>
                  <h2 className="font-bold text-sm md:text-base">
                    {item.value}
                  </h2>
                </div>

                <div className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition text-2xl">
                  {item.icon}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}