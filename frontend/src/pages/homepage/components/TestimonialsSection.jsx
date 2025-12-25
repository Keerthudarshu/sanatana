import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Bangalore, Karnataka',
      rating: 5,
      text: 'The wood-pressed coconut oil from Sanatana Parampare has transformed our cooking. The authentic taste and aroma remind me of my grandmother\'s kitchen. Pure quality!',
      product: 'Wood Pressed Coconut Oil',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      text: 'Their sambar powder is exactly how my mother used to make it. The spice blend is perfect, and you can taste the authenticity in every grain. Highly recommended!',
      product: 'Traditional Sambar Powder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Meera Patel',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      text: 'The mango pickle is absolutely divine! It tastes just like the one my grandmother made. Chemical-free, pure ingredients, and delivered fresh to my doorstep.',
      product: 'Traditional Mango Pickle',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Arjun Reddy',
      location: 'Hyderabad, Telangana',
      rating: 5,
      text: 'The pure ghee is exceptional! You can smell the richness and feel the quality. Perfect for our traditional cooking and festivals. Worth every rupee!',
      product: 'Pure Traditional Ghee',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Lakshmi Iyer',
      location: 'Kochi, Kerala',
      rating: 5,
      text: 'Their sesame oil is the best I\'ve ever used. Cold-pressed, pure, and retains all the natural goodness. My family loves the authentic taste it brings to our food.',
      product: 'Wood Pressed Sesame Oil',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face'
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-primary mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real stories from families who have experienced the authentic taste of traditional Indian foods.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={24} className="text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-body text-xl md:text-2xl text-foreground leading-relaxed mb-8 italic">
                "{testimonials[activeTestimonial].text}"
              </blockquote>

              {/* Product Tag */}
              <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Icon name="Package" size={16} className="inline mr-2" />
                {testimonials[activeTestimonial].product}
              </div>

              {/* Customer Info */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="text-left">
                  <div className="font-heading font-bold text-lg text-foreground">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="font-body text-muted-foreground flex items-center">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {testimonials[activeTestimonial].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="bg-white hover:bg-primary hover:text-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 border border-primary/20"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="bg-white hover:bg-primary hover:text-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 border border-primary/20"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'bg-primary w-8' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-border">
            <Icon name="Shield" size={32} className="text-primary mx-auto mb-3" />
            <div className="font-heading font-semibold text-sm text-foreground">Certified Pure</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-border">
            <Icon name="Truck" size={32} className="text-primary mx-auto mb-3" />
            <div className="font-heading font-semibold text-sm text-foreground">Fast Delivery</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-border">
            <Icon name="Leaf" size={32} className="text-primary mx-auto mb-3" />
            <div className="font-heading font-semibold text-sm text-foreground">100% Natural</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-border">
            <Icon name="Heart" size={32} className="text-primary mx-auto mb-3" />
            <div className="font-heading font-semibold text-sm text-foreground">Made with Love</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;