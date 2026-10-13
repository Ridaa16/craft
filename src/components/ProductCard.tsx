import React from 'react';
import { MessageCircle, Plus, Check, Star, Eye, Heart } from 'lucide-react';
import { Product, SiteConfig } from '../types';
import { buildProductInquiryLink } from '../utils/whatsapp';
import { ProductVisual } from './ProductSvgAsset';

interface ProductCardProps {
  product: Product;
  config: SiteConfig;
  onOpenDetails: (product: Product) => void;
  onToggleInquiryItem: (product: Product) => void;
  isInInquiryList: boolean;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  config,
  onOpenDetails,
  onToggleInquiryItem,
  isInInquiryList,
  onToggleWishlist,
  isWishlisted,
}) => {
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const stockBadgeConfig = {
    in_stock: {
      label: 'In Stock · Ready to Ship',
      className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    low_stock: {
      label: `Low Stock · Only ${product.stockCount} Left`,
      className: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    made_to_order: {
      label: 'Bespoke · 5-7 Days Dispatch',
      className: 'text-sky-800 bg-sky-50 border-sky-200',
    },
    out_of_stock: {
      label: 'Backorder Available',
      className: 'text-stone-600 bg-stone-100 border-stone-200',
    },
  }[product.stockStatus];

  const whatsappInquiryUrl = buildProductInquiryLink(
    product,
    config.whatsappNumber,
    config.whatsappMessageTemplate
  );

  return (
    <div className="group relative flex flex-col rounded-xl border border-[#E3DAC6] bg-[#FFFFFF] shadow-2xs hover:shadow-md hover:border-[#C5A059] transition-all duration-300 overflow-hidden">
      {/* Top Media Container */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative aspect-4/3 w-full cursor-pointer overflow-hidden border-b border-[#EDE7D9] bg-[#F8F5EE]"
      >
        <ProductVisual product={product} className="w-full h-full" zoom={true} />

        {/* Quick Inspection Pill Overlay on Hover */}
        <div className="absolute inset-0 bg-[#1C1B1A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1B1A]/90 text-white text-xs font-medium shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#DFC085]" />
            <span>Inspect Metallurgy & Specs</span>
          </div>
        </div>

        {/* Flipkart-style discount pill */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-tight bg-[#9A7730] text-white shadow-xs z-10">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Heart Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 border shadow-xs ${
            isWishlisted
              ? 'bg-[#FFFFFF] text-rose-600 border-rose-200 scale-105'
              : 'bg-[#FFFFFF]/85 text-[#736E67] hover:text-rose-600 border-[#E0D7C4] hover:bg-[#FFFFFF]'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-rose-600 text-rose-600 scale-110' : 'fill-transparent'
            }`}
          />
        </button>

        {/* SKU tag */}
        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#FDFBF7]/90 text-[#4A4744] border border-[#E0D7C4] z-10">
          {product.sku}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between text-xs text-[#736E67] mb-1.5">
          <span className="font-medium uppercase tracking-wider text-[11px] text-[#9A7730]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 font-semibold text-[#1C1B1A]">
            <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[#8F897F] font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="font-serif text-base sm:text-lg font-bold text-[#1C1B1A] group-hover:text-[#9A7730] transition-colors cursor-pointer line-clamp-1 leading-snug"
        >
          {product.title}
        </h3>

        {/* Metallurgy / Specs summary line */}
        <div className="mt-1 text-xs text-[#5F5B54] line-clamp-1">
          <span>{product.materialSpec}</span>
          <span className="mx-1.5 text-[#C5A059]">·</span>
          <span>{product.dimensions}</span>
        </div>

        {/* Stock Status text */}
        <div className="mt-2.5">
          <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${stockBadgeConfig.className}`}>
            {stockBadgeConfig.label}
          </span>
        </div>

        {/* Price Row (Flipkart-Style) */}
        <div className="mt-4 pt-3 border-t border-[#F0EBE0] flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono tracking-tight text-[#1C1B1A]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-mono text-[#8F897F] line-through">
            ₹{product.mrp.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-semibold text-[#15803d]">
            Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Actions Cluster */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          {/* Main Action: WhatsApp Instant Inquiry */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-4 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-semibold tracking-wide transition-colors shadow-2xs"
            title="Send Instant Product Inquiry to +91 9457940460"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
            <span className="truncate">Instant WhatsApp Inquiry</span>
          </a>

          {/* Quick Add to Quotation Drawer */}
          <button
            onClick={() => onToggleInquiryItem(product)}
            className={`col-span-1 flex items-center justify-center rounded-lg border transition-colors ${
              isInInquiryList
                ? 'bg-[#EAE0CD] border-[#C5A059] text-[#71541A]'
                : 'bg-[#F9F6F0] border-[#D9CEB7] hover:bg-[#EFE8DA] text-[#1C1B1A]'
            }`}
            title={isInInquiryList ? 'Remove from Inquiry List' : 'Add to Bulk Inquiry List'}
          >
            {isInInquiryList ? <Check className="w-4 h-4 text-[#71541A]" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
