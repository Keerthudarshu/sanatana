import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const popularSearches = [
    "Organic Spices", "Handmade Sweets", "Traditional Pickles", "Pure Ghee",
    "Coconut Oil", "Mango Pickle", "Mysore Pak", "Sambar Powder",
    "Cashew Mix", "Natural Honey", "Sesame Oil", "Turmeric Powder"
  ];

  const footerLinks = {
    company: [
      { label: "About Us", path: "/about" },
      { label: "Our Story", path: "/our-story" },
      { label: "Blog", path: "/blog" },
      { label: "Careers", path: "/careers" }
    ],
    customer: [
      { label: "My Account", path: "/user-account-dashboard" },
      { label: "Order History", path: "/user-account-dashboard?tab=orders" },
      { label: "Track Order", path: "/track-order" },
      { label: "Help & Support", path: "/support" }
    ],
    policies: [
      { label: "Shipping Policy", path: "/shipping-policy" },
      { label: "Return Policy", path: "/return-policy" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms-of-service" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com/sanatanaparampare" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com/sanatanaparampare" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com/sanatanaparampare" },
    { name: "YouTube", icon: "Youtube", url: "https://youtube.com/sanatanaparampare" }
  ];

  const contactInfo = {
    phone: "+91 80 4567 8901",
    whatsapp: "+91 98765 43210",
    email: "hello@sanatanaparampare.com",
    address: "123 MG Road, Bengaluru, Karnataka 560001"
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* Popular Searches Section */}
      <div className="border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches?.map((search, index) => (
              <Link
                key={index}
                to={`/product-collection-grid?search=${encodeURIComponent(search)}`}
                className="bg-muted hover:bg-primary hover:text-primary-foreground px-3 py-1 rounded-full text-sm font-caption transition-colors duration-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/homepage" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Leaf" size={20} color="white" />
                </div>
                <span className="font-heading font-bold text-xl text-foreground">
                  Sanatana Parampare
                </span>
              </Link>
              <p className="font-body text-muted-foreground mb-6 max-w-md">
                Experience the purest traditional foods following ancient wisdom. Handcrafted with love using time-honored recipes and natural ingredients. Discover authentic Indian heritage flavors.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <a 
                    href={`tel:${contactInfo?.phone}`}
                    className="font-body text-sm text-foreground hover:text-primary transition-colors duration-200"
                  >
                    {contactInfo?.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="MessageCircle" size={16} className="text-success" />
                  <a 
                    href={`https://wa.me/${contactInfo?.whatsapp?.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-foreground hover:text-success transition-colors duration-200"
                  >
                    WhatsApp: {contactInfo?.whatsapp}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} className="text-primary" />
                  <a 
                    href={`mailto:${contactInfo?.email}`}
                    className="font-body text-sm text-foreground hover:text-primary transition-colors duration-200"
                  >
                    {contactInfo?.email}
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
                  <span className="font-body text-sm text-muted-foreground">
                    {contactInfo?.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks?.company?.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link?.path}
                      className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Customer Service
              </h4>
              <ul className="space-y-3">
                {footerLinks?.customer?.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link?.path}
                      className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Policies
              </h4>
              <ul className="space-y-3">
                {footerLinks?.policies?.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link?.path}
                      className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="font-caption text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} sanathana-parampara. All rights reserved. Made with ❤️ in India.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="font-caption text-sm text-muted-foreground hidden md:block">
                Follow us:
              </span>
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={`Follow us on ${social?.name}`}
                >
                  <Icon name={social?.icon} size={16} />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="font-caption text-xs text-muted-foreground">
                We accept:
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <span className="font-caption text-xs font-bold">COD</span>
                </div>
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <Icon name="CreditCard" size={12} />
                </div>
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <Icon name="Smartphone" size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;