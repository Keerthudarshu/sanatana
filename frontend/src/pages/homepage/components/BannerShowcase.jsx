import React from 'react';
import { Link } from 'react-router-dom';
import BannerImageSlider from '../../../components/ui/BannerImageSlider';

const BannerShowcase = () => {
  const bannerImages = [
    '/assets/banner/gee1.jpeg',
    '/assets/banner/gee2.png',
    '/assets/banner/gee3.avif',
    '/assets/banner/masala.jpg',
    '/assets/banner/pickles.jpeg',
    '/assets/banner/pickles1.webp',
    '/assets/banner/pickels2.webp'
  ];

  const featuredCategories = [
    {
      title: "Premium Ghee Collection",
      description: "Pure A2 cow ghee and traditional ghee varieties",
      images: [
        '/assets/banner/gee1.jpeg',
        '/assets/banner/gee2.png',
        '/assets/banner/gee3.avif'
      ],
      link: "/product-collection-grid?category=ghee",
      badge: "Premium Quality"
    },
    {
      title: "Traditional Spices",
      description: "Hand-ground masalas and spice powders",
      images: ['/assets/banner/masala.jpg'],
      link: "/product-collection-grid?category=spices",
      badge: "Fresh Ground"
    },
    {
      title: "Homemade Pickles",
      description: "Authentic traditional pickle varieties",
      images: [
        '/assets/banner/pickles.jpeg',
        '/assets/banner/pickles1.webp',
        '/assets/banner/pickels2.webp'
      ],
      link: "/product-collection-grid?category=pickles",
      badge: "Homemade"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        {/* Main Banner Slider */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Traditional Flavors, Authentic Quality
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of traditional Indian food products, 
              made with love and following ancient recipes for authentic taste.
            </p>
          </div>
          
          {/* <div className="max-w-6xl mx-auto">
            <BannerImageSlider 
              images={bannerImages} 
              className="h-96 w-full"
              autoSlide={true}
              interval={3000}
            />
          </div> */}
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((category, index) => (
            <div key={index} className="group">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {category.badge}
                  </span>
                </div>

                {/* Image Slider */}
                <div className="h-48">
                  <BannerImageSlider 
                    images={category.images} 
                    className="h-full w-full"
                    autoSlide={category.images.length > 1}
                    interval={4000}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <Link 
                    to={category.link}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group-hover:underline"
                  >
                    Explore Collection
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Experience the Taste of Tradition
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Shop our complete collection of premium traditional products
            </p>
            <Link 
              to="/product-collection-grid"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
            >
              Shop All Products
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerShowcase;