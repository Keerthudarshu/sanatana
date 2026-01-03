import React from 'react';

const essentialOils = [
  { name: 'Castor Oil', img: '/assets/images/esential oils/Castor oil Bottle.png' },
  { name: 'Dry Coconut Oil', img: '/assets/images/esential oils/Dry coconut oil Bottle.png' },
  { name: 'Groundnut Oil', img: '/assets/images/esential oils/Ground nut oil bottle.png' },
  { name: 'Mustard Oil', img: '/assets/images/esential oils/Mustard oil bottle.png' },
  { name: 'Niger Oil', img: '/assets/images/esential oils/Niger oil Bottle.png' },
  { name: 'Saflower Oil', img: '/assets/images/esential oils/Saflower oil Bottle.png' },
  { name: 'Sesame Oil', img: '/assets/images/esential oils/Sesame oil bottle.png' },
  { name: 'Virgin Coconut Oil', img: '/assets/images/esential oils/V Coconut oil Bottle.png' },
];

const EssentialOilsSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-heading text-4xl font-bold text-accent mb-4">
          Essential Oils
        </h2>
        <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our range of pure, traditional essential oils for your daily needs.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {essentialOils.map((oil, idx) => (
          <div key={idx} className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="flex-1 w-full aspect-[4/5] bg-gray-100 flex items-center justify-center">
              <img
                src={oil.img}
                alt={oil.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex items-center justify-center">
              <span className="font-heading text-lg font-semibold text-foreground text-center">
                {oil.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default EssentialOilsSection;
