// Invoice generator utility
export const generateInvoice = (order, user, settings = {}) => {
    const siteName = settings.siteName || "Deepus";
    const brandEmail = settings.email || "support@sanatanaparampara.com";
    const brandPhone = settings.phone || "+91 9845651468";
    const brandAddress = settings.address || "Bengaluru, India";

    // Resolve logo so it works in the new window/print context
    const resolveLogo = () => {
        if (settings.logoUrl) return settings.logoUrl;
        if (settings.logoPath) {
            if (typeof window !== "undefined" && settings.logoPath.startsWith("/")) {
                return `${window.location.origin}${settings.logoPath}`;
            }
            return settings.logoPath;
        }
        if (typeof window !== "undefined") {
            return `${window.location.origin}/assets/images/logo.png`;
        }
        return "/assets/images/logo.png";
    };
    const logoPath = resolveLogo();

    const now = new Date();
    const issueDate = order.createdAt ? new Date(order.createdAt) : now;
    const dueDate = order.dueDate ? new Date(order.dueDate) : new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const formatDate = (d) => d.toLocaleDateString("en-IN");

    const invoiceNumber = order.orderNumber || order.orderId || "N/A";
    const currency = settings.currency || "₹";

    const safeItems = (order.items || order.orderItems || []).map((item) => {
        const name = item.product?.name || item.name || item.productName || item.title || "Item";
        const variant = item.variant || item.variantColor || "";
        const size = item.variantSize || "";
        const variantInfo = [variant, size].filter(Boolean).join(" • Size: ");
        // Add weight value/unit to name
        const weightInfo = item.weightValue ? ` (${item.weightValue}${item.weightUnit || ''})` : '';
        const fullName = variantInfo ? `${name}${weightInfo} (${variantInfo})` : `${name}${weightInfo}`;
        const price = parseFloat(item.price || item.unitPrice || 0);
        const qty = parseInt(item.quantity || 1, 10) || 1;
        const total = price * qty;
        return { name: fullName, price, qty, total };
    });

    const subtotal = parseFloat(order.subtotal || safeItems.reduce((s, i) => s + i.total, 0) || 0);
    const shipping = parseFloat(order.shippingFee || 0);
    const discount = parseFloat(order.discount || 0);
    const tax = parseFloat(order.tax || 0);
    const grandTotal = parseFloat(order.total || subtotal + shipping + tax - discount);

    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${invoiceNumber}</title>
    <style>
        body {
            margin: 0;
            font-family: "Helvetica Neue", Arial, sans-serif;
            background: #f4f6f8;
            color: #1f2a36;
        }
        .page {
            max-width: 900px;
            margin: 20px auto;
            background: #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-radius: 6px;
            overflow: hidden;
        }
        .topbar {
            background: #3c4550;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            padding: 28px 32px;
            align-items: center;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .brand img {
            width: 70px;
            height: 70px;
            object-fit: contain;
            background: #ffffff;
            border-radius: 4px;
            padding: 6px;
        }
        .brand h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 0.5px;
        }
        .contact {
            text-align: right;
            font-size: 13px;
            line-height: 1.5;
        }
        .title {
            padding: 22px 32px 8px;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 1px;
            color: #555;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            background: #f0f2f5;
            padding: 12px 32px;
            border-top: 1px solid #d8dde3;
            border-bottom: 1px solid #d8dde3;
            font-size: 13px;
        }
        .meta-grid div strong {
            display: block;
            color: #555;
            margin-bottom: 2px;
        }
        .party-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            padding: 18px 32px 10px;
            gap: 18px;
            font-size: 13px;
        }
        .card {
            border: 1px solid #e1e6ec;
            border-radius: 4px;
            padding: 12px;
            background: #fafbfc;
            min-height: 90px;
        }
        .card strong {
            display: block;
            margin-bottom: 6px;
            color: #3c4550;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }
        thead {
            background: #f0f2f5;
            color: #4a5561;
        }
        th, td {
            padding: 12px 14px;
            text-align: left;
            border-bottom: 1px solid #e6ebf1;
            font-size: 13px;
        }
        th:nth-child(2), td:nth-child(2) { text-align: center; }
        th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4) {
            text-align: right;
            white-space: nowrap;
        }
        .summary {
            padding: 10px 32px 28px;
            display: flex;
            justify-content: flex-end;
        }
        .totals {
            width: 320px;
            border: 1px solid #e1e6ec;
            border-radius: 4px;
            overflow: hidden;
            background: #fafbfc;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 14px;
            border-bottom: 1px solid #e1e6ec;
            font-size: 13px;
        }
        .totals-row.total {
            background: #3c4550;
            color: #ffffff;
            font-weight: 700;
            font-size: 15px;
            letter-spacing: 0.4px;
        }
        .notes {
            padding: 0 32px 24px;
            font-size: 12px;
            color: #586470;
            line-height: 1.5;
        }
        .footer {
            padding: 16px 32px 24px;
            font-size: 12px;
            color: #6b7683;
            border-top: 1px solid #e1e6ec;
            background: #f8f9fb;
            text-align: center;
        }
        @media print {
            body { background: white; }
            .page { box-shadow: none; margin: 0; border: none; }
            .topbar { border-radius: 0; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="topbar">
            <div class="brand">
                <img src="${logoPath}" alt="${siteName} Logo">
                <div>
                    <h1>${siteName}</h1>
                    <div style="font-size:12px;opacity:0.8;">${brandAddress}</div>
                </div>
            </div>
            <div class="contact">
                <div><strong>Invoice</strong></div>
                <div>${brandEmail}</div>
                <div>${brandPhone}</div>
            </div>
        </div>

        <div class="title">TAX INVOICE</div>
        <div class="meta-grid">
            <div><strong>INVOICE NO.</strong>${invoiceNumber}</div>
            <div><strong>ISSUE DATE</strong>${formatDate(issueDate)}</div>
            <div><strong>DUE DATE</strong>${formatDate(dueDate)}</div>
        </div>

        <div class="party-row">
            <div class="card">
                <strong>FROM</strong>
                <div>${siteName}</div>
                <div>${brandAddress}</div>
                <div>${brandEmail}</div>
                <div>${brandPhone}</div>
            </div>
            <div class="card">
                <strong>TO</strong>
                <div>${order.customerName || user.name || "Customer"}</div>
                <div>${order.shipping?.street || order.customerAddress || ""}</div>
                <div>${order.shipping?.city || ""} ${order.shipping?.state || ""} ${order.shipping?.pincode || ""}</div>
                <div>${order.customerEmail || user.email || ""}</div>
                <div>${order.customerPhone || user.phone || ""}</div>
            </div>
        </div>

        <div style="padding: 6px 32px 16px;">
            <table>
                <thead>
                    <tr>
                        <th style="width:50%">DESCRIPTION</th>
                        <th style="width:15%">QUANTITY</th>
                        <th style="width:17%">UNIT PRICE</th>
                        <th style="width:18%">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    ${safeItems.length ? safeItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>${currency}${item.price.toFixed(2)}</td>
                            <td>${currency}${item.total.toFixed(2)}</td>
                        </tr>`).join("") : '<tr><td colspan="4" style="text-align:center;color:#8592a3;">No items found</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="summary">
            <div class="totals">
                <div class="totals-row"><span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span></div>
                <div class="totals-row"><span>Shipping</span><span>${shipping === 0 ? "Free" : `${currency}${shipping.toFixed(2)}`}</span></div>
                ${discount > 0 ? `<div class="totals-row"><span>Discount</span><span>- ${currency}${discount.toFixed(2)}</span></div>` : ""}
                ${tax > 0 ? `<div class="totals-row"><span>Tax</span><span>${currency}${tax.toFixed(2)}</span></div>` : ""}
                <div class="totals-row total"><span>Total Due</span><span>${currency}${grandTotal.toFixed(2)}</span></div>
            </div>
        </div>

        <div class="notes">
            <div><strong>Payment Method:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "Not specified"}</div>
            <div><strong>Order Status:</strong> ${order.status || "Pending"}</div>
            <div style="margin-top:8px;">Thank you for your order. Please contact us for any clarification.</div>
        </div>

        <div class="footer">
            This is a computer-generated invoice. No signature required.
        </div>
    </div>
</body>
</html>`;

    return invoiceHTML;
};

export const downloadInvoice = (order, user, settings = {}) => {
  const invoiceHTML = generateInvoice(order, user, settings);
  
  // Create a more professional filename
  const orderNumber = order.orderNumber || `NN-${new Date().getFullYear()}-${String(order.id || order.orderId).padStart(3, '0')}`;
  const customerName = (order.customerName || user.name || 'Customer').replace(/[^a-z0-9]/gi, '_');
  const filename = `Invoice_${orderNumber}_${customerName}.html`;
  
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const printInvoice = (order, user, settings = {}) => {
  const invoiceHTML = generateInvoice(order, user, settings);
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      
      // Close window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  } else {
    alert('Please allow pop-ups to print the invoice.');
  }
};