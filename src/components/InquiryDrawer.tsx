import React from 'react';
import { X, Trash2, MessageCircle, FileSpreadsheet, ArrowRight, ShoppingBag } from 'lucide-react';
import { InquiryItem, SiteConfig } from '../types';
import { buildBulkOrderWhatsAppLink } from '../utils/whatsapp';

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InquiryItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearAll: () => void;
  config: SiteConfig;
  onProceedToContactForm: () => void;
}

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
  config,
  onProceedToContactForm,
}) => {
  const [customerName, setCustomerName] = React.useState('');
  const [customerNote, setCustomerNote] = React.useState('');

  if (!isOpen) return null;

  const totalEstimatedPrice = items.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  const totalMrp = items.reduce(
    (acc, curr) => acc + curr.product.mrp * curr.quantity,
    0
  );

  const totalSavings = totalMrp - totalEstimatedPrice;

  const handleSendWhatsApp = () => {
    const url = buildBulkOrderWhatsAppLink(
      items,
      customerName,
      customerNote,
      config.whatsappNumber
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1C1B1A]/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-[#D9CEB7] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#E8DFC9] flex items-center justify-between bg-[#F8F4EB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#9A7730]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1B1A]">
              Bulk Quotation & Inquiry List
            </h2>
            <span className="text-xs font-mono font-bold bg-[#EAE1D1] text-[#4A4744] px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5A5650] hover:text-[#1C1B1A] hover:bg-[#EDE5D5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[#736E67]">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#C5A059]/40 mb-3" />
              <p className="font-serif text-base text-[#1C1B1A] font-semibold">
                Your Inquiry List is Empty
              </p>
              <p className="text-xs text-[#8F897F] mt-1 max-w-xs mx-auto">
                Explore our curated brass artifacts and click the '+' button on any piece to create a custom quotation request.
              </p>
            </div>
          ) : (
            <>
              {/* Product rows */}
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-xl border border-[#E3DAC6] bg-white flex gap-3 shadow-2xs"
                  >
                    <div className="w-16 h-16 rounded-lg bg-[#F5EFE3] border border-[#E6DDCA] shrink-0 flex items-center justify-center font-serif text-xs font-bold text-[#9A7730]">
                      {product.sku.split('-')[1] || 'BRASS'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-xs font-bold text-[#1C1B1A] truncate">
                          {product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-[#999288] hover:text-red-700 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#78736B] truncate mt-0.5">
                        {product.materialSpec}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-[#1C1B1A]">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#8F897F]">
                            (₹{product.price.toLocaleString('en-IN')} ea)
                          </span>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center border border-[#D9CEB7] rounded-md bg-[#FAF7F0] overflow-hidden text-xs">
                          <button
                            onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                            className="px-2 py-0.5 hover:bg-[#EAE0CE] font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-semibold">{quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="px-2 py-0.5 hover:bg-[#EAE0CE] font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear button */}
              <div className="flex justify-end">
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-[#8F897F] hover:text-red-700 transition-colors"
                >
                  Clear All Items
                </button>
              </div>

              {/* Optional Quick note inputs */}
              <div className="p-3.5 rounded-xl bg-[#F8F4EB] border border-[#E3DAC6] space-y-2.5">
                <div className="text-xs font-bold text-[#1C1B1A]">
                  Direct WhatsApp Dispatch Info (Optional)
                </div>
                <input
                  type="text"
                  placeholder="Your Name / Business Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D9CEB7] bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
                <textarea
                  rows={2}
                  placeholder="Special instructions (e.g. bulk engraving, target delivery date)..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D9CEB7] bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8DFC9] bg-[#F8F4EB] space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#5F5B54]">
                <span>Total MRP:</span>
                <span className="font-mono line-through">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-[#15803d] font-semibold">
                  <span>Factory Direct Savings:</span>
                  <span className="font-mono">-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1C1B1A] pt-1 border-t border-[#E0D7C4]">
                <span>Estimated Subtotal:</span>
                <span className="font-mono">₹{totalEstimatedPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action 1: Send on WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Send Quotation to WhatsApp (+91 {config.whatsappNumber})</span>
            </button>

            {/* Action 2: Go to Google Sheet Sync Form */}
            <button
              onClick={() => {
                onClose();
                onProceedToContactForm();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-[#C5A059] bg-[#FDFBF7] hover:bg-[#F2ECE0] text-[#1C1B1A] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#9A7730]" />
              <span>Submit via Google Sheet Contact Form</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9A7730]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
