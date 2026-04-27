import { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useLanguage } from '@/contexts/LanguageContext';


export default function FloatingWhatsApp() {
  const [showText, setShowText] = useState(true);

        const { language, isRTL } = useLanguage();
 

  return (
    <div className="fixed bottom-6  left-6 z-50 flex flex-col items-end gap-2">
      
    
      {showText && (
        <div className="bg-white text-black px-4 py-2 rounded-xl shadow-lg text-sm animate-bounce">
                            {isRTL ? 'عايز مساعدة ؟👋' : '  Need help? 👋  '}

      
        </div>
      )}

      <a
        href="https://wa.me/201016434958"
        target="_blank"
        className="bg-green-500 text-white p-4 rounded-full shadow-lg 
                   hover:scale-110 transition animate-pulse"
      >
        <WhatsAppIcon  />
      </a>
    </div>
  );
}