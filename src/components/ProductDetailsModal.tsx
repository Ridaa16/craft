import React from 'react';
import { X, MessageCircle, ShoppingBag, ShieldCheck, CheckCircle2, Ruler, Weight, Sparkles, Truck } from 'lucide-react';
import { Product, SiteConfig } from '../types';
import { buildProductInquiryLink } from '../utils/whatsapp';
import { ProductVisual } from './ProductSvgAsset';

interface ProductDetailsModalProps {
  product: Product | null;
  config: SiteConfig;
  isOpen: boolean;
  onClose: () => void;
  onAddToInquiry: (product: Product, quantity?: number) => void;
  isInInquiryList: boolean;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  config,
  isOpen,
  onClose,
  onAddToInquiry,
  isInInquiryList,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [includeEngraving, setIncludeEngraving] = React.useState(false);
  const [engravingText, setEngravingText] = React.useState('');

  if (!isOpen || !product) return null;

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleWhatsAppWithCustomizations = () => {
    let customNote = '';
    if (includeEngraving && engravingText) {
      customNote = `\nCustom Engraving: "${engravingText}"`;
    }
    if (quantity > 1) {
      customNote += `\nQuantity Required: ${quantity} units`;
    }

    const message = [
      `*Inquiry for ${product.title}*`,
      `SKU: ${product.sku}`,
      `Price: ₹${product.price.toLocaleString('en-IN')}`,
      `Material: ${product.materialSpec}`,
      `Dimensions: ${product.dimensions}`,
      `Weight: ${product.weight}`,
      customNote,
      ``,
      `Hello Vintage Crafts, please confirm current dispatch timeline and shipping to my address.`,
    ].join('\n');

    const url = `https://wa.me/91${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1B1A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-2xl border border-[#D9CEB7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#1C1B1A] border border-[#E3DAC6] transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Showcase */}
          <div className="bg-[#F5EFE3] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DFC9]">
            <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-[#E0D7C4] shadow-xs">
              <ProductVisual product={product} className="w-full h-full" zoom={true} />
              
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1B1A] text-white text-[11px] font-mono">
                {product.sku}
              </div>
            </div>

            {/* Metallurgy Hallmark Badge */}
            <div className="mt-6 p-4 rounded-xl bg-[#FAF6EE] border border-[#E3DAC6] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1B1A]">
                <ShieldCheck className="w-4 h-4 text-[#9A7730]" />
                <span>Foundry Metallurgy Certificate</span>
              </div>
              <p className="text-[12px] text-[#635E57] leading-relaxed">
                Inspected for authentic density and high copper-zinc ratio. Individually hand-buffed with traditional jewelers rouge for genuine antique lustre.
              </p>
            </div>
          </div>

          {/* Right Column: Specs & Purchasing Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category */}
              <div className="text-xs uppercase tracking-widest text-[#9A7730] font-semibold">
                {product.category}
              </div>

              {/* Title */}
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#1C1B1A] leading-tight">
                {product.title}
              </h2>

              {/* Pricing Row */}
              <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-[#ECE4D5]">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1C1B1A]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-mono text-[#8F897F] line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#15803d] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {discountPercent}% OFF (Factory Direct)
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F4EB] border border-[#EAE1D1]">
                  <div className="text-[#8F897F] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#9A7730]" />
                    <span>Metallurgy</span>
                  </div>
                  <div className="font-semibold text-[#1C1B1A]">{product.materialSpec}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F4EB] border border-[#EAE1D1]">
                  <div className="text-[#8F897F] flex items-center gap-1.5 mb-1">
                    <Ruler className="w-3.5 h-3.5 text-[#9A7730]" />
                    <span>Dimensions</span>
                  </div>
                  <div className="font-semibold text-[#1C1B1A]">{product.dimensions}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F4EB] border border-[#EAE1D1]">
                  <div className="text-[#8F897F] flex items-center gap-1.5 mb-1">
                    <Weight className="w-3.5 h-3.5 text-[#9A7730]" />
                    <span>Net Weight</span>
                  </div>
                  <div className="font-semibold text-[#1C1B1A]">{product.weight}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F4EB] border border-[#EAE1D1]">
                  <div className="text-[#8F897F] flex items-center gap-1.5 mb-1">
                    <Truck className="w-3.5 h-3.5 text-[#9A7730]" />
                    <span>Dispatch Time</span>
                  </div>
                  <div className="font-semibold text-[#1C1B1A]">24-48 Business Hours</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-5 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
                  Key Craftsmanship Details:
                </div>
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#524E48]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7730] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Description Story */}
              <div className="mt-5 text-xs text-[#635E57] leading-relaxed border-t border-[#ECE4D5] pt-4">
                <p>{product.fullStory}</p>
              </div>

              {/* Optional Custom Engraving Box */}
              <div className="mt-5 p-3 rounded-xl bg-[#FAF6EE] border border-[#E3DAC6]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1B1A]">
                  <input
                    type="checkbox"
                    checked={includeEngraving}
                    onChange={(e) => setIncludeEngraving(e.target.checked)}
                    className="rounded border-[#C5A059] text-[#9A7730] focus:ring-[#C5A059]"
                  />
                  <span>Add Custom Brass Engraving / Nameplate (+₹350)</span>
                </label>
                {includeEngraving && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      placeholder="e.g., 'Capt. Arthur Vance · HMS Sovereign 1888'"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D9CEB7] bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 pt-5 border-t border-[#ECE4D5] flex flex-col gap-3">
              {/* Quantity selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#4A4744]">Quantity:</span>
                <div className="flex items-center border border-[#D9CEB7] rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-[#1C1B1A] hover:bg-[#F2EADB]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold text-[#1C1B1A] hover:bg-[#F2EADB]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary: Direct WhatsApp Inquiry */}
              <button
                onClick={handleWhatsAppWithCustomizations}
                className="w-full py-3 px-4 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Instant Inquiry via WhatsApp (+91 {config.whatsappNumber})</span>
              </button>

              {/* Secondary: Add to Bulk Inquiry list */}
              <button
                onClick={() => {
                  onAddToInquiry(product, quantity);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#C5A059] bg-[#FDFBF7] hover:bg-[#F4EEE2] text-[#1C1B1A] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#9A7730]" />
                <span>{isInInquiryList ? 'Update in Inquiry List' : 'Add to Bulk Quotation List'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
