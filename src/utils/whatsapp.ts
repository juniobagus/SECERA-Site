import { CartItem } from '../context/CartContext';
import { formatPrice } from '../data/products';

const ADMIN_PHONE = '6285750990000'; // Secera Admin WhatsApp

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export function generateWhatsAppMessage(
  items: CartItem[],
  shipping: ShippingInfo,
  subtotal: number,
  shippingCost: number,
  discount: number
): string {
  const total = subtotal - discount + shippingCost;
  const itemLines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.productName} — ${item.color}${item.option !== 'All Size' ? `, ${item.option}` : ''}\n   SKU: ${item.sku}\n   ${item.quantity}x ${formatPrice(item.promoPrice ?? item.price)} = ${formatPrice((item.promoPrice ?? item.price) * item.quantity)}`
    )
    .join('\n\n');

  const lines = [
    `🛍️ *PESANAN BARU — SECERA*`,
    ``,
    `*Detail Pesanan:*`,
    itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━`,
    `Subtotal: ${formatPrice(subtotal)}`,
    discount > 0 ? `Diskon: -${formatPrice(discount)}` : '',
    `Ongkir (J&T): ${shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}`,
    `*TOTAL: ${formatPrice(total)}*`,
    `━━━━━━━━━━━━━━━━━`,
    ``,
    `*Informasi Pengiriman:*`,
    `Nama: ${shipping.name}`,
    `No. HP/WA: ${shipping.phone}`,
    `Alamat: ${shipping.address}`,
    `Kota: ${shipping.city}`,
    `Kode Pos: ${shipping.postalCode}`,
    shipping.notes ? `Catatan: ${shipping.notes}` : '',
    ``,
    `Metode Pembayaran: Transfer Bank / QRIS`,
    `Ekspedisi: J&T Express`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function openWhatsApp(message: string): void {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${ADMIN_PHONE}?text=${encoded}`, '_blank');
}

export function calculateShipping(subtotal: number): number {
  // Free shipping for orders above Rp 200.000
  return subtotal >= 200000 ? 0 : 15000;
}
