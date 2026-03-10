"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const scannerRef = useRef(null);
  const isTransitioning = useRef(false);
  const qrCodeRegionId = "qr-scanner-region";
  
  // Functional State
  const [passCode, setPassCode] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    { name: 'Marcus Rashford', type: 'Visitor', target: 'House 42B', status: 'Authorized', statusColor: 'text-emerald-500 bg-emerald-500/10', avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=100&auto=format&fit=crop', time: '14:23:45' },
    { name: 'Sarah Mitchell', type: 'Resident', target: 'Apt 109', status: 'Authorized', statusColor: 'text-emerald-500 bg-emerald-500/10', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', time: '14:15:22' }
  ]);

  useEffect(() => {
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

  const processQRCode = (qrData) => {
    setIsProcessing(true);

    setTimeout(() => {
      let qrInfo = { code: qrData, type: 'Unknown' };
      try {
        const parsed = JSON.parse(qrData);
        qrInfo = { ...qrInfo, ...parsed };
      } catch {
        qrInfo.code = qrData;
      }

      const isDenied = qrData.toLowerCase().includes('ban') || 
                       qrData.toLowerCase().includes('expired') ||
                       qrData.includes('123');
      
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      const result = {
        status: isDenied ? 'denied' : 'authorized',
        timestamp,
        zone: 'Zone 1 - Main North',
        name: qrInfo.name || qrInfo.code.substring(0, 12) + (qrInfo.code.length > 12 ? '...' : ''),
        type: qrInfo.type || 'Visitor/QR Scan',
        rawData: qrData
      };

      setCurrentResult(result);
      setIsProcessing(false);

      const historyItem = {
        name: isDenied ? 'Unknown / Flagged' : (qrInfo.name || 'QR Scan Entry'),
        type: isDenied ? 'Security Alert' : 'QR Verification',
        target: isDenied ? 'Access Denied' : 'QR Entry Granted',
        status: isDenied ? 'Denied' : 'Authorized',
        statusColor: isDenied ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10',
        time: timestamp,
        qrCode: qrData.substring(0, 15) + '...'
      };

      setScanHistory(prev => [historyItem, ...prev.slice(0, 9)]);

      if (isDenied) {
        toast.error('ACCESS DENIED: Invalid or expired QR code');
      } else {
        toast.success('ACCESS GRANTED: QR code verified');
      }
    }, 1200);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const handleManualVerify = () => {
    if (!passCode && !licensePlate) {
      toast.warning('Please enter a Pass Code or License Plate');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const isDenied = passCode.toUpperCase().includes('EX') || licensePlate.toUpperCase().includes('BAN');
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const result = {
        status: isDenied ? 'denied' : 'authorized',
        timestamp,
        zone: 'Zone 1 - Main North',
        name: passCode || licensePlate,
        type: passCode ? 'Visitor/Pass' : 'Vehicle Scan'
      };
      setCurrentResult(result);
      setIsProcessing(false);

      const historyItem = {
        name: isDenied ? 'Unknown / Flagged' : (passCode || licensePlate),
        type: isDenied ? 'Security Alert' : 'Manual Verification',
        target: isDenied ? 'Restricted Access' : 'Verified Entry',
        status: isDenied ? 'Denied' : 'Authorized',
        statusColor: isDenied ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10',
        time: timestamp
      };

      setScanHistory(prev => [historyItem, ...prev.slice(0, 9)]);

      if (isDenied) {
        toast.error('ACCESS DENIED: Credentials invalid or expired');
      } else {
        toast.success('ACCESS GRANTED: Welcome to EstatePro');
        setPassCode('');
        setLicensePlate('');
      }
    }, 1200);
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
            <span className="material-symbols-outlined text-sm">schedule</span>
            <p className="text-xs font-bold uppercase tracking-widest leading-none">{formatTime(currentTime)}</p>
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
                  <span className="material-symbols-outlined text-white/50 text-[100px]">videocam_off</span>
                  <p className="text-white/50 text-sm font-bold mt-2">Scanner Paused</p>
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
                <span className="material-symbols-outlined">{isScannerActive ? 'pause' : 'play_arrow'}</span>
              </button>
              <button onClick={switchCamera} className="bg-black/60 hover:bg-black/80 backdrop-blur-xl p-4 rounded-2xl text-white transition-all active:scale-90">
                <span className="material-symbols-outlined">flip_camera_ios</span>
              </button>
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
              <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-base text-[#1241a1]">sensors</span> 
                {cameras[currentCameraIndex]?.label || "CAM_01_NORTH_GATE"}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border-none rounded-4xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1241a1] mb-6 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#1241a1]/10 material-symbols-outlined text-lg">keyboard</span>
              Manual Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none block">Pass Code / REF</label>
                <div className="relative">
                  <input value={passCode} onChange={(e) => setPassCode(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold px-5 py-3.5 focus:ring-2 focus:ring-[#1241a1] transition-all outline-none dark:text-white" placeholder="VIS-9928" type="text" />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">confirmation_number</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none block">License Plate</label>
                <div className="relative">
                  <input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold px-5 py-3.5 focus:ring-2 focus:ring-[#1241a1] transition-all outline-none dark:text-white" placeholder="KAA 123X" type="text" />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">directions_car</span>
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
                <span className={`material-symbols-outlined text-6xl ${currentResult.status === 'denied' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {currentResult.status === 'denied' ? 'cancel' : 'check_circle'}
                </span>
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
                <span className="material-symbols-outlined text-4xl text-slate-300 animate-pulse">qr_code_2</span>
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
              {scanHistory.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 group">
                  <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black dark:text-white truncate group-hover:text-[#1241a1] transition-colors leading-tight">{entry.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.type} • {entry.target}</p>
                    {entry.qrCode && <p className="text-[8px] text-slate-400 truncate">QR: {entry.qrCode}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg block mb-1 ${entry.statusColor}`}>{entry.status}</span>
                    <time className="text-[9px] font-bold text-slate-400 italic block">{entry.time}</time>
                  </div>
                </div>
              ))}
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