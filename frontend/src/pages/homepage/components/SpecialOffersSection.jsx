import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SpecialOffersSection = () => {
  const deals = [
    {
      id: 1,
      title: "Buy 2 Get 1 Free",
      subtitle: "Wood Pressed Oils",
      description: "Mix and match any wood pressed oils. Third product absolutely free!",
      discount: "33% OFF",
      validTill: "Limited Time",
      bgImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop",
      ctaText: "Shop Oils",
      ctaLink: "/product-collection-grid?category=wood-pressed-oils&offer=buy2get1",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: 2,
      title: "Spice Bundle Deal",
      subtitle: "Complete Kitchen Set",
      description: "Essential spice powders combo - Sambar, Rasam, Garam Masala & more",
      discount: "₹300 OFF",
      validTill: "This Week Only",
      bgImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop",
      ctaText: "Get Bundle",
      ctaLink: "/product-collection-grid?category=spice-powders&bundle=kitchen-essentials",
      gradient: "from-red-500 to-pink-600"
    },
    {
      id: 3,
      title: "Free Shipping Special",
      subtitle: "No Minimum Order",
      description: "Free delivery on all orders. Use code: FREESHIP. Valid for new customers.",
      discount: "₹0 Delivery",
      validTill: "New Users",
      bgImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      ctaText: "Order Now",
      ctaLink: "/product-collection-grid?offer=free-shipping",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  const quickOffers = [
    { icon: 'Truck', text: 'Free Shipping ₹499+', color: 'text-blue-600' },
    { icon: 'RotateCcw', text: 'Easy Returns', color: 'text-green-600' },
    { icon: 'Shield', text: '100% Authentic', color: 'text-purple-600' },
    { icon: 'Clock', text: 'Same Day Delivery*', color: 'text-orange-600' }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">
            Special Offers & Deals
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Limited time offers on premium products. Save big on your favorite items!
          </p>
        </div>

        {/* Main Deals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className={`relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={deal.bgImage}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${deal.gradient}/90`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 text-white h-80 flex flex-col justify-between">
                <div>
                  {/* Discount Badge */}
                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                    <span className="font-bold text-lg">{deal.discount}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                    {deal.title}
                  </h3>
                  <h4 className="font-heading text-lg font-medium mb-4 text-white/90">
                    {deal.subtitle}
                  </h4>

                  {/* Description */}
                  <p className="font-body text-white/80 mb-4 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Valid Till */}
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Icon name="Clock" size={14} />
                    <span>{deal.validTill}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={deal.ctaLink}
                  className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-300 w-fit group-hover:scale-105"
                >
                  {deal.ctaText}
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Offers Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickOffers.map((offer, index) => (
              <div key={index} className="flex items-center justify-center gap-3 p-4">
                <Icon name={offer.icon} size={24} className={offer.color} />
                <span className="font-body font-medium text-foreground">
                  {offer.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mt-12 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
          <Icon name="Gift" size={48} className="mx-auto mb-4 text-white" />
          <h3 className="font-heading text-2xl font-bold mb-2">
            First Order Discount
          </h3>
          <p className="font-body text-white/90 mb-6 text-lg">
            Get 15% off on your first order. Use coupon code below
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <div className="bg-white/10 border-2 border-white/30 rounded-lg px-6 py-3 backdrop-blur-sm">
              <span className="font-mono text-xl font-bold tracking-wide">FIRST15</span>
            </div>
            <Link
              to="/product-collection-grid"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;