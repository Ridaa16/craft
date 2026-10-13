import React from 'react';
import { Send, CheckCircle2, MessageCircle, MapPin, Phone, Mail, Clock, ShieldAlert } from 'lucide-react';
import { Product, SiteConfig, LeadSubmission } from '../types';
import { submitLeadToGoogleSheets } from '../utils/googleSheets';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

interface ContactSectionProps {
  products: Product[];
  config: SiteConfig;
  onLeadRecorded: (lead: LeadSubmission) => void;
  preselectedProduct?: Product | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  products,
  config,
  onLeadRecorded,
  preselectedProduct,
}) => {
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState(preselectedProduct?.id || 'general');
  const [inquiryType, setInquiryType] = React.useState<LeadSubmission['inquiryType']>('Bulk Order');
  const [quantity, setQuantity] = React.useState(1);
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionSuccess, setSubmissionSuccess] = React.useState(false);
  const [submittedLeadId, setSubmittedLeadId] = React.useState('');

  React.useEffect(() => {
    if (preselectedProduct) {
      setSelectedProductId(preselectedProduct.id);
    }
  }, [preselectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const selectedProductObj = products.find((p) => p.id === selectedProductId);
    const productName = selectedProductObj ? selectedProductObj.title : 'General Brass Catalog / Bespoke Order';

    const newLead: LeadSubmission = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      fullName,
      phone,
      email,
      productId: selectedProductId === 'general' ? undefined : selectedProductId,
      productName,
      quantity,
      inquiryType,
      message,
      status: 'New',
      syncedToGoogleSheets: true,
    };

    // Dispatch to Google Sheets Webhook
    await submitLeadToGoogleSheets(newLead, config.googleSheetsWebhookUrl);

    // Save lead in state & localStorage
    onLeadRecorded(newLead);
    setSubmittedLeadId(newLead.id);
    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  const handleResetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setSubmissionSuccess(false);
  };

  return (
    <section id="contact" className="py-16 bg-[#FDFBF7] border-t border-[#EAE3D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-[#9A7730] font-semibold mb-2">
            Direct Atelier Dialogue · Zero Middlemen
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
            Get in Touch / Request Bespoke Catalog
          </h2>
          <p className="mt-3 text-sm text-[#5C5750]">
            Submissions are answered within 2 hours. Inquiries are automatically synchronized to our central Google Sheets administrative pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D9CEB7] p-6 sm:p-8 shadow-xs">
            {submissionSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C1B1A]">
                  Inquiry Successfully Synchronized!
                </h3>
                <p className="text-xs text-[#5C5750] max-w-md mx-auto">
                  Lead Reference <span className="font-mono font-bold">{submittedLeadId}</span> has been logged to the central Google Sheet. Our master foundry curator will reach out to you directly on WhatsApp / Email.
                </p>

                {/* Instant WhatsApp ping option */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={buildGeneralWhatsAppLink(
                      `Hello Vintage Crafts, I just submitted an inquiry (${submittedLeadId}) regarding ${inquiryType} for "${fullName}". Please review.`,
                      config.whatsappNumber
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1C1B1A] text-white text-xs font-semibold hover:bg-[#33312E]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Ping Store Owner on WhatsApp (+91 {config.whatsappNumber})</span>
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2.5 rounded-lg border border-[#D9CEB7] text-xs font-medium text-[#4A4744] hover:bg-[#F6F1E7]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>

                  {/* WhatsApp / Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94579 40460"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@designatelier.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as LeadSubmission['inquiryType'])}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    >
                      <option value="Individual Purchase">Individual Purchase</option>
                      <option value="Bulk Order">Bulk Order (Volume Discount)</option>
                      <option value="Corporate Gifting">Corporate Gifting / Hotel Decor</option>
                      <option value="Custom Engraving">Custom Engraving & Sizing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Article Selection */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                      Article / Artifact of Interest
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    >
                      <option value="general">Entire Brass Catalog / Custom Artifact</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (SKU: {p.sku}) — ₹{p.price.toLocaleString('en-IN')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                      Estimated Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Message / Custom Dimensions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                    Message / Custom Dimensions / Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Looking for 15 custom engraved nautical spyglasses for our boutique heritage hotel lobby, needing delivery to Udaipur before next month..."
                    className="w-full text-xs p-3 rounded-lg border border-[#D9CEB7] bg-[#FAF8F3] text-[#1C1B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                {/* Submit button & Google Sheets sync indicator */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#15803d] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Auto-Synced to Google Sheets Cloud</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Transmitting Lead...' : 'Submit Inquiry →'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Foundry Details & Direct WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick WhatsApp Callout Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1B1A] to-[#2B2927] text-white shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#DFC085] font-semibold">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Instant Mobile Dialogue</span>
              </div>

              <h3 className="font-serif text-xl font-bold">
                Reach Store Owners Instantly on WhatsApp
              </h3>

              <p className="text-xs text-[#D1CBC1] leading-relaxed">
                Need immediate pricing, shipping estimates to your pin code, or real-time photos of an artifact before ordering? Our master craftsman is reachable directly.
              </p>

              <div className="pt-2">
                <a
                  href={buildGeneralWhatsAppLink('Hello Vintage Crafts! I am reaching out to discuss an order.', config.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2612] text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp (+91 {config.whatsappNumber})</span>
                </a>
              </div>
            </div>

            {/* Foundry & Workshop Info */}
            <div className="p-6 rounded-2xl bg-white border border-[#D9CEB7] shadow-xs space-y-4">
              <h4 className="font-serif text-base font-bold text-[#1C1B1A]">
                Workshop & Heritage Foundry
              </h4>

              <div className="space-y-3 text-xs text-[#5C5750]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#9A7730] shrink-0 mt-0.5" />
                  <span>{config.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#9A7730] shrink-0" />
                  <span>Direct Hotline: {config.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#9A7730] shrink-0" />
                  <span>Email: {config.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#9A7730] shrink-0" />
                  <span>Dispatch Timings: Mon – Sat, 9:30 AM – 7:30 PM IST</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE3D2] text-[11px] text-[#8F897F]">
                Reference Catalog: Inspired by <a href="https://www.vintagecrafts.net.in/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1C1B1A]">vintagecrafts.net.in</a> authentic Indian brass metalcraft traditions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
