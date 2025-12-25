import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const OrderTrackingDetails = ({ order, processingInvoice, handleDownloadInvoice, handlePrintInvoice }) => {
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  // Use trackingHistory from DB if present, else fallback
  const trackingHistory = Array.isArray(order?.trackingHistory) && order.trackingHistory.length > 0
    ? order.trackingHistory
    : [
        {
          status: 'Order Confirmed',
          date: order?.createdAt,
          details: ['Your Order has been placed.'],
        },
        ...(order?.status === 'delivered' ? [{ status: 'Delivered', date: order?.deliveredAt || order?.updatedAt, details: ['Your item has been delivered.'] }] : []),
      ];

  // For main card, show only the main statuses
  const steps = trackingHistory.map((h, idx) => ({
    key: h.status?.toLowerCase().replace(/\s/g, '-') + '-' + idx,
    label: h.status,
    date: h.date,
  }));

  // For modal, show all details
  const timeline = trackingHistory.map((h) => ({
    label: h.status,
    date: h.date ? (typeof h.date === 'string' && !isNaN(Date.parse(h.date)) ? new Date(h.date).toLocaleString() : h.date) : '',
    details: h.details || [],
  }));
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main left section */}
      <div className="flex-1 space-y-4">
        {/* Tracking info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="mb-2 text-sm text-muted-foreground">
            Order can be tracked by <span className="font-semibold text-foreground">{order?.shipping?.phone || order?.customerPhone || 'N/A'}</span>.<br />
            {order?.trackingNumber && (
              <>Tracking link is shared via SMS.<br /></>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {order?.items?.map((item, idx) => (
              <div key={item?.id || idx} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-border flex items-center justify-center">
                  {item?.productImage ? (
                    <Image src={item.productImage} alt={item.productName || 'Product'} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="Package" size={32} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-body font-medium text-foreground truncate">{item?.productName || 'Product'}</div>
                  <div className="text-xs text-muted-foreground truncate">{item?.weightValue ? `${item.weightValue}${item.weightUnit}` : ''}</div>
                  <div className="text-xs text-muted-foreground">Qty: {item?.quantity || 1}</div>
                </div>
                <div className="font-data font-semibold text-foreground text-lg">₹{item?.price?.toFixed(2) || order?.total?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="mb-2 font-body font-medium text-foreground">Order Status</div>
          <ol className="relative border-l-2 border-primary/30 ml-4">
            {steps.map((step, idx) => (
              <li key={step.key} className="mb-6 ml-2">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white mr-3">
                    <Icon name="CheckCircle" size={18} />
                  </span>
                  <span className="font-body text-foreground">{step.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{step.date ? new Date(step.date).toLocaleDateString() : ''}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-2">
            <button type="button" className="text-primary text-sm font-medium hover:underline" onClick={() => setShowTimelineModal(true)}>
              See All Updates
            </button>
          </div>
        </div>

        {/* Chat/Rating */}
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <Button variant="outline" className="w-full md:w-auto">Chat with us</Button>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="font-body font-medium mb-2">Rate your experience</div>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(star => (
              <span key={star} className="text-2xl text-muted-foreground cursor-pointer">★</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-4">
        {/* Delivery details */}
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="font-body font-medium mb-2">Delivery details</div>
          <div className="text-sm text-foreground">
            <div><Icon name="Home" size={16} className="inline-block mr-1" /> <span className="align-middle">{order?.shipping?.street || 'N/A'}</span></div>
            <div><Icon name="User" size={16} className="inline-block mr-1" /> <span className="align-middle">{order?.shipping?.name || 'N/A'} {order?.shipping?.phone ? `, ${order.shipping.phone}` : ''}</span></div>
          </div>
        </div>
        {/* Price details */}
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="font-body font-medium mb-2">Price details</div>
          <div className="space-y-2 mb-2">
            {order?.items?.map((item, idx) => (
              <div key={item?.id || idx} className="flex flex-col text-sm">
                <div className="flex justify-between">
                  <span>
                    {item?.productName || 'Product'}
                    {item?.weightValue ? `, ${item.weightValue}${item.weightUnit}` : ''} (Qty: {item?.quantity || 1})
                  </span>
                  <span>₹{item?.mrp ? item.mrp.toFixed(2) : item?.price?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm"><span>Shipping fee</span><span>₹{order?.shippingFee?.toFixed(2) || '0'}</span></div>
          <div className="flex justify-between text-sm"><span>Total fees</span><span>₹{order?.fees?.toFixed(2) || '0'}</span></div>
          <div className="flex justify-between text-sm"><span>Other discount</span><span className="text-success">-₹{order?.discount?.toFixed(2) || '0'}</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2"><span>Total amount</span><span>₹{order?.total?.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mt-2"><span>Payment method</span><span className="capitalize">{order?.paymentMethod || 'N/A'}</span></div>
          <Button variant="outline" className="w-full mt-3" onClick={() => handleDownloadInvoice(order)} disabled={processingInvoice === `download-${order.id}`}>{processingInvoice === `download-${order.id}` ? 'Downloading...' : 'Download Invoice'}</Button>
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative overflow-y-auto max-h-[80vh]">
            <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground" onClick={() => setShowTimelineModal(false)}>
              <Icon name="X" size={24} />
            </button>
            <h2 className="font-heading text-lg font-bold mb-4 text-foreground">Order Tracking Updates</h2>
            <ol className="border-l-2 border-primary/30 ml-4">
              {timeline.map((step, idx) => (
                <li key={step.label + '-' + idx} className="mb-8 ml-2">
                  <div className="flex items-center mb-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white mr-3">
                      <Icon name="CheckCircle" size={18} />
                    </span>
                    <span className="font-body text-foreground font-semibold">{step.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{step.date}</span>
                  </div>
                  <ul className="ml-9 text-sm text-muted-foreground space-y-1">
                    {step.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingDetails;