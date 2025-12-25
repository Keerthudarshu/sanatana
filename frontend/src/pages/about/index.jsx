import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';

const AboutPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'About Us', path: '/about' }
  ];

  const coreValues = [
    {
      icon: 'Heart',
      title: 'Purity & Authenticity',
      description: 'Every product follows ancient traditional methods without any chemical additives or preservatives.'
    },
    {
      icon: 'Leaf',
      title: 'Natural Heritage',
      description: 'Preserving age-old recipes and techniques passed down through generations of Indian culinary wisdom.'
    },
    {
      icon: 'Users',
      title: 'Family Trust',
      description: 'Building lasting relationships with families who value quality, tradition, and authentic flavors.'
    },
    {
      icon: 'Award',
      title: 'Quality Promise',
      description: 'Hand-selected ingredients, traditional processing, and rigorous quality checks ensure excellence.'
    }
  ];

  const traditionalProcesses = [
    {
      icon: 'Hammer',
      title: 'Wood Pressing',
      description: 'Oils extracted using traditional wooden presses to preserve natural nutrients and authentic taste.'
    },
    {
      icon: 'Sparkles',
      title: 'Stone Grinding',
      description: 'Spice powders ground using ancient stone mills to maintain essential oils and aromatic compounds.'
    },
    {
      icon: 'Sun',
      title: 'Natural Drying',
      description: 'Sun-drying and traditional preservation methods without artificial chemicals or preservatives.'
    },
    {
      icon: 'Hands',
      title: 'Handcrafted',
      description: 'Pickles, papads, and traditional foods lovingly prepared by skilled artisans following authentic recipes.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Sanatana Parampare | Traditional Indian Food Heritage</title>
        <meta name="description" content="Discover Sanatana Parampare's journey in preserving traditional Indian food heritage. Learn about our commitment to purity, authenticity, and ancient wisdom in every product." />
        <meta name="keywords" content="about sanatana parampare, traditional indian food, authentic recipes, natural products, wood pressed oils, ancient wisdom, heritage foods" />
        <meta property="og:title" content="About Sanatana Parampare - Preserving Traditional Food Heritage" />
        <meta property="og:description" content="Experience the purest traditional foods following ancient Indian wisdom. Handcrafted with love using time-honored recipes and natural ingredients." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://sanatanaparampare.com/about" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-6">
          <div className="container mx-auto px-4">
            <Breadcrumb customItems={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
                    साम्राज्य का पुरातन स्वाद
                    <br />
                    <span className="text-3xl lg:text-4xl text-accent">Sanatana Parampare</span>
                  </h1>
                  <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                    Experience the purest traditional foods following ancient Indian wisdom. 
                    We preserve the timeless culinary heritage through authentic recipes, 
                    natural ingredients, and traditional processing methods that have been 
                    cherished for generations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/product-collection-grid"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 text-center"
                    >
                      Explore Products
                    </Link>
                    <Link
                      to="/contact"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 text-center"
                    >
                      Connect With Us
                    </Link>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop"
                      alt="Traditional Indian Spices"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="font-heading font-bold text-xl mb-2">Traditional Heritage</h3>
                      <p className="font-body text-white/90">Authentic flavors, pure ingredients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-6">
                  Our Heritage Story
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
                <div className="space-y-6 text-left">
                  <p className="font-body text-lg text-muted-foreground leading-relaxed">
                    <strong className="text-primary">Sanatana Parampare</strong> was born from a deep reverence for India's 
                    ancient culinary wisdom. Our journey began with a simple yet profound mission: to preserve and 
                    share the authentic flavors that have nourished generations of Indian families.
                  </p>
                  <p className="font-body text-lg text-muted-foreground leading-relaxed">
                    In an era of mass production and artificial additives, we recognized the urgent need to protect 
                    traditional food preparation methods. Our founders, inspired by ancestral recipes and time-tested 
                    techniques, established a platform where purity meets tradition.
                  </p>
                  <p className="font-body text-lg text-muted-foreground leading-relaxed">
                    Every product in our collection tells a story of heritage, craftsmanship, and unwavering commitment 
                    to quality. From wood-pressed oils extracted using century-old methods to spice powders ground on 
                    traditional stone mills, we ensure that every bite connects you to India's rich culinary legacy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="py-16 bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-6">
                  Our Core Values
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
                <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
                  These fundamental principles guide everything we do, from sourcing ingredients 
                  to delivering the final product to your doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreValues.map((value, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center group hover:shadow-2xl transition-all duration-300">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon name={value.icon} size={24} />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-primary mb-4">
                      {value.title}
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Traditional Processes Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-6">
                  Traditional Methods We Preserve
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
                <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our commitment to authenticity is reflected in the traditional processing methods 
                  we've carefully preserved and continue to practice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {traditionalProcesses.map((process, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex-shrink-0">
                      <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                        <Icon name={process.icon} size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-primary mb-3">
                        {process.title}
                      </h3>
                      <p className="font-body text-muted-foreground leading-relaxed">
                        {process.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quality Promise Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                Our Quality Promise
              </h2>
              <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
              <div className="max-w-4xl mx-auto">
                <p className="font-body text-xl text-white/90 mb-8 leading-relaxed">
                  We pledge to deliver products that honor the trust you place in us. Every item 
                  undergoes rigorous quality checks, and we stand behind the purity and authenticity 
                  of everything we offer.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Icon name="Shield" size={32} className="mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-lg mb-2">100% Pure</h3>
                    <p className="font-body text-white/80">No chemicals, preservatives, or artificial additives</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Icon name="Award" size={32} className="mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-lg mb-2">Quality Tested</h3>
                    <p className="font-body text-white/80">Rigorous testing ensures highest quality standards</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Icon name="Heart" size={32} className="mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-lg mb-2">Made with Love</h3>
                    <p className="font-body text-white/80">Handcrafted with care by skilled artisans</p>
                  </div>
                </div>

                <Link
                  to="/product-collection-grid"
                  className="inline-block bg-white text-primary hover:bg-green-50 px-10 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Experience Our Products
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;