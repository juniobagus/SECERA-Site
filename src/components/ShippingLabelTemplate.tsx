import React from 'react';

interface ShippingLabelTemplateProps {
  order: any;
}

export default function ShippingLabelTemplate({ order }: ShippingLabelTemplateProps) {
  if (!order) return null;

  return (
    <div id={`print-label-${order.id}`} className="hidden print:block fixed inset-0 bg-white z-[9999] font-sans text-black leading-tight">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-label-${order.id}, #print-label-${order.id} * {
            visibility: visible !important;
          }
          #print-label-${order.id} {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 2mm !important;
            background: white !important;
            letter-spacing: 0.01em !important;
          }
          @page {
            size: auto;
            margin: 0;
          }
        }
      `}</style>

      {/* Main Label Border */}
      <div className="border-[1.5px] border-black p-1 h-full flex flex-col">
        {/* Header Section: Logo & QR Placeholder */}
        <div className="flex justify-between items-start border-b-[1.5px] border-black pb-1 mb-1">
          <div className="flex items-center gap-2">
            <img src="/Logo/LogoType-dark.svg" alt="SECERA" className="h-4" />
            <div className="border-l border-black pl-2">
              <div className="text-[14px] font-black italic leading-none">J&T</div>
              <div className="text-[8px] font-bold leading-none">EXPRESS</div>
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 gap-0.5 mb-1 text-[9px]">
          <div className="flex border-b border-black/20 pb-0.5">
            <span className="font-bold w-12 shrink-0">Pengirim :</span>
            <div className="flex-1">
              <span className="font-bold">SECERA Official Store</span>
              <span className="ml-2">(+62) 812-3456-7890</span>
              <div className="text-[8px]">TANGERANG, BANTEN</div>
            </div>
          </div>
          <div className="flex pt-0.5">
            <span className="font-bold w-12 shrink-0">Penerima :</span>
            <div className="flex-1">
              <span className="font-bold">{order.shipping_name}</span>
              <span className="ml-2">{order.shipping_phone}</span>
              <div className="text-[10px] font-bold uppercase mt-0.5 leading-tight">
                {order.shipping_address}, {order.shipping_city}, {order.shipping_postal_code}
              </div>
            </div>
          </div>
        </div>

        {/* Big Tracking/Region Identifier (Like BigSeller) */}
        <div className="border-y-[1.5px] border-black py-2 my-1 text-center">
          {/* <div className="text-[20px] font-black tracking-tighter leading-none mb-1">
            {order.shipping_city?.slice(0, 3).toUpperCase()}-{order.id.slice(0, 5).toUpperCase()}
          </div> */}
          {/* Barcode Placeholder - Large and bold font to simulate barcode area */}
          <div className="font-mono text-[12px] font-bold">
            {order.tracking_number || order.id.toUpperCase()}
          </div>
        </div>

        {/* Courier Info Row */}
        <div className="flex justify-between items-center text-[8px] font-bold border-b border-black pb-1 mb-1">
          <div>Order ID: <span className="font-mono">{order.id.slice(0, 12)}</span></div>
          <div>Ship: {new Date().toLocaleDateString('id-ID')}</div>
        </div>

        {/* Packing List / Items Section */}
        <div className="flex-1 min-h-0">
          <div className="text-[8px] font-black uppercase border-b border-black mb-0.5">Isi Paket / Packing List</div>
          <table className="w-full text-[9px] border-collapse">
            <thead>
              <tr className="border-b border-black/40">
                <th className="text-left py-0.5">Item Name / SKU</th>
                <th className="text-center w-6 py-0.5">Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-black/10">
                  <td className="py-1 leading-tight">
                    <div className="font-bold">{item.product_name}</div>
                    <div className="text-[7px] font-mono text-gray-700">{item.variant_sku}</div>
                  </td>
                  <td className="text-center font-black py-1">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unboxing Warning (Common in Indo labels) */}
        <div className="mt-1 border border-black p-1 text-[8px] font-bold text-center leading-tight">
          TANPA VIDEO UNBOXING KOMPLAIN TIDAK DITERIMA
        </div>
      </div>
    </div>
  );
}
