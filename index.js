const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// SendGrid Configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Logo Path
const logoPath = path.join(__dirname, 'frontend', 'public', 'assets', 'images', 'logo.png');
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
    logoBase64 = fs.readFileSync(logoPath).toString('base64');
}

// Function to generate PDF
const generateInvoicePDF = (orderData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData.toString('base64'));
        });

        // Add Logo if exists
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 50 });
        }

        doc.fillColor('#444444')
            .fontSize(20)
            .text('Sanatana Parampare', 110, 57)
            .fontSize(10)
            .text('123, Traditional Street, Heritage City', 200, 65, { align: 'right' })
            .text('Karnataka, India - 560001', 200, 80, { align: 'right' })
            .moveDown();

        doc.fillColor('#000000')
            .fontSize(15)
            .text('INVOICE', 50, 160);

        doc.strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, 185)
            .lineTo(550, 185)
            .stroke();

        doc.fontSize(10)
            .text(`Invoice Number: INV-${orderData.orderId || '0000'}`, 50, 200)
            .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, 215)
            .text(`Customer Email: ${orderData.email}`, 50, 230)
            .moveDown();

        // Table Header
        const tableTop = 270;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Weight', 250, tableTop);
        doc.text('Qty', 350, tableTop);
        doc.text('Price', 400, tableTop);
        doc.text('Total', 480, tableTop);

        doc.moveTo(50, tableTop + 15)
            .lineTo(550, tableTop + 15)
            .stroke();

        // Table Rows
        let position = tableTop + 30;
        doc.font('Helvetica');
        orderData.items.forEach((item) => {
            doc.text(item.name, 50, position);
            doc.text(`${item.weightValue || ''} ${item.weightUnit || ''}`, 250, position);
            doc.text(item.quantity.toString(), 350, position);
            doc.text(`Rs. ${(parseFloat(item.price) || 0).toFixed(2)}`, 400, position);
            doc.text(`Rs. ${(item.quantity * (parseFloat(item.price) || 0)).toFixed(2)}`, 480, position);
            position += 20;
        });

        doc.moveTo(50, position + 5)
            .lineTo(550, position + 5)
            .stroke();

        // Totals
        position += 20;
        doc.text('Subtotal:', 400, position);
        doc.text(`Rs. ${(parseFloat(orderData.subtotal) || 0).toFixed(2)}`, 480, position);

        position += 20;
        doc.text('Shipping:', 400, position);
        doc.text(`Rs. ${(parseFloat(orderData.shippingCost) || 0).toFixed(2)}`, 480, position);

        if (orderData.discountAmount > 0) {
            position += 20;
            doc.text('Discount:', 400, position);
            doc.text(`-Rs. ${(parseFloat(orderData.discountAmount) || 0).toFixed(2)}`, 480, position);
        }

        position += 25;
        doc.font('Helvetica-Bold')
            .fontSize(12)
            .text('Grand Total:', 400, position);
        doc.text(`Rs. ${(parseFloat(orderData.total) || 0).toFixed(2)}`, 480, position);

        doc.end();
    });
};

// Routes
app.post('/api/send-confirmation', async (req, res) => {
    const orderData = req.body;
    console.log('--- New Email Request ---');
    console.log('Payload:', JSON.stringify(orderData, null, 2));

    const { email, items, subtotal, shippingCost, total } = orderData;

    // Robust ID extraction
    let orderId = 'N/A';
    if (orderData.orderId) orderId = orderData.orderId;
    else if (orderData.id) orderId = orderData.id;
    else if (typeof orderData.order === 'object' && orderData.order.id) orderId = orderData.order.id;
    else if (orderData.savedOrder && orderData.savedOrder.id) orderId = orderData.savedOrder.id;

    console.log('Resolved Order ID:', orderId);

    if (!email || !items) {
        return res.status(400).json({ success: false, message: 'Email and items are required' });
    }

    try {
        const pdfBase64 = await generateInvoicePDF(orderData);

        const rows = items.map(item => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.weightValue || '-'} ${item.weightUnit || ''}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${(parseFloat(item.price) || 0).toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${(item.quantity * (parseFloat(item.price) || 0)).toFixed(2)}</td>
            </tr>
        `).join('');

        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: `Order Confirmation #${orderId || ''} - Sanatana Parampare`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        ${logoBase64 ? `<img src="cid:logo" alt="Sanatana Parampare" style="width: 80px;" />` : '<h2>Sanatana Parampare</h2>'}
                    </div>
                    <h2 style="color: #4CAF50; text-align: center;">Thank you for your order!</h2>
                    <p>Hi there,</p>
                    <p>Your order <strong>#${orderId || ''}</strong> has been confirmed and is being processed.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f8f8f8;">
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Weight</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
                                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal</td>
                                <td style="padding: 10px; text-align: right;">₹${(parseFloat(subtotal) || 0).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Shipping</td>
                                <td style="padding: 10px; text-align: right;">₹${(parseFloat(shippingCost) || 0).toFixed(2)}</td>
                            </tr>
                            ${orderData.discountAmount > 0 ? `
                            <tr>
                                <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold; color: #e53e3e;">Discount</td>
                                <td style="padding: 10px; text-align: right; color: #e53e3e;">-₹${(parseFloat(orderData.discountAmount) || 0).toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            <tr style="background-color: #f8f8f8; font-size: 1.1em;">
                                <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Grand Total</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold; color: #4CAF50;">₹${(parseFloat(total) || 0).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <p style="margin-top: 30px;">An invoice PDF has been attached to this email for your records.</p>
                    <p>We'll notify you when your order is shipped!</p>
                    
                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888; text-align: center;">
                        <p>Sanatana Parampare - 100% Authentic Products</p>
                        <p>If you have any questions, contact us at techmindset@kvgengg.com</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    content: pdfBase64,
                    filename: `invoice_${orderId || 'order'}.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
                ...(logoBase64 ? [{
                    content: logoBase64,
                    filename: 'logo.png',
                    type: 'image/png',
                    disposition: 'inline',
                    content_id: 'logo'
                }] : [])
            ],
        };

        await sgMail.send(msg);
        console.log(`Email sent successfully with PDF to ${email}`);
        res.status(200).json({ success: true, message: 'Confirmation email sent with invoice' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send confirmation email' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('Email service is running');
});

// Subscription Confirmation Route
app.post('/api/send-subscription-confirmation', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Thank you for subscribing!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        ${logoBase64 ? `<img src="cid:logo" alt="Sanatana Parampare" style="width: 80px;" />` : '<h2>Sanatana Parampare</h2>'}
                    </div>
                    <h2 style="color: #4CAF50; text-align: center;">Hello 👋,</h2>
                    <p style="text-align: center; font-size: 16px;">Thank you for subscribing to <strong>Sanatana parampare</strong>.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 25px 0;">
                        <p style="font-size: 18px; text-align: center; margin-bottom: 15px;">You’re now part of our community! 🎉</p>
                        <p><strong>You’ll receive:</strong></p>
                        <ul style="line-height: 1.6;">
                            <li>🎁 Exclusive offers & discounts</li>
                            <li>📦 Order updates & confirmations</li>
                            <li>📢 New service announcements</li>
                        </ul>
                    </div>

                    <p style="text-align: center; color: #666;">We promise not to spam you 😊</p>
                    
                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #444;">
                        <p>Regards,<br>
                        <strong>Sanatana parampare</strong><br>
                        📞 +91 7892783668<br>
                        📍 kandadka house dugaladka post, sullia TQ, DK</p>
                    </div>
                </div>
            `,
            attachments: logoBase64 ? [{
                content: logoBase64,
                filename: 'logo.png',
                type: 'image/png',
                disposition: 'inline',
                content_id: 'logo'
            }] : []
        };

        await sgMail.send(msg);
        console.log(`Subscription confirmation email sent to ${email}`);
        res.status(200).json({ success: true, message: 'Subscription confirmation email sent' });
    } catch (error) {
        console.error('Error sending subscription email:', error);
        res.status(500).json({ success: false, message: 'Failed to send subscription confirmation email' });
    }
});

// Contact Thank You Email Route
app.post('/api/send-contact-thankyou', async (req, res) => {
    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Thank you for reaching us!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        ${logoBase64 ? `<img src="cid:logo" alt="Sanatana Parampare" style="width: 80px;" />` : '<h2>Sanatana Parampare</h2>'}
                    </div>
                    <h2 style="color: #4CAF50; text-align: center;">Hello ${name || ''} 👋,</h2>
                    <p style="text-align: center; font-size: 16px;"><strong>Thank you for reaching us!</strong></p>
                    <p style="text-align: center; font-size: 16px; line-height: 1.6;">Our team will connect with you soon. We appreciate your interest in <strong>Sanatana parampare</strong>.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
                        <p style="font-size: 14px; color: #666;">We've received your message and will review it shortly.</p>
                    </div>

                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #444;">
                        <p>Regards,<br>
                        <strong>Sanatana parampare</strong><br>
                        📞 +91 7892783668<br>
                        📍 kandadka house dugaladka post, sullia TQ, DK</p>
                    </div>
                </div>
            `,
            attachments: logoBase64 ? [{
                content: logoBase64,
                filename: 'logo.png',
                type: 'image/png',
                disposition: 'inline',
                content_id: 'logo'
            }] : []
        };

        await sgMail.send(msg);
        console.log(`Contact thank-you email sent to ${email}`);
        res.status(200).json({ success: true, message: 'Contact thank-you email sent' });
    } catch (error) {
        console.error('Error sending contact thank-you email:', error);
        res.status(500).json({ success: false, message: 'Failed to send contact thank-you email' });
    }
});

app.listen(port, () => {
    console.log(`Email service listening at http://localhost:${port}`);
});
