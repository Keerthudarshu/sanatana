import React from 'react';
import Icon from '../../../components/AppIcon';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: 'Leaf',
      title: 'Ancient Wisdom',
      description: 'Traditional recipes passed down through generations, preserving authentic flavors and nutritional benefits.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: 'Shield',
      title: 'Chemical Free',
      description: 'No artificial preservatives, colors, or chemicals. Pure, natural ingredients for your family\'s health.',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'Heart',
      title: 'Made with Love',
      description: 'Every product is crafted with care by skilled artisans who understand the art of traditional cooking.',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      icon: 'Award',
      title: 'Purest Quality',
      description: 'Sourced from trusted farmers and processed using time-tested methods to ensure supreme quality.',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: 'Truck',
      title: 'Fresh Delivery',
      description: 'Direct from our kitchen to your table. Fast, secure packaging ensures freshness is preserved.',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      icon: 'Users',
      title: 'Heritage Trust',
      description: 'Trusted by thousands of families who value authentic taste and traditional food culture.',
      gradient: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-accent rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-primary rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-accent rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-primary mb-4">
            Why Choose Sanatana Parampare?
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the difference that comes from honoring ancient traditions while embracing modern quality standards.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border"
            >
              {/* Icon Background */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={feature.icon} size={32} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="font-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full rounded-tr-2xl"></div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="font-heading text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="font-body text-white/80">
                Premium Products
              </div>
            </div>
            
            <div className="group">
              <div className="font-heading text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                10,000+
              </div>
              <div className="font-body text-white/80">
                Happy Families
              </div>
            </div>
            
            <div className="group">
              <div className="font-heading text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="font-body text-white/80">
                Traditional Recipes
              </div>
            </div>
            
            <div className="group">
              <div className="font-heading text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="font-body text-white/80">
                Chemical Free
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;