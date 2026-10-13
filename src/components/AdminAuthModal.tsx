import React from 'react';
import { X, Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { SiteConfig } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onAuthenticated: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  config,
  onAuthenticated,
}) => {
  const [passkey, setPasskey] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [rememberSession, setRememberSession] = React.useState(true);

  if (!isOpen) return null;

  const validPasskey = config.adminPasskey || 'atelier1879';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (passkey.trim() === validPasskey) {
      if (rememberSession) {
        localStorage.setItem('vc_admin_authenticated', 'true');
      } else {
        sessionStorage.setItem('vc_admin_authenticated', 'true');
      }
      onAuthenticated();
      onClose();
      setPasskey('');
    } else {
      setErrorMsg('Incorrect authentication passkey. Please check and try again.');
    }
  };

  const handleUseDefaultHint = () => {
    setPasskey(validPasskey);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1B1A]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-2xl border border-[#D9CEB7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1C1B1A] text-white flex items-center justify-between border-b border-[#3D3A37]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#33302D] border border-[#C5A059] flex items-center justify-center text-[#DFBF7B]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase font-serif tracking-widest text-[#DFBF7B]">
                Security Gateway
              </div>
              <h3 className="text-sm font-bold text-white">Atelier Admin Authentication</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#948D82] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <p className="text-xs text-[#5E5A54] leading-relaxed mb-5">
            Authorized foundry personnel only. Enter your administrator passkey to access the inventory catalog, update prices, manage stock, and view customer Google Sheet leads.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-1.5">
                Admin Passkey / Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9A7730]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter administrator passkey..."
                  className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-[#D9CEB7] bg-white text-[#1C1B1A] font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8F897F] hover:text-[#1C1B1A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#5C5750]">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-[#C5A059] text-[#9A7730] focus:ring-[#C5A059]"
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={handleUseDefaultHint}
                className="text-[11px] text-[#9A7730] hover:underline"
              >
                Autofill Default Key
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Unlock Atelier Control Panel</span>
              </button>
            </div>
          </form>

          {/* Security note */}
          <div className="mt-5 pt-4 border-t border-[#EAE3D2] text-[11px] text-[#8F897F] flex items-center justify-between">
            <span>Default Passkey: <code className="font-mono bg-[#EAE0CE] px-1 py-0.5 rounded text-[#1C1B1A]">atelier1879</code></span>
            <span>256-Bit Foundry Guard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
