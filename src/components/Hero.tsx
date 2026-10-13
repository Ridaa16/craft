import React from 'react';
import { Search, ShieldCheck, Hammer, Truck, Award, MessageCircle, ArrowRight } from 'lucide-react';
import { SiteConfig } from '../types';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

interface HeroProps {
  config: SiteConfig;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  totalProductsCount: number;
  onOpenBulkInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  totalProductsCount,
  onOpenBulkInquiry,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6EE] to-[#F5EFE3] border-b border-[#E8DFC9] pt-12 pb-14">
      {/* Decorative subtle texture rings */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-[#DFC085]/20 -mr-24 -mt-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full border border-[#DFC085]/15 -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtle kicker without pill badge */}
          <div className="text-xs uppercase tracking-widest text-[#9A7730] font-semibold mb-3">
            Handcrafted in Moradabad · Solid Brass Metallurgy · Direct Foundry
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1B1A] leading-tight text-balance">
            {config.headline}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#5E5A54] leading-relaxed text-balance">
            {config.subheadline}
          </p>

          {/* Quick CTA and WhatsApp trigger */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildGeneralWhatsAppLink('Hello Vintage Crafts! I would like to explore your latest catalog and bulk quotation.', config.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#1C1B1A] hover:bg-[#33312E] text-white text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Direct WhatsApp (+91 {config.whatsappNumber})</span>
            </a>

            <button
              onClick={onOpenBulkInquiry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#C5A059] bg-[#FDFBF7] hover:bg-[#F3EDE2] text-[#1C1B1A] text-sm font-semibold transition-colors"
            >
              <span>Request Bespoke Catalog / Bulk Quote</span>
              <ArrowRight className="w-4 h-4 text-[#9A7730]" />
            </button>
          </div>

          {/* Flipkart-Style Search Bar */}
          <div className="mt-9 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#9A7730] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search spyglasses, sundials, station clocks, astrolabes, or diving helmets..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[#D9CEB7] bg-[#FFFFFF] text-sm text-[#1C1B1A] placeholder-[#8F897F] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-xs text-[#8F897F] hover:text-[#1C1B1A] px-1.5 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#1C1B1A] text-white border-[#1C1B1A] shadow-xs'
                    : 'bg-[#F9F5EC] text-[#55504A] border-[#DFD5C2] hover:bg-[#F0E8D7] hover:text-[#1C1B1A]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 4 Trust Highlights Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#E6DDCA]/80">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF6EE]/80">
            <ShieldCheck className="w-5 h-5 text-[#9A7730] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#1C1B1A]">100% Solid Brass</div>
              <div className="text-[11px] text-[#716C64]">Zero hollow zinc casting</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF6EE]/80">
            <Hammer className="w-5 h-5 text-[#9A7730] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#1C1B1A]">Direct Factory Rates</div>
              <div className="text-[11px] text-[#716C64]">Eliminates middleman markups</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF6EE]/80">
            <Truck className="w-5 h-5 text-[#9A7730] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#1C1B1A]">Safe Pan-India Transit</div>
              <div className="text-[11px] text-[#716C64]">Multi-layer wooden crating</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF6EE]/80">
            <Award className="w-5 h-5 text-[#9A7730] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#1C1B1A]">Custom Engravings</div>
              <div className="text-[11px] text-[#716C64]">Personalized plaques & logos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
