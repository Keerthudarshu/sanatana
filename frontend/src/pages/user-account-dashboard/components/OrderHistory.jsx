import React, { useState, useEffect } from 'react';
import OrderTrackingDetails from './OrderTrackingDetails';
import { jsonDb } from '../../../lib/jsonDb';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { downloadInvoice, printInvoice } from '../../../utils/invoiceGenerator';
import orderApi from '../../../services/orderApi';
import dataService from '../../../services/dataService';
import apiClient from '../../../services/api';
import { resolveImageUrl } from '../../../lib/resolveImageUrl';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingInvoice, setProcessingInvoice] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch user orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setLoading(true);
      setError(null);
      try {
        const userOrders = await orderApi.getUserOrders(user.email);
        // For each order item, if weightValue/unit missing, fetch from product/variant
        const db = jsonDb;
        const normalized = await Promise.all((userOrders || []).map(async (order) => {
          const items = await Promise.all((order?.items || []).map(async (item) => {
            let weightValue = item.weightValue;
            let weightUnit = item.weightUnit;
            // If missing, try to fetch from product/variant
            if ((!weightValue || !weightUnit) && item.productId && item.variantId) {
              try {
                const product = await db.getProductById(item.productId);
                const variant = product?.variants?.find(v => v.id === item.variantId || v._id === item.variantId);
                if (variant) {
                  weightValue = variant.weightValue || variant.weight || '';
                  weightUnit = variant.weightUnit || variant.unit || '';
                }
              } catch {}
            }
            const resolved = resolveImageUrl(item?.productImage || item?.image || item?.imageUrl || '');
            return { ...item, productImage: resolved, weightValue, weightUnit };
          }));
          return { ...order, items };
        }));
        setOrders(normalized);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const filteredOrders = filterStatus === 'all' 
    ? (Array.isArray(orders) ? orders : [])
    : (Array.isArray(orders) ? orders.filter(order => order?.status === filterStatus) : []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'shipped':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDownloadInvoice = async (order) => {
    setProcessingInvoice(`download-${order.id}`);
    try {
      // Enhanced company settings
      const settings = {
        siteName: "sanathana-parampara",
        companyAddress: "Natural & Organic Products Hub, Bangalore, India",
        companyPhone: "+91 7892783668",
        companyEmail: "info@sanathana-parampara.com"
      };
      
      // Enhanced customer data mapping with better fallbacks
      const customer = {
        name: order.shipping?.name || order.customerName || user?.name || 'Valued Customer',
        email: order.customerEmail || user?.email || 'N/A',
        phone: order.shipping?.phone || order.customerPhone || user?.phone || 'N/A'
      };
      
      // Enhanced order data with proper formatting matching backend structure
      const enhancedOrder = {
        ...order,
        orderNumber: order.orderNumber || `NN-${new Date().getFullYear()}-${String(order.id).padStart(3, '0')}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: order.items || order.orderItems || [],
        subtotal: order.subtotal || 0,
        shippingFee: order.shippingFee || 0,
        discount: order.discount || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'Not specified',
        status: order.status || 'pending',
        shipping: order.shipping || {
          name: customer.name,
          phone: customer.phone,
          street: 'Address not provided',
          city: 'N/A',
          state: 'N/A',
          pincode: 'N/A'
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for UX
      downloadInvoice(enhancedOrder, customer, settings);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setProcessingInvoice(null);
    }
  };

  const handlePrintInvoice = async (order) => {
    setProcessingInvoice(`print-${order.id}`);
    try {
      // Enhanced company settings
      const settings = {
        siteName: "Sanatana Parampare",
        companyAddress: "Natural & Organic Products Hub, Bangalore, India",
        companyPhone: "+91 7892783668",
        companyEmail: "info@sanatanaparampare.com"
      };
      
      // Enhanced customer data mapping with better fallbacks
      const customer = {
        name: order.shipping?.name || order.customerName || user?.name || 'Valued Customer',
        email: order.customerEmail || user?.email || 'N/A',
        phone: order.shipping?.phone || order.customerPhone || user?.phone || 'N/A'
      };
      
      // Enhanced order data with proper formatting matching backend structure
      const enhancedOrder = {
        ...order,
        orderNumber: order.orderNumber || `NN-${new Date().getFullYear()}-${String(order.id).padStart(3, '0')}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: order.items || order.orderItems || [],
        subtotal: order.subtotal || 0,
        shippingFee: order.shippingFee || 0,
        discount: order.discount || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'Not specified',
        status: order.status || 'pending',
        shipping: order.shipping || {
          name: customer.name,
          phone: customer.phone,
          street: 'Address not provided',
          city: 'N/A',
          state: 'N/A',
          pincode: 'N/A'
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
      printInvoice(enhancedOrder, customer, settings);
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Failed to print invoice. Please try again.');
    } finally {
      setProcessingInvoice(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Order History
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Order History
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Order History
        </h1>
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="font-body text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders?.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-foreground mb-2">
              No orders found
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              {filterStatus === 'all' ? "You haven't placed any orders yet." : `No orders with status"${filterStatus}" found.`
              }
            </p>
            <Button variant="default">
              Start Shopping
            </Button>
          </div>
        ) : (
          filteredOrders?.map((order) => (
            <div key={order?.id} className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-body font-semibold text-foreground">
                        Order #{order?.id}
                      </h3>
                      <p className="font-caption text-sm text-muted-foreground">
                        Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'} • {order?.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-data font-semibold text-foreground">
                        ₹{order?.total?.toFixed(2)}
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-caption font-medium border ${getStatusColor(order?.status)}`}>
                        {order?.status}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleOrderExpansion(order?.id)}
                      className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
                    >
                      <Icon 
                        name={expandedOrder === order?.id ? "ChevronUp" : "ChevronDown"} 
                        size={20} 
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order?.id && (
                <OrderTrackingDetails order={order} processingInvoice={processingInvoice} handleDownloadInvoice={handleDownloadInvoice} handlePrintInvoice={handlePrintInvoice} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;