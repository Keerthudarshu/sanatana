import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { API_CONFIG } from '../../config/apiConfig';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const contactInfo = {
    phone: "+91 80 4567 8901",
    whatsapp: "+91 98765 43210",
    email: "hello@sanatanaparampare.com",
    supportEmail: "support@sanatanaparampare.com",
    address: "123 MG Road, Bengaluru, Karnataka 560001"
  };

  const businessHours = [
    { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { days: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { days: 'Sunday', hours: 'Closed' }
  ];

  const supportChannels = [
    {
      icon: 'Phone',
      title: 'Call Us',
      description: 'Speak directly with our team',
      contact: contactInfo.phone,
      action: `tel:${contactInfo.phone}`,
      available: 'Mon-Fri, 9 AM - 6 PM'
    },
    {
      icon: 'MessageCircle',
      title: 'WhatsApp',
      description: 'Quick support via WhatsApp',
      contact: contactInfo.whatsapp,
      action: `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`,
      available: '24/7 Available'
    },
    {
      icon: 'Mail',
      title: 'Email Support',
      description: 'Detailed queries and feedback',
      contact: contactInfo.supportEmail,
      action: `mailto:${contactInfo.supportEmail}`,
      available: 'Response within 24 hours'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 1. Save to database via Java backend
      const dbResponse = await fetch('${API_CONFIG.BASE_URL}/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!dbResponse.ok) throw new Error('Failed to save inquiry to database');

      // 2. Send thank you email via Node.js email service
      try {
        await fetch('${API_CONFIG.BASE_URL}/api/send-contact-thankyou', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email
          })
        });
      } catch (emailErr) {
        console.error('Failed to send thank you email:', emailErr);
        // We don't fail the whole process if only email fails
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <>
      <Helmet>
        <title>Contact Us - Sanatana Parampare | Get in Touch for Traditional Food Products</title>
        <meta name="description" content="Contact Sanatana Parampare for queries about traditional Indian food products. Call, WhatsApp, or email us. Located in Bengaluru with nationwide delivery." />
        <meta name="keywords" content="contact sanatana parampare, customer support, traditional food queries, bengaluru location, whatsapp support, email contact" />
        <meta property="og:title" content="Contact Sanatana Parampare - Traditional Food Products Support" />
        <meta property="og:description" content="Get in touch with Sanatana Parampare for all your traditional food product needs. Multiple contact options available." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://sanatanaparampare.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-6">
          <div className="container mx-auto px-4">
            <Breadcrumb customItems={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
                Get in Touch
              </h1>
              <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Have questions about our traditional food products? Need help with your order?
                Our dedicated team is here to assist you with all your queries.
              </p>
            </div>
          </section>

          {/* Contact Options Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-6">
                  Multiple Ways to Reach Us
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {supportChannels.map((channel, index) => (
                  <div key={index} className="bg-white border border-border rounded-xl shadow-lg p-8 text-center group hover:shadow-2xl transition-all duration-300">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon name={channel.icon} size={24} />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-primary mb-3">
                      {channel.title}
                    </h3>
                    <p className="font-body text-muted-foreground mb-4">
                      {channel.description}
                    </p>
                    <p className="font-body font-semibold text-foreground mb-3">
                      {channel.contact}
                    </p>
                    <p className="font-body text-sm text-accent mb-6">
                      {channel.available}
                    </p>
                    <Link
                      to={channel.action}
                      className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-heading font-semibold text-sm transition-all duration-300"
                    >
                      Contact Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form & Info Section */}
          <section className="py-16 bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                    Send us a Message
                  </h2>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle" size={20} />
                        <span className="font-medium">Message sent successfully! We'll get back to you within 24 hours.</span>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                      <div className="flex items-center gap-2">
                        <Icon name="AlertCircle" size={20} />
                        <span className="font-medium">Failed to send message. Please try again or contact us directly.</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                      <Input
                        label="Subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="block font-heading font-medium text-foreground mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                        placeholder="Tell us about your query, feedback, or how we can assist you..."
                        required
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Sending Message...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </div>

                {/* Business Information */}
                <div className="space-y-8">
                  {/* Address & Hours */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                      Visit Our Store
                    </h3>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <Icon name="MapPin" size={24} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-heading font-semibold text-foreground mb-2">Address</h4>
                          <p className="font-body text-muted-foreground leading-relaxed">
                            {contactInfo.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Icon name="Clock" size={24} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-heading font-semibold text-foreground mb-3">Business Hours</h4>
                          <div className="space-y-2">
                            {businessHours.map((schedule, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="font-body text-muted-foreground">{schedule.days}</span>
                                <span className="font-body font-medium text-foreground">{schedule.hours}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Icon name="MapPin" size={32} className="text-primary mx-auto mb-2" />
                        <p className="font-body text-muted-foreground">Interactive Map</p>
                        <p className="font-body text-sm text-muted-foreground">Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Quick Links */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                      Quick Help
                    </h3>

                    <div className="space-y-4">
                      <div className="border-l-4 border-accent pl-4">
                        <h4 className="font-heading font-semibold text-foreground mb-2">Shipping Information</h4>
                        <p className="font-body text-muted-foreground text-sm">
                          Free shipping above ₹499. Delivery within 2-5 business days.
                        </p>
                      </div>

                      <div className="border-l-4 border-accent pl-4">
                        <h4 className="font-heading font-semibold text-foreground mb-2">Return Policy</h4>
                        <p className="font-body text-muted-foreground text-sm">
                          Easy returns within 7 days of delivery for unopened products.
                        </p>
                      </div>

                      <div className="border-l-4 border-accent pl-4">
                        <h4 className="font-heading font-semibold text-foreground mb-2">Product Questions</h4>
                        <p className="font-body text-muted-foreground text-sm">
                          Need details about ingredients or traditional processes? We're here to help.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                Ready to Experience Traditional Flavors?
              </h2>
              <p className="font-body text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Join thousands of satisfied customers who trust Sanatana Parampare for authentic,
                pure, and traditional food products.
              </p>
              <Link
                to="/product-collection-grid"
                className="inline-block bg-white text-primary hover:bg-green-50 px-10 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;