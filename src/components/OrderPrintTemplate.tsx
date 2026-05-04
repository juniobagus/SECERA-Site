import { formatPrice } from '../data/products';

interface OrderPrintTemplateProps {
  order: any;
}

export default function OrderPrintTemplate({ order }: OrderPrintTemplateProps) {
  if (!order) return null;

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div id={`print-order-${order.id}`} className="hidden print:block fixed inset-0 bg-white z-[9999] overflow-auto p-10 font-sans text-gray-900">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-order-${order.id}, #print-order-${order.id} * {
            visibility: visible !important;
          }
          #print-order-${order.id} {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 20mm !important;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
        <div>
          <img src="/Logo/LogoType-dark.svg" alt="SECERA" className="h-8 mb-4" />
          <h1 className="text-2xl font-bold uppercase tracking-widest text-[#722F38]">Invoice</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
          <p className="text-lg font-mono font-bold text-gray-900">{order.id}</p>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Date</p>
          <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mb-10">
        {/* Bill To */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To:</h3>
          <p className="text-base font-bold text-gray-900">{order.shipping_name}</p>
          <div className="text-sm text-gray-600 mt-1 leading-relaxed">
            <p>{order.shipping_address}</p>
            <p>{order.shipping_city}, {order.shipping_postal_code}</p>
            <p className="mt-1 font-medium">{order.shipping_phone}</p>
          </div>
        </div>
        {/* Status & Shipping */}
        <div className="text-right">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order Status:</h3>
          <p className="text-base font-bold uppercase tracking-wider text-[#722F38]">{order.status}</p>
          {order.tracking_number && (
            <div className="mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking Number (J&T):</p>
              <p className="text-sm font-mono font-bold">{order.tracking_number}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Description</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items?.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="px-4 py-4">
                  <p className="text-sm font-bold text-gray-900">{item.product_name || 'Product'}</p>
                  <p className="text-xs text-gray-500 font-medium">SKU: {item.variant_sku}</p>
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium">{item.quantity}</td>
                <td className="px-4 py-4 text-right text-sm font-medium">{formatPrice(item.price)}</td>
                <td className="px-4 py-4 text-right text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping Cost</span>
            <span className="font-medium">{formatPrice(order.shipping_cost || 0)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span className="font-medium">-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="pt-3 border-t-2 border-[#722F38] flex justify-between text-lg font-bold text-[#722F38]">
            <span>Total Amount</span>
            <span>{formatPrice(subtotal + Number(order.shipping_cost || 0) - Number(order.discount_amount || 0))}</span>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      {order.notes && (
        <div className="mt-10 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Notes:</h4>
          <p className="text-sm text-gray-700 italic">"{order.notes}"</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-gray-100 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Thank you for shopping at SECERA</p>
        <p className="text-[10px] text-gray-400">SECERA - Official Store | care@secera.id | www.secera.id</p>
      </div>
    </div>
  );
}
