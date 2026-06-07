import React, { useState } from 'react';
import { Report, CategoryType } from '../types';
import { Bell, MapPin, Calendar, Megaphone, AlertCircle, Sparkles, Check, CheckCheck, Sliders, ShieldAlert } from 'lucide-react';

interface AlertsNotificationsProps {
  onBackToMap: () => void;
  onSelectReport: (report: Report) => void;
  reports: Report[];
  userAvatar: string;
}

interface MockNotification {
  id: string;
  type: 'lost' | 'spotted' | 'stray' | 'danger' | 'info';
  title: string;
  location: string;
  time: string;
  image: string;
  isUnread: boolean;
  refReportId?: string; // Links back to real interactive reports
}

export default function AlertsNotifications({
  onBackToMap,
  onSelectReport,
  reports,
  userAvatar
}: AlertsNotificationsProps) {
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'lost' | 'spotted' | 'danger'>('todos');

  // Hardcoded rich initial alerts matching the requested layout image
  const [notifications, setNotifications] = useState<MockNotification[]>([
    {
      id: 'notif-1',
      type: 'lost',
      title: '¡Alerta! Perro visto cerca de ti',
      location: 'A 300m - Parque Central',
      time: 'Hace 5 min',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPkN2l0eRnBmhnjVHw5fFMfsgZEFgIQgYGUqOOdkmImlGac9SZlvYEGMKtwIc8LixDpmsR_MBG286tBdTI9vf9sDv6p1IkNATPOvDxN_IwBiH16NCbCG9RP0cCzg613HSK1wpBQxcD2F6FpOAFkPHWuZmuibVR7JwxUoipLPeX0nLJdFWr_v9m6PqAYuY-yUuEEBC4V2bgV4TP7Pwtqis-G0zGy41biOK7__X_W2ZOBlHsBDMcayLagYBQXXC3CXgqsiNApOXV8pQ',
      isUnread: true,
      refReportId: 'report-1'
    },
    {
      id: 'notif-2',
      type: 'spotted',
      title: 'Posible coincidencia: Gato atigrado',
      location: 'A 1.2km - Calle 42',
      time: 'Hace 42 min',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOOmBdaHGbdYKCb2hXOv4UxdHPrDbjBLw9i19fQ0WGAWwwuNgfHJlugPi403vCcaDktJpXCwAtGK-wxlpKEAcsZdfdlqQBFj6VCyFhxjveTH9fRg5YLzajxbuUPFm3o5E1ZNEU7mVmqTD9k-DikqePXZpMy-UOdbEyPZAUqFEEFVZTaxtFP1EgNamWJctRZF85XSRTqp94DVSsXH_54a41OAucLUSvyRe73v8_KcDTk_hgMzY3zL0eEb0oQeBXKMvuse9oiIWDRkE',
      isUnread: true,
      refReportId: 'report-2'
    },
    {
      id: 'notif-3',
      type: 'info',
      title: 'Campaña de vacunación gratuita',
      location: 'Este fin de semana en Plaza Mayor',
      time: 'Hace 2 hrs',
      image: '',
      isUnread: false
    },
    {
      id: 'notif-4',
      type: 'stray',
      title: 'Perro deambulando solo',
      location: 'A 800m - Av. Las Américas',
      time: 'Ayer, 18:30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj5JJDAGFKzhdnLwFBGBPZQs1ARLPCR-3wPe3NFp9CCaek1M8Q2eIra7zp-S-EwzJT4HZMqQMmKuBkdvpiROrhwcHbzlVExE3-ZO7NZ2VeP0yapGAjrQnnDS7ASKMMTjmRabSTz3Ob_TPKSQiTj2RWQ8C9eEDsuce_Mc81Y6Es-9FnvVAY-OcJk8P2nuCdwRBkKlGOjVbR2mYodzXgvbCUlcCTSv_kNmpMbb72kBOBfl6TFNqnlPVxucVM9LCiXWyPbzPwCQUHJGg',
      isUnread: false,
      refReportId: 'report-3'
    },
    {
      id: 'notif-5',
      type: 'danger',
      title: 'Veneno reportado en parque',
      location: 'A 2km - Parque del Sur',
      time: 'Ayer, 14:15',
      image: '',
      isUnread: false,
      refReportId: 'report-4'
    }
  ]);

  const handleNotificationClick = (notif: MockNotification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notif.id ? { ...n, isUnread: false } : n)
    );

    // If it corresponds to a real report list id, toggle details screen.
    if (notif.refReportId) {
      const parentReport = reports.find(r => r.id === notif.refReportId);
      if (parentReport) {
        onSelectReport(parentReport);
      }
    }
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'lost':
        return 'bg-status-lost/15 text-status-lost';
      case 'spotted':
        return 'bg-status-spotted/15 text-[#b38000]';
      case 'stray':
        return 'bg-status-stray/15 text-primary';
      case 'danger':
        return 'bg-status-danger/15 text-status-danger';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'lost': return 'Perdido';
      case 'spotted': return 'Avistamiento';
      case 'stray': return 'Callejero';
      case 'danger': return 'Peligro';
      default: return 'Comunidad';
    }
  };

  const filteredNotifs = notifications.filter(notif => {
    if (selectedFilter === 'todos') return true;
    return notif.type === selectedFilter;
  });

  return (
    <div className="relative w-full max-w-sm mx-auto bg-background-custom min-h-screen text-on-background pb-32">
      
      {/* Dynamic Header App Bar */}
      <header className="bg-white shadow-sm fixed top-0 w-full max-w-sm z-50 flex justify-between items-center px-4 h-16 border-b border-[#eeeef0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm focus:outline-none">
            <img alt="User profile" className="w-full h-full object-cover" src={userAvatar} />
          </div>
          <h1 className="font-sans text-lg font-bold text-primary">Mascosafe</h1>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary leading-none hover:bg-slate-50 transition-colors focus:outline-none">
          <span className="text-xl">⚙️</span>
        </button>
      </header>

      {/* Main notifications screen content */}
      <main className="pt-20 px-4">
        
        {/* Title area */}
        <div className="mb-5 mt-3">
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1c1e] mb-1">
            Notificaciones
          </h2>
          <p className="text-xs text-on-surface-variant font-medium">
            Mantente al tanto de lo que sucede en tu zona.
          </p>
        </div>

        {/* Horizontal filter chips slider matching images */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar px-0.5">
          <button 
            type="button"
            onClick={() => setSelectedFilter('todos')}
            className={`px-4 py-2 rounded-full font-label text-xs font-bold transition-all whitespace-nowrap outline-none ${
              selectedFilter === 'todos' 
              ? 'bg-primary text-white shadow-sm' 
              : 'bg-white border border-[#bfc7d1]/50 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todas
          </button>
          
          <button 
            type="button"
            onClick={() => setSelectedFilter('lost')}
            className={`px-4 py-2 rounded-full font-label text-xs font-bold transition-all whitespace-nowrap outline-none ${
              selectedFilter === 'lost' 
              ? 'bg-status-lost text-white shadow-sm' 
              : 'bg-white border border-[#bfc7d1]/50 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Perdidos
          </button>

          <button 
            type="button"
            onClick={() => setSelectedFilter('spotted')}
            className={`px-4 py-2 rounded-full font-label text-xs font-bold transition-all whitespace-nowrap outline-none ${
              selectedFilter === 'spotted' 
              ? 'bg-status-spotted text-white shadow-sm' 
              : 'bg-white border border-[#bfc7d1]/50 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Avistamientos
          </button>

          <button 
            type="button"
            onClick={() => setSelectedFilter('danger')}
            className={`px-4 py-2 rounded-full font-label text-xs font-bold transition-all whitespace-nowrap outline-none ${
              selectedFilter === 'danger' 
              ? 'bg-status-danger text-white shadow-sm' 
              : 'bg-white border border-[#bfc7d1]/50 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Peligros
          </button>
        </div>

        {/* Date: Hoy separator and Feed */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1">
            Urgentes / Recientes
          </div>

          {filteredNotifs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#eeeef0] text-center text-slate-400 font-medium">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm">No hay reportes recientes con este filtro.</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <article 
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`relative bg-white rounded-2xl p-4 shadow-sm border border-[#eeeef0] flex gap-4 cursor-pointer hover:border-primary-container/30 transition-all ${
                  notif.isUnread ? 'ring-1 ring-primary-container/40' : 'opacity-85'
                }`}
              >
                {/* Blue Unread Dot Badge indicator */}
                {notif.isUnread && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary-container rounded-full shadow-sm animate-pulse" />
                )}

                {/* Avatar u Image Thumbnail container */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 relative flex items-center justify-center">
                  {notif.image ? (
                    <img alt="Thumbnail" className="w-full h-full object-cover" src={notif.image} />
                  ) : notif.type === 'info' ? (
                    <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center rounded-xl">
                      <Megaphone className="w-6 h-6 shrink-0 fill-primary/10" />
                    </div>
                  ) : (
                    <div className="bg-status-danger/10 text-status-danger w-full h-full flex items-center justify-center rounded-xl">
                      <AlertCircle className="w-6 h-6 shrink-0 fill-status-danger/10" />
                    </div>
                  )}
                </div>

                {/* Info Text details */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label text-[10px] font-bold uppercase tracking-wide ${getBadgeStyles(notif.type)}`}>
                      {getBadgeLabel(notif.type)}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-auto mr-3">
                      {notif.time}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#1a1c1e] truncate pr-4">
                    {notif.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-1 text-slate-505">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-500 truncate">
                      {notif.location}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}

          {/* End of notifications list checklist confirmation */}
          <div className="text-center mt-10 mb-4 flex flex-col items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mb-1">
              <CheckCheck className="w-5 h-5 font-bold" />
            </div>
            <p className="font-label text-xs font-bold text-emerald-500 uppercase tracking-widest">Estás al día</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Has revisado todas las alertas de tu colonia.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
