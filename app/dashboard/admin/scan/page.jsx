"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Clock, 
  VideoOff, 
  Pause, 
  Play, 
  RefreshCcw, 
  Radio, 
  Keyboard, 
  Ticket, 
  Car, 
  XOctagon, 
  CheckCircle2, 
  QrCode, 
  User,
  Lock
} from 'lucide-react';
import { getScanHistory } from '@/lib/service';
import { validatePass, addToScanHistory } from '@/lib/action';

export default function QRScanPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const scannerRef = useRef(null);
  const isTransitioning = useRef(false);
  const qrCodeRegionId = "qr-scanner-region";
  
  // Functional State
  const [passCode, setPassCode] = useState('');
  const [pin, setPin] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    setHasMounted(true);
    const fetchScanHistory = async () => {
      const history = await getScanHistory();
      setScanHistory(history?.docs || []);
    }
    fetchScanHistory();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Cameras and Scanner
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(qrCodeRegionId);
          }
          startScanner(devices[0].id);
        } else {
          // Fallback to environment facing if list is empty but API works
          if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(qrCodeRegionId);
          }
          startScanner({ facingMode: "environment" });
        }
      } catch (err) {
        console.error("Error getting cameras", err);
        // Ensure scanner instance exists
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(qrCodeRegionId);
        }
        startScanner({ facingMode: "environment" });
      }
    };

    getCameras();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async (cameraIdOrConfig) => {
    if (!scannerRef.current || isTransitioning.current) return;
    
    try {
      isTransitioning.current = true;
      // If already scanning, stop first (defensive)
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.start(
        cameraIdOrConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        onScanError
      );
      setIsScannerActive(true);
    } catch (err) {
      console.error("Failed to start scanner", err);
      setIsScannerActive(false);
      if (err.toString().includes("Permission")) {
        toast.error("Camera permission denied");
      }
    } finally {
      isTransitioning.current = false;
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current || isTransitioning.current) return;
    if (!scannerRef.current.isScanning) {
      setIsScannerActive(false);
      return;
    }

    try {
      isTransitioning.current = true;
      await scannerRef.current.stop();
      setIsScannerActive(false);
    } catch (err) {
      console.error("Failed to stop scanner", err);
    } finally {
      isTransitioning.current = false;
    }
  };


  const onScanSuccess = async (decodedText, decodedResult) => {
    console.log(`Scan success: ${decodedText}`);
    processQRCode(decodedText);
    
    // Briefly stop to avoid spamming multiple detections
    await stopScanner();
    
    setTimeout(() => {
      if (cameras.length > 0 && cameras[currentCameraIndex]) {
        startScanner(cameras[currentCameraIndex].id);
      } else {
        startScanner({ facingMode: "environment" });
      }
    }, 4000);
  };

  const onScanError = (errorMessage) => {
    // Expected behavior: skip frames without QR codes
  };

  const switchCamera = async () => {
    if (cameras.length < 2) {
      toast.info("No other camera available");
      return;
    }

    await stopScanner();
    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIndex);
    await startScanner(cameras[nextIndex].id);
    toast.success(`Switched to ${cameras[nextIndex].label || 'next camera'}`);
  };

  const toggleScanner = async () => {
    if (isScannerActive) {
      await stopScanner();
      toast.info("Scanner paused");
    } else {
      if (cameras.length > 0 && cameras[currentCameraIndex]) {
        await startScanner(cameras[currentCameraIndex].id);
      } else {
        await startScanner({ facingMode: "environment" });
      }
      toast.info("Scanner resumed");
    }
  };

  const processQRCode = async (qrData) => {
    
    console.log("Processing Scanned Data:", qrData);
    
    setIsProcessing(true);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    // Attempt to parse PIN and actual code from QR payload if it's JSON
    
    let extractedPin = '';
    let codeToVerify = qrData; 

    try {
      
      const parsed = JSON.parse(qrData);
      
      console.log("Parsed QR Payload:", parsed);
     
      // Prioritize explicit passCode or id from the object
      if (parsed.passCode) codeToVerify = parsed.passCode;
      else if (parsed.id) codeToVerify = parsed.id;
      
      if (parsed.pin) extractedPin = parsed.pin;
    
    } catch (e) {
      // Not JSON, continue with raw data
    }

    try {
      const response = await validatePass(codeToVerify, extractedPin);
      
      if (!response.success) {
        setCurrentResult({
          status: 'denied',
          timestamp,
          zone: 'Zone 1 - Main North',
          name: qrData.substring(0, 12),
          type: 'Security Alert',
          rawData: qrData
        });

        await addToScanHistory({
          name: 'Invalid/Flagged QR',
          type: 'Security Alert',
          target: 'Access Denied',
          status: 'Denied',
          statusColor: 'text-red-500 bg-red-500/10',
          time: timestamp,
          qrCode: qrData.substring(0, 15) + '...'
        });

        toast.error(response.message || 'ACCESS DENIED: Invalid or expired QR code');

      } else {

        const pass = response.data;
        setCurrentResult({
          status: 'authorized',
          timestamp,
          zone: 'Zone 1 - Main North',
          name: pass.visitorName || 'Authorized User',
          type: pass.purpose || 'Visitor/Pass',
          rawData: qrData
        });

        await addToScanHistory({
          name: pass.visitorName || 'QR Scan Entry',
          type: 'QR Verification',
          target: pass.unitNumber || 'Main Estate',
          status: 'Authorized',
          statusColor: 'text-emerald-500 bg-emerald-500/10',
          time: timestamp,
          qrCode: qrData.substring(0, 15) + '...'
        });

        toast.success(`ACCESS GRANTED: Welcome, ${pass.visitorName}`);
        
      }
      
      const history = await getScanHistory();
      setScanHistory(history?.docs || []);
    } catch (err) {
      console.error("Scan error:", err);
      toast.error("System error during verification");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const handleManualVerify = async () => {
    if (!passCode && !licensePlate) {
      toast.warning('Please enter a Pass Code or License Plate');
      return;
    }

    setIsProcessing(true);
    const code = passCode || licensePlate;
    const vPin = pin; // Use entered pin
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    try {
      const response = await validatePass(code, vPin);
      
      if (!response.success) {
        setCurrentResult({
          status: 'denied',
          timestamp,
          zone: 'Zone 1 - Main North',
          name: code,
          type: passCode ? 'Pass Verification' : 'Vehicle Scan'
        });

        await addToScanHistory({
          name: code,
          type: 'Security Alert',
          target: 'Restricted Access',
          status: 'Denied',
          statusColor: 'text-red-500 bg-red-500/10',
          time: timestamp
        });

        toast.error(response.message || 'ACCESS DENIED: Credentials invalid or expired');
      } else {
        const pass = response.data;
        setCurrentResult({
          status: 'authorized',
          timestamp,
          zone: 'Zone 1 - Main North',
          name: pass.visitorName || code,
          type: passCode ? 'Manual/Pass' : 'Vehicle/Verified'
        });

        await addToScanHistory({
          name: pass.visitorName || code,
          type: 'Manual Verification',
          target: pass.unitNumber || 'Resident Unit',
          status: 'Authorized',
          statusColor: 'text-emerald-500 bg-emerald-500/10',
          time: timestamp
        });

        toast.success(`ACCESS GRANTED: Welcome to EstatePro`);
        setPassCode('');
        setPin('');
        setLicensePlate('');
      }

      const history = await getScanHistory();
      setScanHistory(history?.docs || []);
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full -m-4 lg:-m-8 animate-in fade-in duration-700">
      <header className="h-16 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">QR Verification</h2>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span> System Live
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Clock className="size-4" />
            <p suppressHydrationWarning className="text-xs font-bold uppercase tracking-widest leading-none">
              {hasMounted ? formatTime(currentTime) : '--:--:--'}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row p-6 gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex-1 relative bg-slate-950 rounded-4xl overflow-hidden group shadow-2xl min-h-[400px]">
            <div id={qrCodeRegionId} className="absolute inset-0 w-full h-full" style={{ display: isScannerActive ? 'block' : 'none', background: '#000' }} />
            
            {!isScannerActive && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="size-20 text-white/50 mb-3 mx-auto" />
                  <p className="text-white/50 text-sm font-bold">Scanner Paused</p>
                </div>
              </div>
            )}

            {isScannerActive && (
              <>
                <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                  <div className="w-full max-w-[320px] aspect-square border-2 border-[#1241a1]/40 rounded-3xl relative">
                    <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-[#1241a1]"></div>
                    <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-[#1241a1]"></div>
                    <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-[#1241a1]"></div>
                    <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-[#1241a1]"></div>
                    <div className="w-full h-1 bg-[#1241a1] shadow-[0_0_25px_rgba(18,65,161,1)] absolute top-0 animate-[scan_3s_ease-in-out_infinite]"></div>
                  </div>
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl text-white text-xs font-bold">
                  Align QR code within frame
                </div>
              </>
            )}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
              <button onClick={toggleScanner} className="bg-black/60 hover:bg-black/80 backdrop-blur-xl p-4 rounded-2xl text-white transition-all active:scale-90">
                {isScannerActive ? <Pause className="size-6" /> : <Play className="size-6" />}
              </button>
              <button onClick={switchCamera} className="bg-black/60 hover:bg-black/80 backdrop-blur-xl p-4 rounded-2xl text-white transition-all active:scale-90">
                <RefreshCcw className="size-6" />
              </button>
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
              <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3">
                <Radio className="size-4 text-[#1241a1]" /> 
                {cameras[currentCameraIndex]?.label || "CAM_01_NORTH_GATE"}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border-none rounded-4xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] mb-6 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1241a1]/10">
                <Keyboard className="size-5" />
              </div>
              Manual Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none block">Pass Code / REF</label>
                <div className="relative">
                  <input value={passCode} onChange={(e) => setPassCode(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold px-5 py-3.5 focus:ring-2 focus:ring-[#1241a1] transition-all outline-none dark:text-white" placeholder="VIS-9928" type="text" />
                  <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none block">PIN</label>
                <div className="relative">
                  <input value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold px-5 py-3.5 focus:ring-2 focus:ring-[#1241a1] transition-all outline-none dark:text-white" placeholder="****" type="password" />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none block">License Plate</label>
                <div className="relative">
                  <input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold px-5 py-3.5 focus:ring-2 focus:ring-[#1241a1] transition-all outline-none dark:text-white" placeholder="KAA 123X" type="text" />
                  <Car className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={handleManualVerify} disabled={isProcessing} className={`w-full bg-[#1241a1] hover:brightness-110 text-white font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-[#1241a1]/20 active:scale-95 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isProcessing ? 'Verifying...' : 'Verify Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[400px] flex flex-col gap-6">
          {currentResult ? (
            <div className={`bg-white dark:bg-slate-900 border-none rounded-4xl p-10 text-center space-y-6 shadow-sm relative overflow-hidden animate-in zoom-in duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-2 ${currentResult.status === 'denied' ? 'before:bg-red-500' : 'before:bg-emerald-500'}`}>
              <div className={`mx-auto size-24 rounded-full flex items-center justify-center shadow-lg ${currentResult.status === 'denied' ? 'bg-red-500/10 shadow-red-500/5' : 'bg-emerald-500/10 shadow-emerald-500/5'}`}>
                {currentResult.status === 'denied' ? (
                  <XOctagon className="size-14 text-red-500" />
                ) : (
                  <CheckCircle2 className="size-14 text-emerald-500" />
                )}
              </div>
              <div>
                <h2 className={`text-3xl font-black tracking-tighter uppercase ${currentResult.status === 'denied' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {currentResult.status === 'denied' ? 'ACCESS DENIED' : 'AUTHORIZED'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{currentResult.status === 'denied' ? 'Security flag or invalid pass' : `Access granted to ${currentResult.zone}`}</p>
                {currentResult.rawData && <p className="text-[8px] text-slate-400 mt-2 truncate max-w-full">QR: {currentResult.rawData}</p>}
              </div>
              <div className="pt-6 grid grid-cols-2 gap-8">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none block mb-1">Gate Status</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{currentResult.status === 'denied' ? 'Locked' : 'Opening...'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none block mb-1">Timestamp</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{currentResult.timestamp}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border-none rounded-4xl p-10 text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
              <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <QrCode className="size-10 text-slate-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-400 tracking-tight uppercase">Ready to Scan</h3>
                <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-2 px-6">System awaiting verification input from scanner or manual terminal</p>
              </div>
            </div>
          )}

          <div className="flex-1 bg-white dark:bg-slate-900 border-none rounded-4xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scan History</h3>
              <button className="text-[#1241a1] text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {scanHistory && scanHistory.length > 0 ? (
                scanHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 group">
                    <div className={`size-12 rounded-xl flex items-center justify-center ${entry.status === 'denied' || entry.status === 'Denied' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {entry.status === 'denied' || entry.status === 'Denied' ? <XOctagon className="size-6" /> : <CheckCircle2 className="size-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black dark:text-white truncate group-hover:text-[#1241a1] transition-colors leading-tight">
                        {entry.name || entry.visitorName || 'Unknown Visitor'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {entry.type || 'Verification'} • {entry.target || entry.visitorID || 'Main Gate'}
                      </p>
                      {entry.qrCode && <p className="text-[8px] text-slate-400 truncate opacity-60">ID: {entry.qrCode}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg block mb-1 ${entry.status === 'denied' || entry.status === 'Denied' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {entry.status}
                      </span>
                      <time className="text-[9px] font-bold text-slate-400 italic block">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : entry.time}
                      </time>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <QrCode className="size-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">No scans yet</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Verification logs will appear here</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1241a1] transition-colors leading-none">
                Total Scans Session: {scanHistory.length}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        #${qrCodeRegionId} {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        :global(#${qrCodeRegionId} video) {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
}