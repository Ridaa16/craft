import { SiteConfig, LeadSubmission } from '../types';

export const INITIAL_SITE_CONFIG: SiteConfig = {
  storeName: 'Vintage Crafts',
  tagline: 'Luxe Brass Atelier',
  headline: 'Curated Handcrafted Brass Artifacts',
  subheadline: 'Timeless Nautical Optics, Horology & Armor Decor — Direct Factory Craftsmanship with Bespoke Customization.',
  announcementText: 'Export-Grade Solid Brass Artifacts • Free Insured Pan-India Shipping on Orders above ₹2,000 • Direct Factory Prices',
  showAnnouncement: true,
  phoneNumber: '+91 9457940460',
  whatsappNumber: '9457940460',
  email: 'inquiry@vintagecrafts.net.in',
  address: 'Heritage Metal Foundry & Craft Hub, Moradabad - 244001, Uttar Pradesh, India',
  googleSheetsWebhookUrl: 'https://script.google.com/macros/s/AKfycbz_SAMPLE_WEBHOOK_URL/exec',
  whatsappMessageTemplate: 'Hello Vintage Crafts, I am inquiring about {product_name} (SKU: {sku}, Price: {price}). Please confirm stock and delivery timeframe.'
};

export const INITIAL_LEADS: LeadSubmission[] = [
  {
    id: 'lead-1001',
    timestamp: '2026-10-12 18:32',
    fullName: 'Vikramaditya Singhania',
    phone: '+91 98201 44521',
    email: 'vikram.singh@heritageinteriors.com',
    productId: 'art-001',
    productName: 'Master Brass Harbor Spyglass Telescope',
    quantity: 3,
    inquiryType: 'Corporate Gifting',
    message: 'Looking for 3 units with custom brass engraved nameplates for our luxury resort lobby in Goa.',
    status: 'In Progress',
    syncedToGoogleSheets: true
  },
  {
    id: 'lead-1002',
    timestamp: '2026-10-12 14:15',
    fullName: 'Ananya Deshmukh',
    phone: '+91 94579 40460',
    email: 'ananya.d@studioatelier.in',
    productId: 'art-004',
    productName: 'Handcrafted Victorian Celestial Astrolabe',
    quantity: 1,
    inquiryType: 'Individual Purchase',
    message: 'Can this be shipped to Pune before Friday? Need it as an anniversary gift.',
    status: 'New',
    syncedToGoogleSheets: true
  },
  {
    id: 'lead-1003',
    timestamp: '2026-10-11 20:45',
    fullName: 'Col. Rajesh Bakshi (Retd.)',
    phone: '+91 98110 32890',
    email: 'rajesh.bakshi@defenceofficers.org',
    productId: 'art-005',
    productName: 'Royal Navy Deep Sea Diving Helmet Replica',
    quantity: 1,
    inquiryType: 'Individual Purchase',
    message: 'Inquiring about total weight and whether brass polish is coated with clear lacquer to prevent tarnish.',
    status: 'Quoted',
    syncedToGoogleSheets: true
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script Webhook for Vintage Crafts Lead Intake
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click Extensions > Apps Script
 * 3. Replace default code with this script
 * 4. Click Deploy > New Deployment > Select type 'Web app'
 *    - Description: Vintage Crafts Leads Webhook
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into the Atelier Admin Panel!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead ID",
        "Client Name",
        "Phone / WhatsApp",
        "Email",
        "Inquiry Type",
        "Artifact Selected",
        "Quantity",
        "Message / Specs",
        "Lead Status"
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#F4EFE6");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.id || "LEAD-" + Math.floor(Math.random() * 9000 + 1000),
      data.fullName || "",
      data.phone || "",
      data.email || "",
      data.inquiryType || "General Inquiry",
      data.productName || "General Catalog",
      data.quantity || 1,
      data.message || "",
      data.status || "New"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Lead recorded into Google Sheets successfully"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`;
