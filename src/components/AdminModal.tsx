import React from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  FileSpreadsheet,
  MessageCircle,
  Settings,
  Package,
  Sliders,
  Download,
  ExternalLink,
  Copy,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import { Product, SiteConfig, LeadSubmission, StockStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/defaultProducts';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/defaultConfig';
import { exportLeadsToCsv } from '../utils/googleSheets';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  leads: LeadSubmission[];
  onUpdateLeadStatus: (leadId: string, status: LeadSubmission['status']) => void;
  onSignOut: () => void;
}

type AdminTab = 'articles' | 'leads' | 'whatsapp' | 'hero' | 'settings';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  config,
  onUpdateConfig,
  leads,
  onUpdateLeadStatus,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = React.useState<AdminTab>('articles');

  // Edit / Add Product State
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Product>>({
    title: '',
    sku: '',
    category: 'Nautical Optics',
    materialSpec: 'Solid Cast Brass & Hardwood',
    finish: 'Antique Polish Lacquered',
    dimensions: '10" × 10"',
    weight: '2.5 kg',
    price: 4500,
    mrp: 6500,
    stockStatus: 'in_stock',
    stockCount: 10,
    featured: false,
    shortDescription: '',
    fullStory: '',
    svgPreset: 'telescope',
  });

  // Local SiteConfig form state
  const [localConfig, setLocalConfig] = React.useState<SiteConfig>(config);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [savedSuccessAlert, setSavedSuccessAlert] = React.useState(false);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingProductId(null);
    setIsAddingNew(true);
    setFormData({
      id: `art-${Date.now().toString().slice(-4)}`,
      sku: `VC-NEW-${Math.floor(Math.random() * 90 + 10)}`,
      title: 'Handcrafted Victorian Celestial Armillary Sphere',
      category: 'Astrolabes & Armillary',
      materialSpec: 'Solid Hand-Turned Brass',
      finish: 'Mirror Polished Gold Brass',
      dimensions: '12" Height × 8" Diameter',
      weight: '2.8 kg',
      price: 6800,
      mrp: 9500,
      stockStatus: 'in_stock',
      stockCount: 8,
      rating: 5.0,
      reviewsCount: 1,
      featured: true,
      shortDescription: 'Historically accurate brass armillary globe with concentric zodiac bands.',
      fullStory: 'Features rotatable meridian circles and equatorial coordinate markings over an antique turned brass pedestal.',
      svgPreset: 'astrolabe',
      highlights: [
        'Engraved zodiac bands and latitude axes',
        'Turned weighted solid brass pedestal',
        'Multi-axis smooth rotation',
      ],
    });
  };

  const handleStartEdit = (product: Product) => {
    setIsAddingNew(false);
    setEditingProductId(product.id);
    setFormData({ ...product });
  };

  const handleSaveProduct = () => {
    if (!formData.title || !formData.price) return;

    if (isAddingNew) {
      const newProd: Product = {
        id: formData.id || `art-${Date.now()}`,
        sku: formData.sku || `VC-${Math.floor(Math.random() * 1000)}`,
        title: formData.title,
        category: formData.category || 'Nautical Optics',
        materialSpec: formData.materialSpec || 'Solid Brass',
        finish: formData.finish || 'Antique Polish',
        dimensions: formData.dimensions || '10" Height',
        weight: formData.weight || '1.5 kg',
        price: Number(formData.price) || 2000,
        mrp: Number(formData.mrp) || Number(formData.price) * 1.4,
        stockStatus: (formData.stockStatus as StockStatus) || 'in_stock',
        stockCount: Number(formData.stockCount) || 5,
        rating: formData.rating || 5.0,
        reviewsCount: formData.reviewsCount || 12,
        featured: Boolean(formData.featured),
        shortDescription: formData.shortDescription || formData.title,
        fullStory: formData.fullStory || formData.title,
        svgPreset: formData.svgPreset || 'telescope',
        imageUrl: formData.imageUrl || undefined,
        highlights: formData.highlights || ['100% Solid Cast Brass Metallurgy', 'Direct Foundry Craftsmanship'],
      };
      onAddProduct(newProd);
      setIsAddingNew(false);
    } else if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        const updated: Product = {
          ...existing,
          ...formData,
          price: Number(formData.price),
          mrp: Number(formData.mrp),
          stockCount: Number(formData.stockCount),
        } as Product;
        onUpdateProduct(updated);
        setEditingProductId(null);
      }
    }

    setSavedSuccessAlert(true);
    setTimeout(() => setSavedSuccessAlert(false), 2500);
  };

  const handleSaveConfig = () => {
    onUpdateConfig(localConfig);
    setSavedSuccessAlert(true);
    setTimeout(() => setSavedSuccessAlert(false), 2500);
  };

  const copyScriptCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1B1A]/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-2xl border border-[#D9CEB7] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="px-6 py-4 bg-[#1C1B1A] text-white flex items-center justify-between border-b border-[#3D3A37]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#33302D] border border-[#C5A059] flex items-center justify-center text-[#DFBF7B]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase font-serif tracking-widest text-[#DFBF7B]">
                Atelier Admin Control Panel
              </div>
              <h2 className="text-base font-bold text-white">
                Content & Commerce Operations
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccessAlert && (
              <span className="text-xs text-[#25D366] font-semibold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Changes Published Live
              </span>
            )}
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#DFBF7B] hover:text-white hover:bg-[#33302D] border border-[#44403C] flex items-center gap-1.5 transition-colors"
              title="Lock Admin Session and Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A8A196] hover:text-white hover:bg-[#2C2927]"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-6 bg-[#F8F4EB] border-b border-[#E3DAC6] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'articles'
                ? 'border-[#C5A059] text-[#1C1B1A]'
                : 'border-transparent text-[#666159] hover:text-[#1C1B1A]'
            }`}
          >
            <Package className="w-4 h-4 text-[#9A7730]" />
            <span>Manage Artifacts & Prices ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'leads'
                ? 'border-[#C5A059] text-[#1C1B1A]'
                : 'border-transparent text-[#666159] hover:text-[#1C1B1A]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#9A7730]" />
            <span>Google Sheet Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'whatsapp'
                ? 'border-[#C5A059] text-[#1C1B1A]'
                : 'border-transparent text-[#666159] hover:text-[#1C1B1A]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Bot Rules (9457940460)</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'hero'
                ? 'border-[#C5A059] text-[#1C1B1A]'
                : 'border-transparent text-[#666159] hover:text-[#1C1B1A]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#9A7730]" />
            <span>Hero & Announcement UI</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#C5A059] text-[#1C1B1A]'
                : 'border-transparent text-[#666159] hover:text-[#1C1B1A]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#9A7730]" />
            <span>Google Sheet Apps Script Setup</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: ARTICLES / PRODUCTS */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF6EE] p-4 rounded-xl border border-[#E3DAC6]">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C1B1A]">
                    Artifact Catalog Management
                  </h3>
                  <p className="text-xs text-[#6B665E]">
                    Control real-time prices, descriptions, metallurgy specs, and stock availability shown to customers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onResetProducts}
                    className="px-3 py-2 text-xs font-medium border border-[#D9CEB7] rounded-lg bg-white text-[#524E47] hover:bg-[#F2ECE0] flex items-center gap-1.5"
                    title="Reset to factory catalog"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleStartAdd}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#1C1B1A] text-white hover:bg-[#33312E] flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4 text-[#C5A059]" />
                    <span>Add New Artifact</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Form Modal Sub-view */}
              {(isAddingNew || editingProductId) && (
                <div className="p-5 rounded-2xl bg-white border-2 border-[#C5A059] shadow-md space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
                    <h4 className="font-serif text-base font-bold text-[#1C1B1A]">
                      {isAddingNew ? 'Add New Artifact / Article' : `Editing: ${formData.title}`}
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ● Live on UI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#1C1B1A] mb-1">Article Title *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={formData.sku || ''}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      >
                        <option value="Nautical Optics">Nautical Optics</option>
                        <option value="Vintage Clocks">Vintage Clocks</option>
                        <option value="Compasses & Sundials">Compasses & Sundials</option>
                        <option value="Medieval & Armor">Medieval & Armor</option>
                        <option value="Astrolabes & Armillary">Astrolabes & Armillary</option>
                        <option value="Desk Decor">Desk Decor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Material Spec</label>
                      <input
                        type="text"
                        value={formData.materialSpec || ''}
                        onChange={(e) => setFormData({ ...formData, materialSpec: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">MRP (₹) *</label>
                      <input
                        type="number"
                        value={formData.mrp || 0}
                        onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Stock Status</label>
                      <select
                        value={formData.stockStatus}
                        onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as StockStatus })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      >
                        <option value="in_stock">In Stock (Ready to Ship)</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="made_to_order">Made to Order (Bespoke)</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Stock Units</label>
                      <input
                        type="number"
                        value={formData.stockCount || 0}
                        onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Dimensions</label>
                      <input
                        type="text"
                        value={formData.dimensions || ''}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Net Weight</label>
                      <input
                        type="text"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#1C1B1A] mb-1">Vector Illustration Preset</label>
                      <select
                        value={formData.svgPreset}
                        onChange={(e) => setFormData({ ...formData, svgPreset: e.target.value as Product['svgPreset'] })}
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      >
                        <option value="telescope">Nautical Spyglass Telescope</option>
                        <option value="compass">Brunton Sundial Compass</option>
                        <option value="clock">Victorian Station Clock</option>
                        <option value="astrolabe">Medieval Astrolabe Sphere</option>
                        <option value="helmet">Deep Sea Diving Helmet</option>
                        <option value="hourglass">Nautical Gimbal Hourglass</option>
                        <option value="sextant">Marine Vernier Sextant</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#1C1B1A] mb-1">
                        Optional Image URL (Leave blank to use polished vector artwork)
                      </label>
                      <input
                        type="text"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://... or /assets/..."
                        className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-bold text-[#1C1B1A] mb-1">Article Story / Description</label>
                    <textarea
                      rows={3}
                      value={formData.fullStory || ''}
                      onChange={(e) => setFormData({ ...formData, fullStory: e.target.value, shortDescription: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-[#C5A059] text-[#9A7730]"
                      />
                      <span>Feature on Front-Page Showcase</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsAddingNew(false);
                          setEditingProductId(null);
                        }}
                        className="px-4 py-2 rounded-lg border border-[#D9CEB7] text-xs font-medium hover:bg-[#F2ECE0]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProduct}
                        className="px-5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#1C1B1A] font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Publish to UI ✓</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-[#D9CEB7] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F4EB] border-b border-[#E3DAC6] text-[#635E57] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Artifact</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">MRP</th>
                        <th className="py-3 px-3">Stock</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE7D8]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF6EE] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#1C1B1A]">
                            <div className="flex items-center gap-2">
                              {p.featured && (
                                <span className="w-2 h-2 rounded-full bg-[#C5A059]" title="Featured piece" />
                              )}
                              <span>{p.title}</span>
                            </div>
                            <div className="text-[11px] text-[#787268] font-normal truncate max-w-xs">
                              {p.materialSpec}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[#4A4744]">{p.sku}</td>
                          <td className="py-3 px-3 text-[#5A5650]">{p.category}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#1C1B1A]">
                            ₹{p.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#8F897F] line-through">
                            ₹{p.mrp.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.stockStatus === 'in_stock'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.stockStatus === 'low_stock'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {p.stockStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded hover:bg-[#EAE0CE] text-[#524E47]"
                                title="Edit specs & price"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                title="Delete artifact"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEADS (EMBEDDED GOOGLE SHEET VIEW) */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF6EE] p-4 rounded-xl border border-[#E3DAC6]">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C1B1A]">
                    Incoming Google Sheet Lead Pipeline
                  </h3>
                  <p className="text-xs text-[#6B665E]">
                    Real-time customer inquiries received through the website contact form and WhatsApp orders.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportLeadsToCsv(leads)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#D9CEB7] hover:bg-[#F2ECE0] flex items-center gap-1.5 text-[#1C1B1A]"
                  >
                    <Download className="w-3.5 h-3.5 text-[#9A7730]" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-xl border border-[#D9CEB7] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F4EB] border-b border-[#E3DAC6] text-[#635E57] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Timestamp & ID</th>
                        <th className="py-3 px-3">Client Name</th>
                        <th className="py-3 px-3">Phone / WhatsApp</th>
                        <th className="py-3 px-3">Artifact Selected</th>
                        <th className="py-3 px-2">Qty</th>
                        <th className="py-3 px-3">Inquiry Type</th>
                        <th className="py-3 px-3">Message</th>
                        <th className="py-3 px-4">Lead Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE7D8]">
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-[#8F897F]">
                            No leads submitted yet. Submit a test inquiry on the Contact page.
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-[#FAF6EE]">
                            <td className="py-3 px-4 font-mono">
                              <div className="font-bold text-[#1C1B1A]">{lead.id}</div>
                              <div className="text-[10px] text-[#8F897F]">{lead.timestamp}</div>
                            </td>
                            <td className="py-3 px-3 font-semibold text-[#1C1B1A]">
                              {lead.fullName}
                              <div className="text-[10px] text-[#716C64] font-normal">{lead.email}</div>
                            </td>
                            <td className="py-3 px-3">
                              <a
                                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                                  lead.fullName
                                )},%20this%20is%20Vintage%20Crafts%20regarding%20your%20inquiry.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 font-mono font-bold hover:underline flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3 text-[#25D366]" />
                                <span>{lead.phone}</span>
                              </a>
                            </td>
                            <td className="py-3 px-3 font-medium text-[#1C1B1A] max-w-xs truncate">
                              {lead.productName}
                            </td>
                            <td className="py-3 px-2 font-mono font-bold">{lead.quantity}</td>
                            <td className="py-3 px-3 text-[#5A5650]">{lead.inquiryType}</td>
                            <td className="py-3 px-3 text-[#5A5650] max-w-xs truncate" title={lead.message}>
                              {lead.message}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadSubmission['status'])}
                                className={`text-[11px] font-bold px-2 py-1 rounded border ${
                                  lead.status === 'New'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : lead.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : lead.status === 'Quoted'
                                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Quoted">Quoted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP BOT RULES */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#E3DAC6] space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <h3 className="font-serif text-base font-bold text-[#1C1B1A]">
                    WhatsApp Direct Inquiry Engine Settings
                  </h3>
                </div>
                <p className="text-xs text-[#6B665E]">
                  Every inquiry button across the site points directly to your official WhatsApp phone on <span className="font-mono font-bold text-[#1C1B1A]">9457940460</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block font-bold text-[#1C1B1A] mb-1">
                      Store WhatsApp Number (No spaces/dashes)
                    </label>
                    <input
                      type="text"
                      value={localConfig.whatsappNumber}
                      onChange={(e) => setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white font-mono font-bold text-sm"
                    />
                    <p className="mt-1 text-[11px] text-[#8F897F]">
                      Active owner number: 9457940460
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1B1A] mb-1">
                      Display Hotline
                    </label>
                    <input
                      type="text"
                      value={localConfig.phoneNumber}
                      onChange={(e) => setLocalConfig({ ...localConfig, phoneNumber: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="text-xs pt-2">
                  <label className="block font-bold text-[#1C1B1A] mb-1">
                    Pre-filled Instant Inquiry Message Template
                  </label>
                  <textarea
                    rows={3}
                    value={localConfig.whatsappMessageTemplate}
                    onChange={(e) => setLocalConfig({ ...localConfig, whatsappMessageTemplate: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white font-mono text-xs"
                  />
                  <p className="mt-1 text-[11px] text-[#8F897F]">
                    Supported dynamic tags: <code className="bg-[#EAE0CE] px-1 py-0.5 rounded">&#123;product_name&#125;</code>, <code className="bg-[#EAE0CE] px-1 py-0.5 rounded">&#123;sku&#125;</code>, <code className="bg-[#EAE0CE] px-1 py-0.5 rounded">&#123;price&#125;</code>, <code className="bg-[#EAE0CE] px-1 py-0.5 rounded">&#123;category&#125;</code>
                  </p>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#C5A059]" />
                    <span>Save WhatsApp Rules</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HERO & BANNER UI */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#E3DAC6] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1C1B1A]">
                  Hero Headline & Store Announcement
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1C1B1A] mb-1">Store Name</label>
                    <input
                      type="text"
                      value={localConfig.storeName}
                      onChange={(e) => setLocalConfig({ ...localConfig, storeName: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1B1A] mb-1">Tagline</label>
                    <input
                      type="text"
                      value={localConfig.tagline}
                      onChange={(e) => setLocalConfig({ ...localConfig, tagline: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1B1A] mb-1">Main Hero Headline</label>
                    <input
                      type="text"
                      value={localConfig.headline}
                      onChange={(e) => setLocalConfig({ ...localConfig, headline: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1B1A] mb-1">Subheadline</label>
                    <textarea
                      rows={2}
                      value={localConfig.subheadline}
                      onChange={(e) => setLocalConfig({ ...localConfig, subheadline: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#EAE3D2]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-[#1C1B1A]">Top Header Announcement Bar</label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localConfig.showAnnouncement}
                          onChange={(e) => setLocalConfig({ ...localConfig, showAnnouncement: e.target.checked })}
                          className="rounded border-[#C5A059] text-[#9A7730]"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={localConfig.announcementText}
                      onChange={(e) => setLocalConfig({ ...localConfig, announcementText: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#C5A059]" />
                    <span>Publish UI Updates</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE APPS SCRIPT WEBHOOK SETUP */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#E3DAC6] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#9A7730]" />
                    <h3 className="font-serif text-base font-bold text-[#1C1B1A]">
                      Google Sheets Live Webhook Sync
                    </h3>
                  </div>
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#9A7730] hover:underline flex items-center gap-1"
                  >
                    <span>Create New Google Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-[#6B665E]">
                  To sync customer leads into your private Google Sheet in real time with zero monthly fee, deploy this 15-line Google Apps Script in your spreadsheet.
                </p>

                <div className="text-xs">
                  <label className="block font-bold text-[#1C1B1A] mb-1">
                    Your Google Apps Script Webhook Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={localConfig.googleSheetsWebhookUrl}
                    onChange={(e) => setLocalConfig({ ...localConfig, googleSheetsWebhookUrl: e.target.value })}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white font-mono text-xs"
                  />
                </div>

                <div className="text-xs pt-2 border-t border-[#EAE3D2]">
                  <label className="block font-bold text-[#1C1B1A] mb-1">
                    Administrator Login Passkey / Password
                  </label>
                  <input
                    type="text"
                    value={localConfig.adminPasskey || 'atelier1879'}
                    onChange={(e) => setLocalConfig({ ...localConfig, adminPasskey: e.target.value })}
                    placeholder="e.g. atelier1879"
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB7] bg-white font-mono text-xs font-bold"
                  />
                  <p className="mt-1 text-[11px] text-[#8F897F]">
                    Controls access to this control panel. Default passkey: <code>atelier1879</code>
                  </p>
                </div>

                {/* Code snippet display */}
                <div className="relative rounded-xl bg-[#1C1B1A] text-[#F3EFE6] p-4 font-mono text-[11px] overflow-x-auto max-h-56">
                  <button
                    onClick={copyScriptCode}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#33302D] hover:bg-[#47433F] text-xs text-[#DFBF7B] flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Script Code'}</span>
                  </button>
                  <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#C5A059]" />
                    <span>Save Webhook Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
