
import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, Download, Printer, AlertCircle } from 'lucide-react';
import orderApi from '../../../services/orderApi';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { downloadInvoice, printInvoice } from '../../../utils/invoiceGenerator';

const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingInvoice, setProcessingInvoice] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const allOrders = await orderApi.getAllOrders();
      setOrders(allOrders || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
      order.shipping?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    // Date filter (YYYY-MM-DD)
    const orderDate = order.createdAt ? new Date(order.createdAt) : null;
    let matchesDate = true;
    if (dateFilter && orderDate) {
      const filterDate = new Date(dateFilter);
      matchesDate = orderDate.toDateString() === filterDate.toDateString();
    }
    // Month filter (YYYY-MM)
    let matchesMonth = true;
    if (monthFilter && orderDate) {
      const [filterYear, filterMonth] = monthFilter.split('-');
      matchesMonth = orderDate.getFullYear() === parseInt(filterYear) && (orderDate.getMonth() + 1) === parseInt(filterMonth);
    }
    return matchesSearch && matchesStatus && matchesDate && matchesMonth;
  }) : [];

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      // Reload orders to get updated data
      loadOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status: ' + (err.message || 'Unknown error'));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4 text-warning" />;
      case 'processing':
        return <Package className="w-4 h-4 text-primary" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-primary" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'processing':
        return 'text-blue-800 bg-blue-100';
      case 'shipped':
        return 'text-indigo-800 bg-indigo-100';
      case 'delivered':
        return 'text-green-800 bg-green-100';
      case 'cancelled':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
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
        name: order.shipping?.name || order.customerName || order.user?.name || 'Valued Customer',
        email: order.customerEmail || order.user?.email || order.shipping?.email || 'N/A',
        phone: order.shipping?.phone || order.customerPhone || order.user?.phone || 'N/A'
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
        siteName: "sanathana-parampara",
        companyAddress: "Natural & Organic Products Hub, Bangalore, India",
        companyPhone: "+91 7892783668",
        companyEmail: "info@sanathana-parampara.com"
      };
      
      // Enhanced customer data mapping with better fallbacks
      const customer = {
        name: order.shipping?.name || order.customerName || order.user?.name || 'Valued Customer',
        email: order.customerEmail || order.user?.email || order.shipping?.email || 'N/A',
        phone: order.shipping?.phone || order.customerPhone || order.user?.phone || 'N/A'
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={loadOrders}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search by order ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48 min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="sm:w-48 min-w-[150px]">
              <Input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                placeholder="Filter by date"
              />
            </div>
            <div className="sm:w-48 min-w-[150px]">
              <Input
                type="month"
                value={monthFilter}
                onChange={e => setMonthFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                placeholder="Filter by month"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-foreground">#{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items?.length || 0} item(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {order.shipping?.name || order.user?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.user?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">₹{order.total?.toFixed(2) || '0.00'}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {order.paymentMethod || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Eye icon button to view order details */}
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1 transition-colors text-primary hover:text-primary/80"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-border bg-background"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={processingInvoice === `download-${order.id}`}
                          className={`p-1 transition-colors ${
                            processingInvoice === `download-${order.id}`
                              ? 'text-muted-foreground cursor-not-allowed'
                              : 'text-primary hover:text-primary/80'
                          }`}
                          title="Download Invoice"
                        >
                          {processingInvoice === `download-${order.id}` ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(order)}
                          disabled={processingInvoice === `print-${order.id}`}
                          className={`p-1 transition-colors ${
                            processingInvoice === `print-${order.id}`
                              ? 'text-muted-foreground cursor-not-allowed'
                              : 'text-primary hover:text-primary/80'
                          }`}
                          title="Print Invoice"
                        >
                          {processingInvoice === `print-${order.id}` ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <Printer className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={handleCloseOrderDetails}>&times;</button>
            <h2 className="text-xl font-bold mb-2">Order #{selectedOrder.id}</h2>
            <div className="mb-4 text-sm text-gray-700">Placed on: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</div>
            <div className="mb-4">
              <div><strong>Customer:</strong> {selectedOrder.shipping?.name || selectedOrder.customerName || selectedOrder.user?.name || 'N/A'}</div>
              <div><strong>Email:</strong> {selectedOrder.customerEmail || selectedOrder.user?.email || 'N/A'}</div>
              <div><strong>Phone:</strong> {selectedOrder.shipping?.phone || selectedOrder.customerPhone || selectedOrder.user?.phone || 'N/A'}</div>
              <div><strong>Status:</strong> <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{selectedOrder.status}</span></div>
              <div><strong>Payment:</strong> {selectedOrder.paymentMethod || 'N/A'}</div>
              <div><strong>Total:</strong> ₹{selectedOrder.total?.toFixed(2)}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items</h3>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Weight</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || selectedOrder.orderItems || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">{item.productName || item.name || item.product?.name || 'Item'}</td>
                      <td className="p-2">{item.weightValue ? `${item.weightValue}${item.weightUnit || ''}` : '-'}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">₹{item.price?.toFixed(2)}</td>
                      <td className="p-2">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Shipping Details</h3>
              <div><strong>Address:</strong> {selectedOrder.shipping?.street || 'N/A'}, {selectedOrder.shipping?.city || ''}, {selectedOrder.shipping?.state || ''}, {selectedOrder.shipping?.pincode || ''}</div>
              <div><strong>Landmark:</strong> {selectedOrder.shipping?.landmark || 'N/A'}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Price Breakdown</h3>
              <div>Subtotal: ₹{selectedOrder.subtotal?.toFixed(2)}</div>
              <div>Shipping Fee: ₹{selectedOrder.shippingFee?.toFixed(2) || '0.00'}</div>
              {selectedOrder.discount > 0 && (<div>Discount: -₹{selectedOrder.discount?.toFixed(2)}</div>)}
              {selectedOrder.tax > 0 && (<div>Tax: ₹{selectedOrder.tax?.toFixed(2)}</div>)}
              <div className="font-bold">Total: ₹{selectedOrder.total?.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagement;
