import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      date: '2 weeks ago',
      product: 'Cold Pressed Coconut Oil',
      review: 'Best quality coconut oil I\'ve ever used! Pure, chemical-free and authentic taste. Will definitely order again.',
      verified: true,
      helpful: 24,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Chennai',
      rating: 5,
      date: '1 month ago',
      product: 'Traditional Sambar Powder',
      review: 'Reminds me of my grandmother\'s homemade masala. Excellent blend of spices and very aromatic. Fast delivery too!',
      verified: true,
      helpful: 18,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Meera Patel',
      location: 'Mumbai',
      rating: 4,
      date: '3 weeks ago',
      product: 'Pure A2 Cow Ghee',
      review: 'Authentic ghee with amazing aroma and taste. Great for cooking and very pure. Packaging was excellent.',
      verified: true,
      helpful: 15,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Anil Reddy',
      location: 'Hyderabad',
      rating: 5,
      date: '1 week ago',
      product: 'Mango Pickle',
      review: 'Outstanding taste! Exactly like homemade pickle. Fresh ingredients and perfect spice balance. Highly recommended!',
      verified: true,
      helpful: 12,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: 'Users' },
    { label: 'Average Rating', value: '4.8/5', icon: 'Star' },
    { label: 'Repeat Orders', value: '85%', icon: 'Repeat' },
    { label: 'Delivery Success', value: '99%', icon: 'Truck' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">
            What Our Customers Say
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Real reviews from satisfied customers who love our authentic products
          </p>
          
          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name={stat.icon} size={24} className="text-primary" />
                </div>
                <div className="font-heading text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-semibold text-foreground">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                          <Icon name="ShieldCheck" size={12} />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={12} />
                      <span>{review.location}</span>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={16}
                      className={`${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="ShoppingBag" size={16} className="text-primary" />
                  <span className="font-medium text-primary text-sm">
                    Purchased: {review.product}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="font-body text-foreground mb-4 leading-relaxed">
                "{review.review}"
              </p>

              {/* Review Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Icon name="ThumbsUp" size={16} />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
                
                <button className="text-primary hover:text-accent transition-colors duration-300 text-sm font-medium">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Review CTA */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-heading text-2xl font-bold text-primary mb-4">
              Share Your Experience
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              We'd love to hear about your experience with our products. Your review helps other customers make informed choices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2 justify-center">
                <Icon name="Edit3" size={20} />
                Write a Review
              </button>
              
              <button className="border border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors duration-300 flex items-center gap-2 justify-center">
                <Icon name="MessageCircle" size={20} />
                View All Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: 'ShieldCheck',
              title: 'Quality Assured',
              desc: 'Lab tested products'
            },
            {
              icon: 'Truck',
              title: 'Fast Delivery',
              desc: 'Within 2-5 days'
            },
            {
              icon: 'RotateCcw',
              title: 'Easy Returns',
              desc: '7-day return policy'
            },
            {
              icon: 'Headphones',
              title: '24/7 Support',
              desc: 'Always here to help'
            }
          ].map((badge, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name={badge.icon} size={24} className="text-primary" />
              </div>
              <h4 className="font-heading font-semibold text-foreground text-sm mb-1">
                {badge.title}
              </h4>
              <p className="font-body text-xs text-muted-foreground">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;