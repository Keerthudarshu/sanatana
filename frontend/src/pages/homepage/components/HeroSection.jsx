

import React, { useState, useEffect } from 'react';

const desktopImages = [
  '/assets/banner/first.png',
  '/assets/banner/second.png',
];
const mobileImages = [
  '/assets/banner/mobilefirst.png',
  '/assets/banner/mobileseccond.png'
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const HeroSection = () => {
  const isMobile = useIsMobile();
  const sliderImages = isMobile ? mobileImages : desktopImages;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  return (
    <section className="relative h-[85vh] md:h-[90vh] overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/5">
      <img
        src={sliderImages[current]}
        alt={`Hero Slide ${current + 1}`}
        className="w-full h-full object-cover transition-all duration-1000 absolute inset-0"
        style={{ zIndex: 1 }}
      />
      {/* Navigation Arrows */}
      {sliderImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl text-primary hover:bg-white/50 transition-all duration-300"
            aria-label="Previous Slide"
          >
            &#8592;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl text-primary hover:bg-white/50 transition-all duration-300"
            aria-label="Next Slide"
          >
            &#8594;
          </button>
        </>
      )}
      {/* Dots */}
      {sliderImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-4 h-4 rounded-full ${idx === current ? 'bg-primary' : 'bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;