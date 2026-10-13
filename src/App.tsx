/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { Product, SiteConfig, LeadSubmission, InquiryItem } from './types';
import { INITIAL_PRODUCTS } from './data/defaultProducts';
import { INITIAL_SITE_CONFIG, INITIAL_LEADS } from './data/defaultConfig';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { InquiryDrawer } from './components/InquiryDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ContactSection } from './components/ContactSection';
import { CraftStorySection } from './components/CraftStorySection';
import { AdminModal } from './components/AdminModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { buildGeneralWhatsAppLink } from './utils/whatsapp';

export default function App() {
  // Persistence with localStorage
  const [products, setProducts] = React.useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vc_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [config, setConfig] = React.useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('vc_config');
      return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
    } catch {
      return INITIAL_SITE_CONFIG;
    }
  });

  const [leads, setLeads] = React.useState<LeadSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('vc_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [inquiryItems, setInquiryItems] = React.useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem('vc_inquiry_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  React.useEffect(() => {
    localStorage.setItem('vc_products', JSON.stringify(products));
  }, [products]);

  React.useEffect(() => {
    localStorage.setItem('vc_config', JSON.stringify(config));
  }, [config]);

  React.useEffect(() => {
    localStorage.setItem('vc_leads', JSON.stringify(leads));
  }, [leads]);

  React.useEffect(() => {
    localStorage.setItem('vc_inquiry_items', JSON.stringify(inquiryItems));
  }, [inquiryItems]);

  // UI state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Artifacts');
  const [sortBy, setSortBy] = React.useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [stockFilter, setStockFilter] = React.useState<'all' | 'in_stock' | 'made_to_order'>('all');
  const [filterOnlyFavorites, setFilterOnlyFavorites] = React.useState(false);

  const [selectedProductForModal, setSelectedProductForModal] = React.useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isInquiryDrawerOpen, setIsInquiryDrawerOpen] = React.useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = React.useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = React.useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = React.useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('vc_admin_authenticated') === 'true' ||
        sessionStorage.getItem('vc_admin_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [activeNavSection, setActiveNavSection] = React.useState('collection');
  const [contactPreselectedProduct, setContactPreselectedProduct] = React.useState<Product | null>(null);

  // Wishlist computed array
  const wishlistProducts = React.useMemo(() => {
    return products.filter((p) => Boolean(p.isWishlisted));
  }, [products]);

  // Categories list
  const categories = React.useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['All Artifacts', ...list];
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        // Saved favorites filter
        if (filterOnlyFavorites && !p.isWishlisted) {
          return false;
        }
        // Category
        if (selectedCategory !== 'All Artifacts' && p.category !== selectedCategory) {
          return false;
        }
        // Stock
        if (stockFilter === 'in_stock' && p.stockStatus !== 'in_stock') {
          return false;
        }
        if (stockFilter === 'made_to_order' && p.stockStatus !== 'made_to_order') {
          return false;
        }
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.title.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.materialSpec.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, stockFilter, filterOnlyFavorites, searchQuery, sortBy]);

  // Handlers
  const handleOpenDetails = (product: Product) => {
    setSelectedProductForModal(product);
    setIsDetailsModalOpen(true);
  };

  const handleToggleInquiryItem = (product: Product) => {
    setInquiryItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleAddToInquiry = (product: Product, quantity = 1) => {
    setInquiryItems((prev) => {
      const index = prev.findIndex((item) => item.product.id === product.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { product, quantity };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    setIsInquiryDrawerOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setInquiryItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveInquiryItem = (productId: string) => {
    setInquiryItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearInquiry = () => {
    setInquiryItems([]);
  };

  // Wishlist handlers
  const handleToggleWishlist = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isWishlisted: !p.isWishlisted } : p))
    );
  };

  const handleClearWishlist = () => {
    setProducts((prev) => prev.map((p) => ({ ...p, isWishlisted: false })));
  };

  const handleMoveAllWishlistToInquiryCart = () => {
    wishlistProducts.forEach((prod) => handleAddToInquiry(prod, 1));
    setIsWishlistDrawerOpen(false);
    setIsInquiryDrawerOpen(true);
  };

  // Admin Authentication handlers
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminModalOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    setIsAdminModalOpen(true);
  };

  const handleAdminSignOut = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('vc_admin_authenticated');
      sessionStorage.removeItem('vc_admin_authenticated');
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigate = (section: string) => {
    setActiveNavSection(section);
    if (section === 'collection') {
      const el = document.getElementById('catalog-grid');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'craft-story') {
      const el = document.getElementById('craft-story');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact' || section === 'bulk-orders') {
      const el = document.getElementById('contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lead handling
  const handleLeadRecorded = (newLead: LeadSubmission) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Admin callbacks
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('vc_products');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1B1A] flex flex-col font-sans selection:bg-[#C5A059]/25 selection:text-[#1C1B1A]">
      {/* 1. Header / Navbar */}
      <Navbar
        config={config}
        inquiryItems={inquiryItems}
        onOpenInquiryDrawer={() => setIsInquiryDrawerOpen(true)}
        wishlistCount={wishlistProducts.length}
        onOpenWishlistDrawer={() => setIsWishlistDrawerOpen(true)}
        onOpenAdminModal={handleOpenAdmin}
        activeSection={activeNavSection}
        onNavigate={handleNavigate}
      />

      {/* 2. Hero Section */}
      <Hero
        config={config}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        totalProductsCount={products.length}
        onOpenBulkInquiry={() => handleNavigate('contact')}
      />

      {/* 3. Product Catalog Grid */}
      <main id="catalog-grid" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Controls and Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D2]">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-2xl font-bold text-[#1C1B1A]">
              {filterOnlyFavorites ? 'Saved Favorites & Wishlist' : selectedCategory}
            </h2>
            <span className="text-xs text-[#716C64] font-mono">
              ({filteredProducts.length} pieces available)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Saved Favorites Filter Button */}
            <button
              onClick={() => setFilterOnlyFavorites(!filterOnlyFavorites)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                filterOnlyFavorites
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                  : 'bg-[#F9F5EC] text-[#55504A] border-[#DFD5C2] hover:bg-[#F0E8D7] hover:text-[#1C1B1A]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filterOnlyFavorites ? 'fill-rose-600 text-rose-600' : 'text-[#8F897F]'}`} />
              <span>Favorites ({wishlistProducts.length})</span>
            </button>

            {/* Stock status filter */}
            <div className="flex items-center gap-1 p-1 bg-[#F5EFE3] rounded-lg border border-[#E3DAC6] text-xs">
              <button
                onClick={() => {
                  setStockFilter('all');
                  setFilterOnlyFavorites(false);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  stockFilter === 'all' && !filterOnlyFavorites
                    ? 'bg-white text-[#1C1B1A] font-bold shadow-2xs'
                    : 'text-[#615C55] hover:text-[#1C1B1A]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setStockFilter('in_stock');
                  setFilterOnlyFavorites(false);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  stockFilter === 'in_stock' && !filterOnlyFavorites
                    ? 'bg-white text-[#1C1B1A] font-bold shadow-2xs'
                    : 'text-[#615C55] hover:text-[#1C1B1A]'
                }`}
              >
                Ready to Ship
              </button>
              <button
                onClick={() => {
                  setStockFilter('made_to_order');
                  setFilterOnlyFavorites(false);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  stockFilter === 'made_to_order' && !filterOnlyFavorites
                    ? 'bg-white text-[#1C1B1A] font-bold shadow-2xs'
                    : 'text-[#615C55] hover:text-[#1C1B1A]'
                }`}
              >
                Bespoke Order
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none pl-8 pr-8 py-1.5 rounded-lg border border-[#D9CEB7] bg-white text-xs text-[#1C1B1A] font-medium focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              >
                <option value="featured">Featured Curations</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated (4.8+)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9A7730] absolute left-2.5 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-[#8F897F] absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Cards Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-[#736E67]">
            <p className="font-serif text-lg font-bold text-[#1C1B1A]">
              {filterOnlyFavorites
                ? 'You have not added any items to your Wishlist yet.'
                : 'No Brass Artifacts Match Your Filter'}
            </p>
            <p className="text-xs text-[#8F897F] mt-1">
              {filterOnlyFavorites
                ? 'Click the heart icon on any brass piece to save it to your curated collection.'
                : 'Try adjusting your search query or reset filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Artifacts');
                setStockFilter('all');
                setFilterOnlyFavorites(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#1C1B1A] text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isInInquiryList = inquiryItems.some((item) => item.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  config={config}
                  onOpenDetails={handleOpenDetails}
                  onToggleInquiryItem={handleToggleInquiryItem}
                  isInInquiryList={isInInquiryList}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={Boolean(product.isWishlisted)}
                />
              );
            })}
          </div>
        )}

        {/* Bulk custom orders banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1C1B1A] via-[#2E2B28] to-[#1C1B1A] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#C5A059]/30">
          <div>
            <div className="text-xs font-serif uppercase tracking-widest text-[#DFBF7B] font-semibold mb-1">
              Custom Foundry Casting & Architecture
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Looking for Custom Dimensions, Hotel Installations, or Bulk Corporate Gifting?
            </h3>
            <p className="text-xs text-[#D1CBC1] mt-1 max-w-2xl">
              We provide full-scale foundry customizations, custom laser-etched insignia plaques, and bespoke velvet-lined wooden presentation cases. Direct phone support on 9457940460.
            </p>
          </div>

          <a
            href={buildGeneralWhatsAppLink('Hello Vintage Crafts, I would like to discuss a custom brass architectural installation / bulk gifting order.', config.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2612] text-xs font-bold tracking-wide flex items-center gap-2 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Connect on WhatsApp (+91 {config.whatsappNumber})</span>
          </a>
        </div>
      </main>

      {/* 4. Craft Story Section */}
      <CraftStorySection />

      {/* 5. Contact Section with Google Sheets Webhook Sync */}
      <ContactSection
        products={products}
        config={config}
        onLeadRecorded={handleLeadRecorded}
        preselectedProduct={contactPreselectedProduct}
      />

      {/* 6. Footer */}
      <footer className="bg-[#1C1B1A] text-[#EDE7DA] border-t border-[#3B3834] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#3B3834]">
            {/* Col 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded border border-[#C5A059] bg-[#2A2825] flex items-center justify-center text-[#DFBF7B] font-serif font-bold text-xs">
                  VC
                </div>
                <span className="font-serif text-lg font-bold text-white tracking-tight">
                  {config.storeName}
                </span>
              </div>
              <p className="text-xs text-[#A8A196] leading-relaxed">
                Direct factory craftsmanship of handcrafted solid brass artifacts, nautical spyglasses, celestial horology, and armor reproductions.
              </p>
              <div className="mt-3 text-[11px] text-[#DFBF7B]">
                Inspired by <a href="https://www.vintagecrafts.net.in/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">vintagecrafts.net.in</a>
              </div>
            </div>

            {/* Col 2: Categories */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#DFBF7B] mb-3">
                Collections
              </div>
              <ul className="space-y-1.5 text-xs text-[#A8A196]">
                {categories.slice(1).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        handleNavigate('collection');
                      }}
                      className="hover:text-white transition-colors text-left"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Direct Inquiry Phone */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#DFBF7B] mb-3">
                Direct Foundry Hotline
              </div>
              <div className="space-y-2 text-xs text-[#A8A196]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Call: +91 {config.whatsappNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp: +91 {config.whatsappNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{config.email}</span>
                </div>
              </div>
            </div>

            {/* Col 4: Foundry Address & Admin */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#DFBF7B] mb-3">
                Atelier Location
              </div>
              <p className="text-xs text-[#A8A196] leading-relaxed">
                {config.address}
              </p>
              <div className="mt-4">
                <button
                  onClick={handleOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-xs text-[#DFBF7B] hover:text-white underline underline-offset-2"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Open Atelier Admin Panel (Protected)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F7970] gap-3">
            <div>
              © {new Date().getFullYear()} Vintage Crafts Atelier. All Rights Reserved. Solid Brass Metallurgy Guaranteed.
            </div>
            <div className="flex items-center gap-4">
              <span>Zero Middlemen Markups</span>
              <span>·</span>
              <span>Export-Grade Quality</span>
              <span>·</span>
              <span>Pan-India Transit Insurance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. Modals & Drawers */}
      <ProductDetailsModal
        product={selectedProductForModal}
        config={config}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onAddToInquiry={handleAddToInquiry}
        isInInquiryList={
          selectedProductForModal
            ? inquiryItems.some((i) => i.product.id === selectedProductForModal.id)
            : false
        }
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={Boolean(selectedProductForModal?.isWishlisted)}
      />

      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistProducts={wishlistProducts}
        onToggleWishlist={handleToggleWishlist}
        onClearWishlist={handleClearWishlist}
        onMoveToInquiryCart={(prod) => handleAddToInquiry(prod, 1)}
        onMoveAllToInquiryCart={handleMoveAllWishlistToInquiryCart}
        config={config}
      />

      <InquiryDrawer
        isOpen={isInquiryDrawerOpen}
        onClose={() => setIsInquiryDrawerOpen(false)}
        items={inquiryItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveInquiryItem}
        onClearAll={handleClearInquiry}
        config={config}
        onProceedToContactForm={() => handleNavigate('contact')}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        config={config}
        onUpdateConfig={setConfig}
        leads={leads}
        onUpdateLeadStatus={(id, status) =>
          setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
        }
        onSignOut={handleAdminSignOut}
      />

      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        config={config}
        onAuthenticated={handleAdminAuthenticated}
      />

      {/* 8. WhatsApp Floating Widget */}
      <WhatsAppFloatingButton whatsappNumber={config.whatsappNumber} />
    </div>
  );
}
