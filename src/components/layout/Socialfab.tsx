"use client";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

import { useState } from "react";

const socialLinks = [
    {
  name: "فرع مصر الجديدة",
  href:"https://www.google.com/maps/place/pickio+furniture/@30.0803623,31.3415168,20z/data=!4m12!1m5!3m4!2zMzDCsDA0JzUwLjMiTiAzMcKwMjAnMjkuNCJF!8m2!3d30.0806306!4d31.3414945!3m5!1s0x14583f71e6c55aa7:0xa9074f9f3f7f557f!8m2!3d30.08071!4d31.3418654!16s%2Fg%2F11stcsl3vv?hl=en-EG&entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
,
  bg: "#e74c3c",
  icon: <AddLocationAltIcon />,
  label: "مصر الجديدة",
},
{
  name: "فرع المعادي",
  href: "https://www.google.com/maps/place/TotalEnergies+Mearag+Service+Station+-+%D8%AA%D9%88%D8%AA%D8%A7%D9%84+%D8%A5%D9%86%D8%B1%D8%AC%D9%8A%D8%B2+%D8%A7%D9%84%D9%85%D8%B9%D8%B1%D8%A7%D8%AC%E2%80%AD/@29.9756425,31.315437,20z/data=!4m14!1m7!3m6!1s0x1458390698dd140f:0x8c645b6a380c144a!2zVG90YWxFbmVyZ2llcyBNZWFyYWcgU2VydmljZSBTdGF0aW9uIC0g2KrZiNiq2KfZhCDYpdmG2LHYrNmK2LIg2KfZhNmF2LnYsdin2Kw!8m2!3d29.9756106!4d31.3157495!16s%2Fg%2F11b5pkbvns!3m5!1s0x1458390698dd140f:0x8c645b6a380c144a!8m2!3d29.9756106!4d31.3157495!16s%2Fg%2F11b5pkbvns?hl=en-EG&entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",
  bg: "#e74c3c",
  icon: <AddLocationAltIcon />,
  label: "المعادي",
},
  {

    name: "واتساب",
    href: "https://wa.me/201016434958",
    bg: "#25D366",
    icon: <WhatsAppIcon />,
  },
  {
    name: "إنستجرام",
    href: "https://www.instagram.com/pickio_office/",
    bg: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)",
    icon: <InstagramIcon />,
  },
  {
    name: "لينكد ان",
    href: "https://www.tiktok.com/@horas_al_malik?_r=1&_t=ZS-95fJnYRNanl",
    bg: "#1877F2",
    icon: <LinkedInIcon />,
  },
  {
    name: "فيسبوك",
    href: "https://www.facebook.com/pickioOffice/",
    bg: "#1877F2",
    icon: <FacebookIcon />,
  },
  {
      name: "تيك توك",
    href: "https://www.tiktok.com/@pickiofurniture",
    bg: "#000000",
    icon: <TikTokIcon />,
  },
 
];

export default function SocialFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div  style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50 }}>

      {/* أيقونات السوشيال - بتتكشف لفوق */}
      <div className="flex flex-col items-center" style={{ marginBottom: "14px", gap: "12px" }}>
        {socialLinks.map((item, i) => (
         <div
  key={i}
  style={{
    opacity: open ? 1 : 0,
    transform: open
      ? "scale(1) translateY(0)"
      : "scale(0.4) translateY(16px)",
    transitionDelay: open ? `${i * 60}ms` : "0ms",
    pointerEvents: open ? "auto" : "none",
  }}
>
  {item.label && (
    <div
      style={{
        background: "#fff",
        color: "#111",
        padding: "4px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        marginBottom: "6px",
        textAlign: "center",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
      }}
    >
      {item.label}
    </div>
  )}

  <a
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={item.name}
    className="flex items-center justify-center rounded-full shadow-lg"
    style={{
      width: "48px",
      height: "48px",
      background: item.bg,
      color: "#fff",
    }}
  >
    {item.icon}
  </a>
</div>
        ))}
      </div>

      {/* الزرار الرئيسي */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "إغلاق" : "تواصل معنا"}
        className="relative flex items-center justify-center rounded-full shadow-xl transition-transform duration-300"
        style={{
          width: "58px",
          height: "58px",
          background: "#25D366",
          color: "#fff",
          transform: open ? "rotate(135deg)" : "rotate(0deg)",
        }}
      >
        {/* حلقة نابضة تلفت النظر لما يكون مقفول */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "#25D366", opacity: 0.5 }}
          />
        )}
        <span className="relative z-10">
          <PlusIcon />
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   أيقونات
───────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.54V6.78a4.85 4.85 0 01-1.01-.09z"/>
    </svg>
  );
}

