import React from 'react';
import { X, Flashlight, ScanLine, QrCode } from 'lucide-react';

interface QRScannerScreenProps {
  onClose: () => void;
}

export default function QRScannerScreen({ onClose }: QRScannerScreenProps) {
  return (
    <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col overflow-hidden animate-fade-in font-sans">
      
      {/* Simulated Camera Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-center bg-cover"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541364983171-a8ba01e9d7ce?auto=format&fit=crop&q=80&w=1000')" }}
      />
      
      {/* Dark overlay to simulate the viewfinder */}
      <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none" />

      {/* Viewfinder Cutout */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none pb-32">
        <div className="w-64 h-64 border-2 border-white/30 rounded-2xl relative shadow-[0_0_0_4000px_rgba(0,0,0,0.4)]">
           {/* Corner accent marks */}
           <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl" />
           <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl" />
           <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl" />
           <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl" />
        </div>
      </div>

      {/* Top Header Buttons */}
      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 pt-6">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-800 active:scale-95 transition-transform shadow-md"
          aria-label="Cerrar escáner"
        >
          <X className="w-6 h-6" />
        </button>
        
        <button 
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-800 active:scale-95 transition-transform shadow-md"
          aria-label="Encender linterna"
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </header>

      {/* Bottom Sheet UI Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#f8f9fa] rounded-t-[32px] pt-4 pb-12 px-6 flex flex-col items-center z-10 animate-slide-up shadow-2xl">
        {/* Drag handle pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-6" />
        
        {/* NFC Ready Badge */}
        <div className="bg-[#eaf4fc] text-[#59b3ef] px-4 py-2 rounded-full flex items-center gap-2 mb-6 shadow-sm border border-[#59b3ef]/10">
          <ScanLine className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wide uppercase">NFC Ready</span>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black text-[#1a1c1e] text-center mb-3">
          Apunta a la placa QR o acerca el chip NFC
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 text-center font-medium leading-relaxed max-w-[280px]">
          Mantén la placa de la mascota dentro del marco para escanear automáticamente.
        </p>
      </div>

    </div>
  );
}
