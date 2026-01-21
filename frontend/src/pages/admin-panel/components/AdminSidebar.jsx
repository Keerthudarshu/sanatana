
import React from 'react';
import { X, LayoutDashboard, Package, Users, ShoppingCart, Settings, MessageSquare } from 'lucide-react';
import { API_CONFIG } from '../../../config/apiConfig';

const AdminSidebar = ({ activeSection, onSectionChange, isOpen, onClose }) => {
  const [inquiryCount, setInquiryCount] = React.useState(0);

  React.useEffect(() => {
    const fetchInquiryCount = async () => {
      try {
        const response = await fetch('${API_CONFIG.BASE_URL}/api/contact/unread-count');
        if (response.ok) {
          const count = await response.json();
          setInquiryCount(count);
        }
      } catch (error) {
        console.error('Error fetching inquiry count:', error);
      }
    };
    fetchInquiryCount();
    const interval = setInterval(fetchInquiryCount, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & analytics'
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      description: 'Manage products'
    },
    {
      id: 'update-product-image',
      label: 'Update Product Image',
      icon: Package,
      description: 'Edit product images'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'Manage customers'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      description: 'Order management'
    },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: MessageSquare,
      description: 'Customer messages',
      badge: inquiryCount > 0 ? inquiryCount : null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'App settings'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-foreground">
              Admin Panel
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-muted rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                  ${activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon size={20} />
                <div className="flex-1">
                  <div className="font-body font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
                {item.badge && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-accent text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
