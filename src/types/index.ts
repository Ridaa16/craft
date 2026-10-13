export type StockStatus = 'in_stock' | 'low_stock' | 'made_to_order' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: 'Nautical Optics' | 'Vintage Clocks' | 'Compasses & Sundials' | 'Medieval & Armor' | 'Astrolabes & Armillary' | 'Desk Decor';
  materialSpec: string;
  finish: string;
  dimensions: string;
  weight: string;
  price: number;
  mrp: number;
  stockStatus: StockStatus;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  shortDescription: string;
  fullStory: string;
  imageUrl?: string;
  svgPreset: 'telescope' | 'compass' | 'clock' | 'astrolabe' | 'helmet' | 'sextant' | 'hourglass' | 'bell';
  highlights: string[];
  isWishlisted?: boolean;
}

export interface LeadSubmission {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  productId?: string;
  productName: string;
  quantity: number;
  inquiryType: 'Individual Purchase' | 'Bulk Order' | 'Custom Engraving' | 'Corporate Gifting';
  message: string;
  status: 'New' | 'In Progress' | 'Quoted' | 'Closed';
  syncedToGoogleSheets: boolean;
}

export interface InquiryItem {
  product: Product;
  quantity: number;
}

export interface SiteConfig {
  storeName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  announcementText: string;
  showAnnouncement: boolean;
  phoneNumber: string;
  whatsappNumber: string; // "9457940460"
  email: string;
  address: string;
  googleSheetsWebhookUrl: string;
  whatsappMessageTemplate: string;
  adminPasskey?: string;
}
