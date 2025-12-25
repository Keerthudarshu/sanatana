import React from 'react';
import BannerImageSlider from '../components/ui/BannerImageSlider';

const BannerPreview = () => {
  const allBannerImages = [
    '/assets/banner/gee1.jpeg',
    '/assets/banner/gee2.png',
    '/assets/banner/gee3.avif',
    '/assets/banner/masala.jpg',
    '/assets/banner/pickles.jpeg',
    '/assets/banner/pickles1.webp',
    '/assets/banner/pickels2.webp'
  ];

  const imageCategories = {
    'Ghee Products': [
      '/assets/banner/gee1.jpeg',
      '/assets/banner/gee2.png',
      '/assets/banner/gee3.avif'
    ],
    'Spice Products': [
      '/assets/banner/masala.jpg'
    ],
    'Pickle Products': [
      '/assets/banner/pickles.jpeg',
      '/assets/banner/pickles1.webp',
      '/assets/banner/pickels2.webp'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Banner Image Preview
        </h1>

        {/* All Images Slider */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            All Banner Images Slideshow
          </h2>
          <div className="max-w-4xl mx-auto">
            <BannerImageSlider 
              images={allBannerImages} 
              className="h-80 w-full"
              autoSlide={true}
              interval={3000}
            />
          </div>
        </div>

        {/* Individual Category Previews */}
        <div className="space-y-12">
          {Object.entries(imageCategories).map(([category, images]) => (
            <div key={category} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {category}
              </h3>
              <div className="max-w-2xl mx-auto">
                <BannerImageSlider 
                  images={images} 
                  className="h-64 w-full"
                  autoSlide={images.length > 1}
                  interval={4000}
                />
              </div>
              <div className="mt-4 text-center text-gray-600">
                <p>Contains {images.length} image{images.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Image Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Individual Banner Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBannerImages.map((image, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={image} 
                  alt={`Banner ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
                <div className="p-4">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {image.split('/').pop()}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Path: {image}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerPreview;