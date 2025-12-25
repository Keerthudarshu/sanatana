import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'ingredients', label: 'Ingredients', icon: 'List' },
    { id: 'benefits', label: 'Benefits', icon: 'Star' },
    { id: 'shipping', label: 'Shipping', icon: 'Truck' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center gap-2 px-4 py-3 font-body font-medium transition-colors duration-200 border-b-2 ${
              activeTab === tab?.id
                ? 'text-primary border-primary' :'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Product Description
            </h3>
            <div className="font-body text-muted-foreground space-y-3">
              <div className="whitespace-pre-line">
                {product?.description || 'No description available.'}
              </div>
              {product?.features && product?.features.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium text-foreground">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {product?.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Ingredients
            </h3>
            <div className="space-y-3">
              {product?.ingredients?.primary && product?.ingredients?.primary.length > 0 ? (
                <div>
                  <h4 className="font-body font-medium text-foreground mb-2">
                    Ingredients:
                  </h4>
                  <ul className="space-y-1">
                    {product?.ingredients?.primary?.map((ingredient, index) => (
                      <li key={index} className="font-caption text-sm text-muted-foreground">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="font-body text-muted-foreground">
                  Ingredient information not available.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Benefits
            </h3>
            <div className="space-y-3">
              {product?.benefits && product?.benefits.length > 0 ? (
                <ul className="space-y-2">
                  {product?.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="font-body text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-body text-muted-foreground">
                  Benefit information not available.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Shipping Information
            </h3>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="font-body font-medium text-foreground">
                    Bengaluru
                  </span>
                </div>
                <p className="font-caption text-sm text-muted-foreground">
                  Free shipping on orders above ₹499
                </p>
                <p className="font-caption text-sm text-muted-foreground">
                  Delivery in 1-2 business days
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} className="text-secondary" />
                  <span className="font-body font-medium text-foreground">
                    Other Cities
                  </span>
                </div>
                <p className="font-caption text-sm text-muted-foreground">
                  Free shipping on orders above ₹999
                </p>
                <p className="font-caption text-sm text-muted-foreground">
                  Delivery in 3-5 business days
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="font-caption text-sm text-success font-medium">
                  Cash on Delivery Available
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;