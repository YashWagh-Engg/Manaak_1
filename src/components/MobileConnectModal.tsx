import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  X,
  Copy,
  Check,
  ExternalLink,
  Camera,
  ShieldCheck,
  HelpCircle,
  QrCode,
} from 'lucide-react';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNativeCamera?: () => void;
}

export const MobileConnectModal: React.FC<MobileConnectModalProps> = ({
  isOpen,
  onClose,
  onOpenNativeCamera,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Derive the target mobile URL (prefer shared or window.location.href)
  const mobileUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('#')[0]
      : 'https://ais-pre-3dlmy3zjx54a4hffd43p2x-1014502815382.asia-southeast1.run.app';

  useEffect(() => {
    if (isOpen && mobileUrl) {
      QRCode.toDataURL(mobileUrl, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#0F172A',
          light: '#F8FAFC',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR Code:', err));
    }
  }, [isOpen, mobileUrl]);

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden text-slate-200 my-auto">
        {/* Header HUD */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Mobile Field Officer Setup
              </div>
              <h3 className="text-sm font-semibold text-white">
                How to Use on Mobile Phone (Android / iPhone)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="p-2.5 bg-white rounded-md shadow-lg shrink-0 flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code to open Metrology AI on Mobile"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-slate-500 text-xs font-mono">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <QrCode className="w-3.5 h-3.5" />
                Scan to Open on Phone
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Point your smartphone camera (iPhone Camera or Google Lens / Android Camera) at this QR code to launch the web scanner instantly in your phone's browser.
              </p>

              {/* URL bar with copy */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  readOnly
                  value={mobileUrl}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-slate-300 flex-1 truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono transition flex items-center gap-1 cursor-pointer shrink-0"
                  title="Copy application link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Step Usage Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Two Ways to Scan on Mobile:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Live Hardware Viewfinder */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    Live Camera Mode
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] rounded font-mono border border-emerald-500/20">
                    Real-Time Reticle
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tap <strong className="text-amber-400">"Open Real Camera"</strong>. The browser will open the live viewfinder using your phone's rear camera with Rule 8 framing guides and flashlight support.
                </p>
              </div>

              {/* Option B: Native Mobile Camera Snap */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    Mobile Snap (Native)
                  </span>
                  <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] rounded font-mono border border-blue-500/20">
                    Ultra High-Res
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tap <strong className="text-amber-400">"Mobile Snap"</strong>. This directly triggers your smartphone's built-in camera app with autofocus and optical HDR, then runs PaddleOCR automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Browser Camera Permissions Guidance */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Camera Permissions on Mobile:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed pl-1">
              <li>
                <strong className="text-slate-300">Android (Chrome):</strong> When asked <em>"Allow ais-*.run.app to access your camera?"</em>, tap <strong className="text-emerald-400">Allow</strong>.
              </li>
              <li>
                <strong className="text-slate-300">iOS (iPhone Safari):</strong> When prompted <em>"Would Like to Access the Camera"</em>, tap <strong className="text-emerald-400">Allow</strong>.
              </li>
              <li>
                <strong className="text-slate-300">If using within an embedded iframe:</strong> Browser security may restrict webcam streams. Simply tap <strong className="text-amber-400">"Mobile Snap"</strong> or open the app in a new browser tab.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={mobileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-slate-400 hover:text-amber-400 transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Fullscreen Browser Tab</span>
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenNativeCamera && (
              <button
                onClick={() => {
                  onClose();
                  onOpenNativeCamera();
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Mobile Snap</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs uppercase tracking-wider font-mono transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
