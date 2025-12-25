import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Premium Wood Pressed Oils",
      subtitle: "COLD PRESSED & PURE",
      description: "Shop authentic wood-pressed oils - Coconut, Sesame, Groundnut & more. Chemical-free processing for maximum nutrition and flavor.",
      primaryCTA: "Shop Oils",
      secondaryCTA: "View Collection",
      primaryLink: "/product-collection-grid?category=wood-pressed-oils",
      secondaryLink: "/product-collection-grid",
      backgroundImage: "/assets/banner/gee1.jpeg",
      productImages: [
        "/assets/banner/gee1.jpeg",
        "/assets/banner/gee2.png",
        "/assets/banner/gee3.avif"
      ],
      badge: "Best Seller",
      discount: "Buy 2 Get 15% OFF",
      price: "Starting ₹180",
      overlay: "from-black/75 via-black/50 to-black/25"
    },
    {
      title: "Traditional Spice Powders",
      subtitle: "HAND-GROUND MASALAS",
      description: "Authentic spice blends - Sambar, Rasam, Garam Masala. Traditional stone grinding preserves natural oils and aroma.",
      primaryCTA: "Order Spices",
      secondaryCTA: "Spice Bundles",
      primaryLink: "/product-collection-grid?category=spice-powders",
      secondaryLink: "/product-collection-grid?category=spice-powders&bundle=true",
      backgroundImage: "/assets/banner/masala.jpg",
      productImages: [
        "/assets/banner/masala.jpg",
        "/assets/banner/gee2.png",
        "/assets/banner/gee3.avif"
      ],
      badge: "Fresh Ground",
      discount: "Bundle Save 25%",
      price: "Starting ₹85",
      overlay: "from-red-900/75 via-orange-800/50 to-yellow-700/25"
    },
    {
      title: "Pure Ghee & Honey",
      subtitle: "A2 COW GHEE & WILD HONEY",
      description: "Premium A2 cow ghee and raw wild honey. Rich in nutrients, authentic taste. Perfect for cooking and health benefits.",
      primaryCTA: "Buy Now",
      secondaryCTA: "Health Benefits",
      primaryLink: "/product-collection-grid?category=ghee-honey",
      secondaryLink: "/product-collection-grid?category=ghee-honey&info=benefits",
      backgroundImage: "/assets/banner/gee2.png",
      productImages: [
        "/assets/banner/gee2.png",
        "/assets/banner/gee1.jpeg",
        "/assets/banner/gee3.avif"
      ],
      badge: "Premium Quality",
      discount: "Limited Stock",
      price: "Starting ₹450",
      overlay: "from-amber-900/75 via-yellow-800/50 to-orange-600/25"
    },
    {
      title: "Homemade Pickles & Preserves",
      subtitle: "TRADITIONAL RECIPES",
      description: "Authentic homemade pickles - Mango, Lemon, Mixed vegetable. Made with traditional recipes and natural preservation methods.",
      primaryCTA: "Order Pickles",
      secondaryCTA: "Recipe Story",
      primaryLink: "/product-collection-grid?category=pickles-preserves",
      secondaryLink: "/product-collection-grid?category=pickles-preserves&story=true",
      backgroundImage: "/assets/banner/pickles.jpeg",
      productImages: [
        "/assets/banner/pickles.jpeg",
        "/assets/banner/pickles1.webp",
        "/assets/banner/pickels2.webp"
      ],
      badge: "Homemade",
      discount: "Fresh Batch",
      price: "Starting ₹120",
      overlay: "from-green-900/75 via-emerald-800/50 to-teal-600/25"
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentHero = heroSlides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-[85vh] md:h-[90vh] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5">
      {/* Background Images with Smooth Transition */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Image with proper loading and error handling */}
          <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted/40">
            <img
              src={slide.backgroundImage}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-1000"
              loading={index === 0 ? "eager" : "lazy"}
              onLoad={(e) => {
                e.target.style.opacity = '1';
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                console.warn(`Failed to load image: ${slide.backgroundImage}`);
              }}
              style={{ 
                opacity: 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/20"
      >
        <Icon name="ChevronLeft" size={28} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/20"
      >
        <Icon name="ChevronRight" size={28} />
      </button>

      {/* Content */}
            {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Text Content */}
          <div className="lg:col-span-7 text-white">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-6 animate-fadeIn">
              <span className="bg-primary/90 backdrop-blur-sm text-white px-6 py-2 rounded-full font-semibold text-sm border border-primary/20 shadow-lg">
                {currentHero.badge}
              </span>
              <span className="bg-accent/90 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-sm animate-pulse border border-accent/20 shadow-lg">
                {currentHero.discount}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-sm border border-white/20">
                {currentHero.price}
              </span>
            </div>

            {/* Title with Animation */}
            <h1 className="font-heading text-3xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-slideInLeft">
              {currentHero.title}
            </h1>
            
            {/* Subtitle */}
            <h2 className="font-heading text-lg md:text-2xl lg:text-3xl font-medium mb-6 text-green-100 tracking-widest animate-slideInLeft animation-delay-200">
              {currentHero.subtitle}
            </h2>

            {/* Description */}
            <p className="font-body text-base md:text-lg lg:text-xl mb-8 text-white/90 leading-relaxed max-w-2xl animate-slideInLeft animation-delay-400">
              {currentHero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-slideInUp animation-delay-600">
              <Link
                to={currentHero.primaryLink}
                className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-heading font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl inline-flex items-center justify-center gap-3 border border-primary/20 backdrop-blur-sm"
              >
                <Icon name="ShoppingCart" size={22} />
                {currentHero.primaryCTA}
              </Link>
              
              <Link
                to={currentHero.secondaryLink}
                className="border-2 border-white/80 text-white hover:bg-white hover:text-primary px-10 py-4 rounded-xl font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3 backdrop-blur-sm bg-white/10"
              >
                <Icon name="Eye" size={22} />
                {currentHero.secondaryCTA}
              </Link>
            </div>

            {/* Quick Features */}
            <div className="flex flex-wrap gap-6 text-sm animate-slideInUp animation-delay-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/30">
                  <Icon name="Truck" size={18} className="text-green-300" />
                </div>
                <span className="text-white/90 font-medium">Free Shipping ₹499+</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/30">
                  <Icon name="ShieldCheck" size={18} className="text-green-300" />
                </div>
                <span className="text-white/90 font-medium">100% Natural</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/30">
                  <Icon name="Clock" size={18} className="text-green-300" />
                </div>
                <span className="text-white/90 font-medium">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Product Showcase Images */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              {/* Main Product Image */}
              <div className="relative mb-6 animate-slideInRight">
                <div className="w-full max-w-md mx-auto">
                  <div className="relative w-full h-80 bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                    <img
                      src={currentHero.productImages[0]}
                      alt={`${currentHero.title} main product`}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      loading="eager"
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/20');
                      }}
                      style={{ 
                        opacity: 0,
                        transition: 'opacity 0.5s ease-in-out'
                      }}
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    Featured
                  </div>
                </div>
              </div>

              {/* Additional Product Images */}
              <div className="flex gap-4 justify-center animate-slideInRight animation-delay-400">
                {currentHero.productImages.slice(1).map((image, idx) => (
                  <div key={idx} className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl overflow-hidden shadow-lg border-2 border-white/30 hover:scale-105 transition-transform duration-300">
                      <img
                        src={image}
                        alt={`${currentHero.title} product ${idx + 2}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        loading="lazy"
                        onLoad={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-primary/30', 'to-accent/30');
                        }}
                        style={{ 
                          opacity: 0,
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg animate-bounce animation-delay-1000">
                <div className="text-primary font-bold text-sm">Fresh Stock</div>
              </div>
              
              <div className="absolute bottom-20 -right-8 bg-accent/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg animate-pulse">
                <div className="text-white font-bold text-sm">Top Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide 
                ? 'w-12 h-4 bg-primary rounded-full shadow-lg' 
                : 'w-4 h-4 bg-white/50 rounded-full hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold">
        <span>{currentSlide + 1}</span>
        <span className="text-white/60 mx-1">/</span>
        <span className="text-white/80">{heroSlides.length}</span>
      </div>

      {/* Auto-advance Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-primary transition-all duration-200 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;