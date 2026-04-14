import { Order } from '@/services/orderService';

export const generateInvoiceHTML = (order: Order, language: string = 'en'): string => {
  const isRTL = language === 'ar';
  const currency = isRTL ? 'ج.م' : 'EGP';
  
  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      cash: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
      instapay: { ar: 'InstaPay', en: 'InstaPay' },
      vodafone: { ar: 'محفظة فودافون', en: 'Vodafone Wallet' },
      card: { ar: 'بطاقة ائتمانية', en: 'Credit Card' },
    };
    return labels[method]?.[language] || method;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      processing: { ar: 'جاري العمل', en: 'Processing' },
      shipped: { ar: 'تم الشحن', en: 'Shipped' },
      delivered: { ar: 'تم التسليم', en: 'Delivered' },
      cancelled: { ar: 'ملغاة', en: 'Cancelled' },
    };
    return labels[status]?.[language] || status;
  };

  const html = `
<!DOCTYPE html>
<html lang="${language}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${isRTL ? 'Arial, sans-serif' : 'Arial, sans-serif'};
      direction: ${isRTL ? 'rtl' : 'ltr'};
      padding: 40px;
      background: #fff;
      color: #000;
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
    }
    .company-info {
      flex: 1;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      text-align: ${isRTL ? 'left' : 'right'};
    }
    .invoice-number {
      font-size: 18px;
      margin-top: 10px;
    }
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      text-transform: uppercase;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .info-item {
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      margin-bottom: 3px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table th {
      background: #f5f5f5;
      padding: 12px;
      text-align: ${isRTL ? 'right' : 'left'};
      border: 1px solid #ddd;
      font-weight: bold;
    }
    .items-table td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: ${isRTL ? 'right' : 'left'};
    }
    .items-table tr:nth-child(even) {
      background: #f9f9f9;
    }
    .text-right {
      text-align: ${isRTL ? 'left' : 'right'};
    }
    .text-left {
      text-align: ${isRTL ? 'right' : 'left'};
    }
    .totals {
      margin-left: ${isRTL ? '0' : 'auto'};
      margin-right: ${isRTL ? 'auto' : '0'};
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
    }
    .total-row.final {
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 12px 0;
      margin-top: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="company-info">
        <div class="company-name">${isRTL ? 'شركة بيكيو للأثاث' : 'Pickio Furniture Company'}</div>
        <div class="info-item">${isRTL ? 'العنوان: القاهرة، مصر' : 'Address: Cairo, Egypt'}</div>
        <div class="info-item">${isRTL ? 'الهاتف: +20 10 16434958' : 'Phone: +20 10 16434958'}</div>
        <div class="info-item">${isRTL ? 'البريد: pickiofurniture@gmail.com' : 'Email: pickiofurniture@gmail.com'}</div>
      </div>
      <div class="invoice-title">
        <div>${isRTL ? 'فاتورة' : 'INVOICE'}</div>
        <div class="invoice-number">${isRTL ? 'رقم الفاتورة' : 'Invoice No'}: ${order.orderNumber}</div>
        <div style="font-size: 14px; margin-top: 10px; font-weight: normal;">
          ${isRTL ? 'تاريخ' : 'Date'}: ${order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
        </div>
      </div>
    </div>

    <div class="info-section">
      <div>
        <div class="section-title">${isRTL ? 'معلومات العميل' : 'Customer Information'}</div>
        <div class="info-item">
          <div class="info-label">${isRTL ? 'الاسم' : 'Name'}:</div>
          <div>${order.customer.name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">${isRTL ? 'البريد الإلكتروني' : 'Email'}:</div>
          <div>${order.customer.email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">${isRTL ? 'الهاتف' : 'Phone'}:</div>
          <div>${order.customer.phone}</div>
        </div>
      </div>
      <div>
        <div class="section-title">${isRTL ? 'عنوان التوصيل' : 'Delivery Address'}</div>
        <div class="info-item">
          <div>${order.deliveryAddress.street}</div>
          <div>${order.deliveryAddress.city}, ${order.deliveryAddress.state}</div>
          <div>${order.deliveryAddress.zipCode}</div>
          <div>${order.deliveryAddress.country}</div>
        </div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th class="text-left">${isRTL ? 'المنتج' : 'Product'}</th>
          <th class="text-right">${isRTL ? 'الكمية' : 'Quantity'}</th>
          <th class="text-right">${isRTL ? 'السعر' : 'Price'}</th>
          <th class="text-right">${isRTL ? 'الإجمالي' : 'Total'}</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>
              <div style="font-weight: bold;">${item.productName}</div>
              ${item.color ? `<div style="font-size: 12px; color: #666;">${isRTL ? 'اللون' : 'Color'}: ${item.color}</div>` : ''}
              ${item.size ? `<div style="font-size: 12px; color: #666;">${isRTL ? 'الحجم' : 'Size'}: ${item.size}</div>` : ''}
            </td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${item.price.toLocaleString()} ${currency}</td>
            <td class="text-right">${(item.quantity * item.price).toLocaleString()} ${currency}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>${isRTL ? 'المجموع الفرعي' : 'Subtotal'}:</span>
        <span>${order.subtotal.toLocaleString()} ${currency}</span>
      </div>
      <div class="total-row">
        <span>${isRTL ? 'الشحن' : 'Shipping'}:</span>
        <span>${order.shipping.toLocaleString()} ${currency}</span>
      </div>
      <div class="total-row">
        <span>${isRTL ? 'الضريبة' : 'Tax'}:</span>
        <span>${order.tax.toLocaleString()} ${currency}</span>
      </div>
      <div class="total-row final">
        <span>${isRTL ? 'الإجمالي' : 'Total'}:</span>
        <span>${order.total.toLocaleString()} ${currency}</span>
      </div>
    </div>

    <div style="margin-top: 30px;">
      <div class="info-item">
        <div class="info-label">${isRTL ? 'طريقة الدفع' : 'Payment Method'}:</div>
        <div>${getPaymentMethodLabel(order.paymentMethod)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">${isRTL ? 'حالة الطلب' : 'Order Status'}:</div>
        <div>${getStatusLabel(order.status)}</div>
      </div>
      ${order.trackingNumber ? `
        <div class="info-item">
          <div class="info-label">${isRTL ? 'رقم التتبع' : 'Tracking Number'}:</div>
          <div>${order.trackingNumber}</div>
        </div>
      ` : ''}
    </div>

    ${order.notes ? `
      <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
        <div class="info-label" style="margin-bottom: 10px;">${isRTL ? 'ملاحظات' : 'Notes'}:</div>
        <div style="white-space: pre-wrap;">${order.notes}</div>
      </div>
    ` : ''}

    <div class="footer">
      <div>${isRTL ? 'شكراً لاختيارك متجرنا!' : 'Thank you for choosing our store!'}</div>
      <div style="margin-top: 10px;">${isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</div>
    </div>
  </div>
</body>
</html>
  `;

  return html;
};

export const downloadInvoicePDF = (order: Order, language: string = 'en') => {
  const html = generateInvoiceHTML(order, language);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Clean up after printing
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }, 500);
    };
  }
};

export const downloadInvoiceAsPDF = (order: Order, language: string = 'en') => {
  // For direct PDF download, we'll use the browser's print to PDF
  // This opens a new window with the invoice and triggers print dialog
  const html = generateInvoiceHTML(order, language);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Note: User will need to select "Save as PDF" in the print dialog
      }, 500);
    };
  }
};
