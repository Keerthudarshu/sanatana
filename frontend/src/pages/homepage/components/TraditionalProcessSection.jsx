import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const TraditionalProcessSection = () => {
  const processes = [
    {
      step: '01',
      title: 'Sourcing Pure Ingredients',
      description: 'We carefully select the finest raw materials from trusted organic farmers across India.',
      icon: 'Sprout',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop'
    },
    {
      step: '02',
      title: 'Traditional Processing',
      description: 'Using time-honored methods like wood pressing and stone grinding to preserve natural goodness.',
      icon: 'Cog',
      image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=400&fit=crop'
    },
    {
      step: '03',
      title: 'Quality Testing',
      description: 'Every batch undergoes rigorous quality checks to ensure purity and authentic taste.',
      icon: 'CheckCircle',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'
    },
    {
      step: '04',
      title: 'Fresh Packaging',
      description: 'Carefully packed in eco-friendly materials to preserve freshness and deliver to your doorstep.',
      icon: 'Package',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-primary mb-4">
            Our Traditional Process
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From farm to table, every step follows ancient wisdom to bring you the purest, 
            most authentic products that honor our culinary heritage.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-16">
          {processes.map((process, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className="lg:w-1/2">
                <div className="relative group">
                  <img
                    src={process.image}
                    alt={process.title}
                    className="w-full h-80 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Step Number Overlay */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-heading font-bold text-2xl shadow-xl">
                    {process.step}
                  </div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute bottom-6 right-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Icon name={process.icon} size={28} className="text-primary" />
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2">
                <div className="max-w-lg mx-auto lg:mx-0">
                  {/* Step Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-2 rounded-full font-medium mb-6">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Step {process.step}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-heading text-3xl font-bold text-foreground mb-6">
                    {process.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8">
                    {process.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3">
                    {index === 0 && (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Certified organic farms</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Chemical-free cultivation</span>
                        </div>
                      </>
                    )}
                    
                    {index === 1 && (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Wood pressing for oils</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Stone grinding for spices</span>
                        </div>
                      </>
                    )}
                    
                    {index === 2 && (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Purity certification</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Taste authentication</span>
                        </div>
                      </>
                    )}
                    
                    {index === 3 && (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Eco-friendly packaging</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Icon name="Check" size={16} className="text-accent" />
                          <span className="font-body text-muted-foreground">Temperature controlled delivery</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-white">
            <h3 className="font-heading text-3xl font-bold mb-4">
              Experience the Traditional Difference
            </h3>
            <p className="font-body text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust Sanatana Parampare for authentic, pure, and traditional food products.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/product-collection-grid"
                className="bg-white text-primary hover:bg-green-50 px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Shop Our Products
              </Link>
              
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300"
              >
                Learn Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraditionalProcessSection;