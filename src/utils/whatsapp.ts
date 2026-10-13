import { Product, InquiryItem } from '../types';

export const WHATSAPP_PHONE = '9457940460'; // The owner's WhatsApp number

export function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function buildProductInquiryLink(
  product: Product,
  phone: string = WHATSAPP_PHONE,
  template?: string
): string {
  const targetNumber = sanitizePhone(phone);
  
  if (template) {
    const text = template
      .replace('{product_name}', product.title)
      .replace('{sku}', product.sku)
      .replace('{price}', `₹${product.price.toLocaleString('en-IN')}`)
      .replace('{category}', product.category);
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
  }

  const message = [
    `*Inquiry for ${product.title}*`,
    `SKU: ${product.sku}`,
    `Price: ₹${product.price.toLocaleString('en-IN')}`,
    `Material: ${product.materialSpec}`,
    `Dimensions: ${product.dimensions}`,
    ``,
    `Hello Vintage Crafts team, I would like to purchase / inquire about availability, dispatch time, and best quotation for this handcrafted artifact.`,
  ].join('\n');

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

export function buildBulkOrderWhatsAppLink(
  items: InquiryItem[],
  customerName?: string,
  customerNote?: string,
  phone: string = WHATSAPP_PHONE
): string {
  const targetNumber = sanitizePhone(phone);
  const totalEstimated = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  const lines = [
    `*Official Order / Bulk Inquiry - Vintage Crafts*`,
    customerName ? `Client: ${customerName}` : '',
    `Items Selected (${items.length}):`,
    ...items.map(
      (item, idx) =>
        `${idx + 1}. ${item.product.title} (SKU: ${item.product.sku}) - Qty: ${item.quantity} × ₹${item.product.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.product.price).toLocaleString('en-IN')}`
    ),
    ``,
    `*Estimated Total: ₹${totalEstimated.toLocaleString('en-IN')}*`,
    customerNote ? `Special Request: ${customerNote}` : '',
    ``,
    `Please share formal quotation, GST invoice details, and dispatch timeframe.`,
  ].filter(Boolean);

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildGeneralWhatsAppLink(
  message: string = 'Hello Vintage Crafts, I have an inquiry regarding your handcrafted brass artifacts and bespoke orders.',
  phone: string = WHATSAPP_PHONE
): string {
  const targetNumber = sanitizePhone(phone);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
