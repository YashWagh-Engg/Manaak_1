import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Zap,
  ZapOff,
  SwitchCamera,
  Scan,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface RealCameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (dataUrl: string, packageHeightMm: number, packageWidthMm: number) => void;
  onUseNativeCamera?: () => void;
  initialHeightMm?: number;
  initialWidthMm?: number;
}

export const RealCameraScanner: React.FC<RealCameraScannerProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
  onUseNativeCamera,
  initialHeightMm = 180,
  initialWidthMm = 95,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [packageHeightMm, setPackageHeightMm] = useState<number>(initialHeightMm);
  const [packageWidthMm, setPackageWidthMm] = useState<number>(initialWidthMm);
  const [videoResolution, setVideoResolution] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Stop camera tracks helper
  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      streamRef.current = null;
    }
  }, []);

  // Initialize and start video stream
  const startCamera = useCallback(async () => {
    stopTracks();
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setErrorMessage('Camera access is not supported by your current browser context. Please use a modern browser with HTTPS.');
      return;
    }

    try {
      // First attempt with preferred facingMode or deviceId
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : {
              facingMode: { ideal: facingMode },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
        audio: false,
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        // Fallback to generic video constraints if specific constraints fail
        console.warn('Initial camera constraints failed, trying basic fallback:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setVideoResolution({
              width: videoRef.current.videoWidth || 1920,
              height: videoRef.current.videoHeight || 1080,
            });
          }
        };
      }

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities && videoTrack.getCapabilities()) as any;
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      }

      // Enumerate available video inputs for switching
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
      } catch (devErr) {
        console.warn('Could not enumerate video devices:', devErr);
      }
    } catch (err: any) {
      console.error('Camera stream error:', err);
      setHasPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No physical video input camera detected on this system.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('Camera hardware is currently in use by another application.');
      } else {
        setErrorMessage(`Camera activation failed: ${err.message || 'Unknown error'}`);
      }
    }
  }, [facingMode, selectedDeviceId, stopTracks]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setTorchOn(nextState);
    } catch (err) {
      console.warn('Torch control error:', err);
    }
  };

  // Flip Camera (Front / Back)
  const flipCamera = () => {
    setSelectedDeviceId('');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Instant Capture & Run PaddleOCR Inspection
  const handleInstantScanAndInspect = (dataUrlParam?: string) => {
    let targetDataUrl = dataUrlParam || capturedImage;

    if (!targetDataUrl) {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const maxDim = 1280;
      let w = video.videoWidth || 1280;
      let h = video.videoHeight || 720;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(video, 0, 0, w, h);
      targetDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    }

    // Haptic vibration feedback on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 30, 60]);
      } catch (e) {
        // ignore
      }
    }

    // Shutter flash animation before transition
    setIsFlashing(true);
    setTimeout(() => {
      stopTracks();
      onCaptureImage(targetDataUrl!, packageHeightMm, packageWidthMm);
      onClose();
    }, 200);
  };

  // Pause frame for preview without closing immediately
  const handlePauseFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(video.videoWidth || 1280, 1280);
    const aspect = (video.videoHeight || 720) / (video.videoWidth || 1280);
    canvas.height = Math.round(canvas.width * aspect);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
    setCapturedImage(dataUrl);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch (e) {}
    }
  };

  // Start snapshot with optional countdown
  const handleTriggerSnap = (delaySec: number = 0) => {
    if (delaySec <= 0) {
      handleInstantScanAndInspect();
      return;
    }

    setCountdown(delaySec);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleInstantScanAndInspect();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
  };

  // Confirm capture and run PaddleOCR
  const handleConfirmAndScan = () => {
    if (!capturedImage) return;
    handleInstantScanAndInspect(capturedImage);
  };

  // Manage camera lifecycle with modal open state
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopTracks();
      setCapturedImage(null);
    }
    return () => {
      stopTracks();
    };
  }, [isOpen, startCamera, stopTracks]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-gray-300 rounded-lg max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto text-slate-800">
        {/* Header HUD */}
        <div className="p-4 bg-[#003366] text-white border-b border-[#002244] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 border border-white/20 rounded text-amber-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                PaddleOCR Optical Scanner • Real Hardware Camera
              </div>
              <h3 className="text-sm font-bold text-white">
                Pre-Packaged Commodity Label Ingestion
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              stopTracks();
              onClose();
            }}
            className="p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
            title="Close Camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
          {/* Permission or Hardware Error */}
          {hasPermission === false && (
            <div className="p-8 max-w-md text-center space-y-4 z-20 bg-white/95 backdrop-blur-xs rounded-xl border border-gray-200 shadow-2xl m-4">
              <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 text-red-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Camera Access Required</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                {errorMessage || 'Unable to access hardware camera.'}
              </p>
              <div className="pt-2 flex flex-col gap-2 justify-center">
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2.5 min-h-[44px] bg-[#003366] hover:bg-[#002244] text-white font-bold rounded text-xs uppercase tracking-wider transition font-mono flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Camera Permission
                  </button>
                  {onUseNativeCamera && (
                    <button
                      onClick={() => {
                        stopTracks();
                        onClose();
                        onUseNativeCamera();
                      }}
                      className="px-4 py-2.5 min-h-[44px] bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 font-bold rounded text-xs transition font-mono flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" /> Use Phone Camera App
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Live Video Stream View */}
          {!capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full max-h-[500px] object-contain block bg-black"
              />

              {/* Viewfinder Geometric Reticle & Package Framing Guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 sm:p-10">
                <div
                  className="relative border-2 border-amber-400/50 rounded-lg w-full max-w-[420px] aspect-[1/1.5] shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col justify-between p-4"
                  style={{
                    aspectRatio: `${packageWidthMm} / ${packageHeightMm}`,
                  }}
                >
                  {/* Corner Accent Brackets */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-amber-400"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-amber-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-amber-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-amber-400"></div>

                  {/* Laser Scan Sweep Animation */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b] animate-[bounce_2.4s_infinite]"></div>

                  {/* Top Calibration Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Rule 8 Optical Alignment
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400">
                      {packageHeightMm}mm × {packageWidthMm}mm
                    </span>
                  </div>

                  {/* Center Crosshair */}
                  <div className="self-center flex items-center justify-center opacity-40">
                    <div className="w-8 h-0.5 bg-amber-400"></div>
                    <div className="h-8 w-0.5 bg-amber-400 absolute"></div>
                  </div>

                  {/* Bottom Guide Text */}
                  <div className="text-center">
                    <span className="px-2.5 py-1 rounded bg-slate-950/90 text-slate-300 text-[10px] font-mono border border-slate-800 tracking-wider">
                      Align Principal Display Panel (PDP) within frame
                    </span>
                  </div>
                </div>
              </div>

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-5xl font-black font-mono shadow-2xl animate-ping">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Resolution & Feed Diagnostic Overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  {videoResolution.width}×{videoResolution.height}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400">PP-OCRv4 Live</span>
              </div>

              {/* Shutter flash overlay */}
              {isFlashing && (
                <div className="absolute inset-0 bg-white/95 z-50 pointer-events-none transition-opacity duration-200" />
              )}

              {/* Mobile Quick Tap Shutter Button */}
              <div className="absolute bottom-4 inset-x-0 flex flex-col items-center justify-center pointer-events-auto z-20 sm:hidden gap-1">
                <button
                  onClick={() => handleInstantScanAndInspect()}
                  className="w-16 h-16 rounded-full border-4 border-amber-400/90 bg-amber-500 hover:bg-amber-400 active:scale-90 transition-transform shadow-2xl flex items-center justify-center text-slate-950 font-bold cursor-pointer"
                  title="Tap to Scan & Inspect"
                >
                  <Scan className="w-8 h-8 stroke-[2.5]" />
                </button>
                <span className="px-2 py-0.5 rounded bg-slate-950/90 text-[10px] font-mono text-amber-300 border border-slate-800">
                  Tap to Scan &amp; Inspect
                </span>
              </div>
            </div>
          ) : (
            /* Freeze-frame Preview of Captured Image */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <img
                src={capturedImage}
                alt="Captured Label Frame"
                className="max-h-[460px] w-auto object-contain rounded border border-slate-700 shadow-2xl"
              />
              <div className="absolute top-6 right-6 bg-slate-950/90 border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>High-Res Frame Captured</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Controls Toolbar */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-800">
          {/* Left Controls: Device Selector & Torch */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {videoDevices.length > 1 && !capturedImage && (
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-slate-800 text-xs font-mono focus:outline-none focus:border-[#003366] max-w-[160px] truncate shadow-xs"
              >
                {videoDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            )}

            {!capturedImage && (
              <button
                onClick={flipCamera}
                className="px-2.5 py-1.5 rounded bg-white border border-gray-300 hover:bg-slate-100 text-slate-700 text-xs font-mono transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Switch between front and back cameras"
              >
                <SwitchCamera className="w-3.5 h-3.5 text-[#003366]" />
                <span className="hidden sm:inline">Flip</span>
              </button>
            )}

            {hasTorch && !capturedImage && (
              <button
                onClick={toggleTorch}
                className={`px-2.5 py-1.5 rounded border text-xs font-mono transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  torchOn
                    ? 'bg-[#FF9933] text-slate-950 font-bold border-[#FF9933]'
                    : 'bg-white border-gray-300 text-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle camera flash/torch"
              >
                {torchOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden sm:inline">Torch</span>
              </button>
            )}

            {/* Calibration Dimensions */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 ml-auto sm:ml-2">
              <Sliders className="w-3.5 h-3.5 text-[#003366]" />
              <span>Cal:</span>
              <input
                type="number"
                value={packageHeightMm}
                onChange={(e) => setPackageHeightMm(Number(e.target.value) || 180)}
                className="w-12 px-1 py-0.5 bg-white border border-gray-300 rounded text-center text-slate-800 text-xs font-mono shadow-xs"
                title="Package Height in Millimeters"
              />
              <span>×</span>
              <input
                type="number"
                value={packageWidthMm}
                onChange={(e) => setPackageWidthMm(Number(e.target.value) || 95)}
                className="w-12 px-1 py-0.5 bg-white border border-gray-300 rounded text-center text-slate-800 text-xs font-mono shadow-xs"
                title="Package Width in Millimeters"
              />
              <span>mm</span>
            </div>
          </div>

          {/* Right Action Trigger Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!capturedImage ? (
              <>
                <button
                  onClick={handlePauseFrame}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-gray-300 text-slate-700 rounded text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Pause camera frame for review"
                >
                  <span>Freeze</span>
                </button>

                <button
                  onClick={() => handleTriggerSnap(3)}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-gray-300 text-slate-700 rounded text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Capture after 3-second delay"
                >
                  <span>Timer 3s</span>
                </button>

                <button
                  onClick={() => handleTriggerSnap(0)}
                  className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 font-bold rounded uppercase tracking-wider text-xs transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Scan className="w-4 h-4" />
                  <span>Scan with PaddleOCR</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 border border-gray-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-mono transition cursor-pointer shadow-xs"
                >
                  Retake Photo
                </button>

                <button
                  onClick={handleConfirmAndScan}
                  className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 font-bold rounded uppercase tracking-wider text-xs transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Inspect This Frame</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
