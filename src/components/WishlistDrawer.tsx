import React from 'react';
import { X, Heart, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { Product, SiteConfig } from '../types';
import { buildBulkOrderWhatsAppLink } from '../utils/whatsapp';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onToggleWishlist: (product: Product) => void;
  onClearWishlist: () => void;
  onMoveToInquiryCart: (product: Product) => void;
  onMoveAllToInquiryCart: () => void;
  config: SiteConfig;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onToggleWishlist,
  onClearWishlist,
  onMoveToInquiryCart,
  onMoveAllToInquiryCart,
  config,
}) => {
  if (!isOpen) return null;

  const totalWishlistValue = wishlistProducts.reduce((acc, curr) => acc + curr.price, 0);

  const handleInquireAllWishlistOnWhatsApp = () => {
    const items = wishlistProducts.map((p) => ({ product: p, quantity: 1 }));
    const url = buildBulkOrderWhatsAppLink(
      items,
      'Valued Collector',
      'Inquiring about all items currently saved in my Wishlist.',
      config.whatsappNumber
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1C1B1A]/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-[#D9CEB7] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8DFC9] flex items-center justify-between bg-[#F8F4EB]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#9A7730] text-[#9A7730]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1B1A]">
              Saved Favorites & Wishlist
            </h2>
            <span className="text-xs font-mono font-bold bg-[#EAE1D1] text-[#4A4744] px-2 py-0.5 rounded-full">
              {wishlistProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5A5650] hover:text-[#1C1B1A] hover:bg-[#EDE5D5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center text-[#736E67]">
              <div className="w-14 h-14 rounded-full bg-[#F5EFE3] text-[#C5A059] flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <p className="font-serif text-base text-[#1C1B1A] font-semibold">
                Your Wishlist is Empty
              </p>
              <p className="text-xs text-[#8F897F] mt-1.5 max-w-xs mx-auto">
                Click the heart icon on any brass artifact in the catalog to bookmark your favorite heirlooms for later.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {wishlistProducts.map((product) => (
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
                          onClick={() => onToggleWishlist(product)}
                          className="text-[#999288] hover:text-red-600 p-0.5"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#78736B] truncate mt-0.5">
                        {product.materialSpec}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-mono font-bold text-[#1C1B1A]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-mono text-[#8F897F] line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => onMoveToInquiryCart(product)}
                          className="px-2.5 py-1 rounded-md bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#D9CEB7] text-[11px] font-semibold text-[#1C1B1A] flex items-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#9A7730]" />
                          <span>+ Quote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onMoveAllToInquiryCart}
                  className="text-xs font-semibold text-[#9A7730] hover:text-[#1C1B1A] underline underline-offset-2"
                >
                  Move All to Inquiry List →
                </button>
                <button
                  onClick={onClearWishlist}
                  className="text-[11px] text-[#8F897F] hover:text-red-700 transition-colors"
                >
                  Clear Wishlist
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-5 border-t border-[#E8DFC9] bg-[#F8F4EB] space-y-3">
            <div className="flex justify-between text-sm font-bold text-[#1C1B1A]">
              <span>Combined Value:</span>
              <span className="font-mono">₹{totalWishlistValue.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleInquireAllWishlistOnWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Inquire Saved Items on WhatsApp (+91 {config.whatsappNumber})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
