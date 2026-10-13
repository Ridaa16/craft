import React from 'react';
import { MessageCircle, ShoppingBag, Sliders, Menu, X, Phone, Heart } from 'lucide-react';
import { SiteConfig, InquiryItem } from '../types';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

interface NavbarProps {
  config: SiteConfig;
  inquiryItems: InquiryItem[];
  onOpenInquiryDrawer: () => void;
  wishlistCount: number;
  onOpenWishlistDrawer: () => void;
  onOpenAdminModal: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  inquiryItems,
  onOpenInquiryDrawer,
  wishlistCount,
  onOpenWishlistDrawer,
  onOpenAdminModal,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalItemCount = inquiryItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const navLinks = [
    { id: 'collection', label: 'Artifact Catalog' },
    { id: 'craft-story', label: 'Artisanal Heritage' },
    { id: 'bulk-orders', label: 'Bulk Orders & Quotations' },
    { id: 'contact', label: 'Contact & Foundry' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EAE3D2] transition-colors">
      {/* Optional Slim Announcement Banner */}
      {config.showAnnouncement && config.announcementText && (
        <div className="bg-[#1C1B1A] text-[#F4EFE6] px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-3">
          <span className="truncate">{config.announcementText}</span>
          <a
            href={buildGeneralWhatsAppLink('Inquiring about export catalog and volume pricing.', config.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[#DFBF7B] hover:text-[#FFFFFF] transition-colors underline underline-offset-2 shrink-0 text-[11px]"
          >
            WhatsApp Support: +91 {config.whatsappNumber}
          </a>
        </div>
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('collection')}
          className="text-left group flex items-center gap-3 shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded border border-[#C5A059] bg-[#F6F1E7] flex items-center justify-center text-[#9A7730] font-serif font-bold text-sm shadow-xs">
            VC
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1C1B1A] group-hover:text-[#9A7730] transition-colors whitespace-nowrap">
              {config.storeName.toUpperCase()}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#9A7730] font-medium -mt-1 hidden sm:block">
              {config.tagline}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A4744]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#1C1B1A] border-[#C5A059] font-semibold'
                    : 'border-transparent hover:text-[#1C1B1A] hover:border-[#DFC085]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Saved Favorites & Wishlist Trigger */}
          <button
            onClick={onOpenWishlistDrawer}
            className="relative p-2.5 rounded-lg border border-[#E3DAC6] bg-[#F8F4EB] text-[#1C1B1A] hover:bg-[#EFE7D8] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Saved Favorites & Wishlist"
            aria-label="View Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-600 text-rose-600' : 'text-[#736E67]'}`} />
            <span className="hidden md:inline">Favorites</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Quick Inquiry Bag (Flipkart Style) */}
          <button
            onClick={onOpenInquiryDrawer}
            className="relative p-2.5 rounded-lg border border-[#E3DAC6] bg-[#F8F4EB] text-[#1C1B1A] hover:bg-[#EFE7D8] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="View Quote & Inquiry List"
          >
            <ShoppingBag className="w-4 h-4 text-[#9A7730]" />
            <span className="hidden sm:inline">Inquiry List</span>
            {totalItemCount > 0 && (
              <span className="bg-[#9A7730] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Admin CMS Trigger (Protected by Authentication) */}
          <button
            onClick={onOpenAdminModal}
            className="p-2.5 rounded-lg border border-[#E3DAC6] bg-[#F8F4EB] text-[#4A4744] hover:text-[#1C1B1A] hover:bg-[#EFE7D8] transition-colors"
            title="Atelier Admin Control Panel (Protected)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Direct WhatsApp Callout */}
          <a
            href={buildGeneralWhatsAppLink('Hello Vintage Crafts, I would like to inquire about your handcrafted brass collection.', config.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-[#1C1B1A] hover:bg-[#33312E] rounded-lg transition-colors border border-[#44403C] whitespace-nowrap shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-[#E3DAC6] text-[#1C1B1A] hover:bg-[#F3EDE2]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF8F1] border-b border-[#E3DAC6] px-4 pt-2 pb-5 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#EAE1D1] text-[#1C1B1A] font-semibold'
                    : 'text-[#4A4744] hover:bg-[#F2ECE0]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onOpenWishlistDrawer();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm rounded-md text-[#1C1B1A] hover:bg-[#F2ECE0] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-600 text-rose-600' : 'text-[#736E67]'}`} />
                <span>Saved Favorites & Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E3DAC6] flex flex-col gap-2">
            <a
              href={`tel:${config.whatsappNumber}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#4A4744] hover:text-[#1C1B1A]"
            >
              <Phone className="w-4 h-4 text-[#9A7730]" />
              <span>Call: +91 {config.whatsappNumber}</span>
            </a>
            <a
              href={buildGeneralWhatsAppLink('Hello Vintage Crafts, I would like to inquire via mobile.', config.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1C1B1A] rounded-lg"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Direct WhatsApp (+91 {config.whatsappNumber})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
