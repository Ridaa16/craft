import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

interface WhatsAppFloatingButtonProps {
  whatsappNumber: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ whatsappNumber }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [customQuery, setCustomQuery] = React.useState('');

  const quickPrompts = [
    'I want to inquire about bespoke bulk order pricing.',
    'Is custom brass laser engraving available?',
    'What is the dispatch timeframe for Delhi / Mumbai?',
  ];

  const handleSendPrompt = (promptText: string) => {
    const url = buildGeneralWhatsAppLink(promptText, whatsappNumber);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    handleSendPrompt(customQuery);
    setCustomQuery('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Interactive Quick Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-92 bg-[#FDFBF7] rounded-2xl border border-[#D9CEB7] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#1C1B1A] p-4 text-white flex items-center justify-between border-b border-[#3D3A37]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#25D366] text-[#0A2612] flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold font-serif">Vintage Crafts Atelier</div>
                <div className="text-[10px] text-[#A6E8B9] flex items-center gap-1">
                  <span>● Online on WhatsApp (+91 {whatsappNumber})</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#948D82] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-[#F8F5EE] text-xs space-y-3">
            <div className="bg-white p-3 rounded-xl border border-[#E3DAC6] text-[#3D3A36] leading-relaxed">
              Namaste! Looking for hand-crafted nautical optics, Victorian clocks, or custom bulk brass decor? Tap any quick question below or message directly.
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F897F]">
                Quick Inquiries:
              </div>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q)}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-[#F2EADB] border border-[#E0D7C4] text-[11px] text-[#1C1B1A] transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="pt-1 flex gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#D9CEB7] bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-[#1C1B1A] hover:bg-[#33312E] text-[#25D366]"
                title="Send to WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1C1B1A] text-white shadow-xl hover:shadow-2xl border border-[#C5A059]/40 hover:scale-102 transition-all duration-200"
        aria-label="Chat with store owner on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]/20 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#25D366]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold tracking-tight">WhatsApp Inquiry</span>
          <span className="text-[10px] text-[#DFBF7B] font-mono leading-none">+91 {whatsappNumber}</span>
        </div>
      </button>
    </div>
  );
};
