import React from "react";

const reviews = [
  {
    name: "Ahmed Ali",
    company: "Vodafone",
    review: "خدمة ممتازة وجودة عالية جدًا في الأثاث ",
    rating: 5,
  },
  {
    name: "Mohamed Salah",
    company: "Orange",
    review: "التصميمات فخمة والتسليم كان في المعاد ",
    rating: 4,
  },
  {
    name: "Omar Khaled",
    company: "Etisalat",
    review: "تجربة رائعة وأنصح أي شركة تتعامل معاهم ",
    rating: 5,
  },
];

export default function ReviewsSection() {
  return (
    <div className="py-20 px-4 bg-gray-50">
      
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-red-500">
          آراء عملائنا
        </h1>
        <p className="text-gray-500 mt-2">
          شوف الناس بتقول ايه عن Pic<span className="text-red-500">k</span>io
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ">
        
        {reviews.map((item, i) => (
          <div
            key={i}
            className="relative bg-white p-6 rounded-2xl shadow-md overflow-hidden 
            transition-all duration-300 hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl group hover:shadow-[0_18px_40px_rgba(255,0,0,0.4)] transition"
          >
            
            {/* ✨ light effect */}
            <div className="absolute top-0 left-0 w-0 h-0 
            group-hover:w-full group-hover:h-full 
            bg-gradient-to-br from-white/40 via-transparent to-transparent 
            transition-all duration-500 pointer-events-none"></div>

            {/* ⭐ stars */}
            <div className="flex mb-3">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-xl ${
                    index < item.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* 📝 review */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {item.review}
            </p>

            {/* 👤 user */}
            <div className="mt-4">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.company}</p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}