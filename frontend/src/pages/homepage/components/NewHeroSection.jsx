import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const NewHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "साम्राज्य का पुरातन स्वाद",
      subtitle: "SANATANA PARAMPARE",
      description: "Experience the purest traditional foods following ancient Indian wisdom. Chemical-free, preservative-free, made with love.",
      cta: "Discover Pure Heritage",
      backgroundImage: "/assets/banner/gee1.jpeg",
      overlay: "bg-gradient-to-r from-primary/90 to-primary/70"
    },
    {
      title: "Wood Pressed Oils",
      subtitle: "PURE & NATURAL",
      description: "Traditional wood pressing method preserves nutrients. Experience the authentic taste of coconut, sesame, and groundnut oils.",
      cta: "Shop Pure Oils",
      backgroundImage: "/assets/banner/gee2.png",
      overlay: "bg-gradient-to-r from-accent/90 to-accent/70"
    },
    {
      title: "Traditional Spice Powders",
      subtitle: "AUTHENTIC FLAVORS",
      description: "Hand-ground spices following ancient recipes. Sambar powder, rasam powder, and traditional masalas for authentic taste.",
      cta: "Explore Spices",
      backgroundImage: "/assets/banner/masala.jpg",
      overlay: "bg-gradient-to-r from-secondary/90 to-secondary/70"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.backgroundImage}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${slide.overlay}`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          {/* Traditional Decorative Element */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-1 bg-white rounded-full mr-4"></div>
            <Icon name="Leaf" size={40} className="text-white" />
            <div className="w-16 h-1 bg-white rounded-full ml-4"></div>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-6xl md:text-8xl font-bold mb-4 tracking-wide">
            {heroSlides[currentSlide].title}
          </h1>
          
          {/* Subtitle */}
          <h2 className="font-heading text-xl md:text-2xl font-medium mb-6 tracking-widest text-green-100">
            {heroSlides[currentSlide].subtitle}
          </h2>

          {/* Description */}
          <p className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-white/90">
            {heroSlides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/product-collection-grid"
              className="bg-white text-primary hover:bg-green-50 px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {heroSlides[currentSlide].cta}
            </Link>
            
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              Our Heritage
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-sm">
            <div className="text-center">
              <Icon name="Shield" size={24} className="text-white mx-auto mb-2" />
              <span className="block text-white/80">Chemical Free</span>
            </div>
            <div className="text-center">
              <Icon name="Heart" size={24} className="text-white mx-auto mb-2" />
              <span className="block text-white/80">Made with Love</span>
            </div>
            <div className="text-center">
              <Icon name="Award" size={24} className="text-white mx-auto mb-2" />
              <span className="block text-white/80">Pure Heritage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <Icon name="ChevronLeft" size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <Icon name="ChevronRight" size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 z-20 text-white animate-bounce">
        <Icon name="ChevronDown" size={24} />
      </div>
    </section>
  );
};

export default NewHeroSection;