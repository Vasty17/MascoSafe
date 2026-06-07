import React, { useState } from 'react';
import { Report } from '../types';
import { ArrowLeft, Share2, MapPin, Phone, MessageSquare, ShieldCheck, Clock, Eye, Send, Check } from 'lucide-react';

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
  onAlertMessage?: (msg: string) => void;
}

export default function ReportDetail({ report, onBack, onAlertMessage }: ReportDetailProps) {
  const [hasCalled, setHasCalled] = useState(false);
  const [hasSentInfo, setHasSentInfo] = useState(false);
  const [modalText, setModalText] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleCall = () => {
    setHasCalled(true);
    if (onAlertMessage) {
      onAlertMessage(`📞 Iniciando llamada al número de ${report.reporterName}: ${report.reporterPhone}`);
    }
    setTimeout(() => {
      setHasCalled(false);
    }, 2000);
  };

  const handleTengoInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalText.trim()) return;
    
    setHasSentInfo(true);
    if (onAlertMessage) {
      onAlertMessage(`✉️ Mensaje enviado con éxito a ${report.reporterName}. ¡Gracias por ayudar!`);
    }
    setShowInfoModal(false);
    setModalText('');
    setTimeout(() => setHasSentInfo(false), 3000);
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: `Reporte de mascota: ${report.petName || 'Sin Nombre'}`,
        text: `Ayúdanos a encontrar o rescatar esta mascota: ${report.description}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      if (onAlertMessage) {
        onAlertMessage(`📋 Enlace de reporte para ${report.petName || 'Mascota'} copiado al portapapeles.`);
      }
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'lost':
        return {
          bg: 'bg-status-lost/15',
          text: 'text-status-lost',
          label: 'PERDIDO',
        };
      case 'spotted':
        return {
          bg: 'bg-status-spotted/15',
          text: 'text-status-spotted',
          label: 'VISTO',
        };
      case 'stray':
        return {
          bg: 'bg-status-stray/15',
          text: 'text-status-stray',
          label: 'CALLEJERO',
        };
      case 'danger':
        return {
          bg: 'bg-status-danger/15',
          text: 'text-status-danger',
          label: 'PELIGRO',
        };
      default:
        return {
          bg: 'bg-primary-container/20',
          text: 'text-primary',
          label: 'REPORTE',
        };
    }
  };

  const theme = getCategoryTheme(report.category);

  return (
    <div className="relative w-full max-w-sm mx-auto bg-background-custom min-h-screen text-on-background shadow-lg overflow-x-hidden">
      
      {/* Floating Top Header bar */}
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-4 pointer-events-none">
        <button 
          onClick={onBack}
          aria-label="Volver" 
          className="pointer-events-auto bg-white/85 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center text-on-background shadow-md transition-transform active:scale-95 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5 text-[#1a1c1e]" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={shareReport}
            aria-label="Compartir" 
            className="bg-white/85 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center text-on-background shadow-md transition-transform active:scale-95 focus:outline-none"
          >
            <Share2 className="w-5 h-5 text-[#1a1c1e]" />
          </button>
        </div>
      </header>

      {/* Hero Pet Image Section */}
      <section className="relative w-full h-[350px] bg-slate-900 overflow-hidden">
        {report.image ? (
          <img 
            alt={report.petName || "Detalle mascota"} 
            className="w-full h-full object-cover" 
            src={report.image} 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-[#004364]">
            <span className="text-[72px] mb-2">🐾</span>
            <p className="font-label text-sm uppercase tracking-wider font-semibold">Reporte de Peligro comunitario</p>
          </div>
        )}
        {/* Soft fading gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </section>

      {/* Slide overlaying white info sheet */}
      <section className="relative z-20 -mt-10 bg-white rounded-t-3xl pt-8 pb-36 px-5 shadow-[0px_-8px_24px_rgba(0,0,0,0.06)] min-h-[500px]">
        {/* Sliding card drag indicators */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#eeeef0] rounded-full" />

        {/* Name and alert status */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1c1e] mb-1">
              {report.petName || 'Mascota sin nombre'}
            </h1>
            <p className="text-sm text-on-surface-variant flex items-center gap-1.5 font-medium">
              <span className="text-primary">●</span>
              {report.breed || 'Raza no especificada'}
            </p>
          </div>

          {/* Core dynamic status badge overlay */}
          <div className={`${theme.bg} ${theme.text} px-3 py-1.5 rounded-xl flex flex-col items-end border border-transparent`}>
            <div className="flex items-center gap-1">
              <span className="text-[12px] font-bold">●</span>
              <span className="font-label text-xs font-bold tracking-wider uppercase">{theme.label}</span>
            </div>
            <span className="text-[11px] opacity-80 font-medium mt-0.5 whitespace-nowrap">{report.timeAgo}</span>
          </div>
        </div>

        {/* Details tags / parameters bento grid (Only show if specified name/attributes exist) */}
        {(report.gender || report.size || report.color) && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-50 border border-[#eeeef0] rounded-2xl p-3 flex flex-col items-center text-center gap-1 transition-colors hover:bg-slate-100">
              <span className="text-xs text-[#6f7880] uppercase tracking-wider font-bold">Sexo</span>
              <span className="text-sm font-semibold capitalize text-[#1a1c1e]">{report.gender || 'Falta'}</span>
            </div>
            <div className="bg-slate-50 border border-[#eeeef0] rounded-2xl p-3 flex flex-col items-center text-center gap-1 transition-colors hover:bg-slate-100">
              <span className="text-xs text-[#6f7880] uppercase tracking-wider font-bold">Tamaño</span>
              <span className="text-sm font-semibold capitalize text-[#1a1c1e]">{report.size || 'Falta'}</span>
            </div>
            <div className="bg-slate-50 border border-[#eeeef0] rounded-2xl p-3 flex flex-col items-center text-center gap-1 transition-colors hover:bg-slate-100">
              <span className="text-xs text-[#6f7880] uppercase tracking-wider font-bold">Color</span>
              <span className="text-sm font-semibold capitalize text-[#1a1c1e]">{report.color || 'Falta'}</span>
            </div>
          </div>
        )}

        {/* Situation description text block */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-[#1a1c1e] mb-2 font-sans">
            Detalles de la situación
          </h2>
          <p className="text-sm text-[#3f484f] leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Location container */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2.5">
            <h2 className="text-base font-bold text-[#1a1c1e] font-sans">
              Última ubicación
            </h2>
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              📍 A 2.5 km de ti
            </span>
          </div>

          <div className="w-full h-36 bg-slate-100 rounded-2xl overflow-hidden relative border border-[#eeeef0]">
            {/* Embedded maps mock image placeholder matching Mexico locations */}
            <img 
              alt="Ubicación mapa" 
              className="w-full h-full object-cover opacity-90 grayscale-10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu6H6Z878PvR6033ptT1dwGHF-OrWwP6xyB9HWrnIz3NsYhUptV4Hj3YA4drKokHtKawYiKcuDNSZ1bodoPOF_U12hptn2PtWrOODv4jDz1ZXFMtDrZUHK-TFPhU8N8XLNRgiwoWjm_p6SiCHyFouiu-w_ak-x8FuB_etVne4ThRjAfh9nzN_wQ9_eWkZBgdYlwjwJtgbgCiYJHte0B9F9cQSU3nGnTAjJwmCt5xUfjT3wzqWcvJE7IhexNNwl7tNxzryAgtIhqjk" 
            />
            {/* Glowing Map pin overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div 
                className="w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white z-10 scale-105" 
                style={{ backgroundColor: theme.text === 'visto' ? '#FFB800' : getCategoryTheme(report.category).text === 'text-status-lost' ? '#F06543' : '#006493' }}
              >
                <MapPin className="w-4 h-4 fill-white" />
              </div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1 animate-ping absolute -bottom-1" />
            </div>
          </div>
          
          <p className="text-xs font-medium text-on-surface-variant mt-2 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{report.locationName}</span>
          </p>
        </div>

        {/* Reporter profile details container */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#eeeef0] rounded-2xl">
          <div className="flex items-center gap-3">
            <img 
              alt="Avatar del reportador" 
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
              src={report.reporterAvatar} 
            />
            <div>
              <p className="text-sm font-bold text-[#1a1c1e]">{report.reporterName}</p>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-primary font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 fill-[#cae6ff]" />
                <span>Colaborador verificado</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowInfoModal(true)}
            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 active:scale-90 transition-transform focus:outline-none"
            title="Enviar mensaje rápido"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Sticky Call / Contact Buttons Bottom Nav Floating Overlay */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 pb-safe-bottom z-40 shadow-[0px_-8px_24px_rgba(89,179,239,0.06)] rounded-t-xl">
        <div className="flex gap-3">
          <button 
            onClick={handleCall}
            aria-label="Llamar al reportador"
            className="flex-1 py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary/5 active-press transition-all focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <Phone className="w-4 h-4" />
            {hasCalled ? 'Llamando...' : 'Llamar'}
          </button>
          
          <button 
            onClick={() => setShowInfoModal(true)}
            aria-label="Enviar información o pista"
            className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary/95 shadow-md active-press transition-all focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            Tengo Info
          </button>
        </div>
      </div>

      {/* Info Message Prompt dialog */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl animate-slide-up pb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-primary font-sans flex items-center gap-1.5">
                💬 Reportar pistas
              </h3>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-on-surface-variant hover:text-black p-1 focus:outline-none rounded-full bg-slate-100"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-[#6f7880] mb-4">
              ¿Viste a esta mascota, sabes de su paradero u tienes alguna pista útil? Tu información se enviará de inmediato al contacto.
            </p>

            <form onSubmit={handleTengoInfoSubmit} className="flex flex-col gap-3">
              <textarea
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                placeholder="Escribe aquí detalles útiles (dirección o ej. 'Vi un cachorro igual corriendo por Av. Revolución hace una hora')..."
                required
                className="w-full h-24 p-3 bg-slate-50 border border-slate-200 text-sm text-[#1a1c1e] rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none placeholder:text-[#6f7880]"
              />
              
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 active-press transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container"
              >
                <Send className="w-4 h-4" />
                Enviar datos a {report.reporterName}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
