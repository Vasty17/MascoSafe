import React, { useState } from 'react';
import { SEED_REPORTS } from './mockData';
import { Report, CategoryType, ViewType } from './types';
import InteractiveMap from './components/InteractiveMap';
import ReportDetail from './components/ReportDetail';
import ReportForm from './components/ReportForm';
import AlertsNotifications from './components/AlertsNotifications';
import AuthScreen from './components/AuthScreen';
import { 
  Map as MapIcon, 
  PlusCircle, 
  Bell, 
  User, 
  Search, 
  Mic, 
  SlidersHorizontal, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Heart, 
  AlertTriangle,
  Info 
} from 'lucide-react';

export default function App() {
  // Authentication session
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  // View Routing State
  const [currentView, setCurrentView] = useState<ViewType>('auth');
  
  // Custom toast alert feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Map category filter chips
  const [mapFilter, setMapFilter] = useState<string>('all');

  // Interactive Live Map Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary list of reports (seeded with mockData, dynamically updatable)
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS);

  // Active report selected for deep detail overlay
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Chosen coordinates from Map visualizer during creation
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number; address: string } | undefined>(undefined);

  // Help wizard indicator to select location on map
  const [isSelectingLocationCoords, setIsSelectingLocationCoords] = useState<boolean>(false);

  // Trigger feedback messages
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = (user: { name: string; email: string; avatar: string }) => {
    setCurrentUser(user);
    setCurrentView('map');
    triggerToast(`¡Bienvenido, ${user.name}! Sesión iniciada.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('auth');
    triggerToast('Has cerrado sesión correctamente.');
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setCurrentView('report_detail');
  };

  const handleAddNewReportClick = () => {
    setIsSelectingLocationCoords(false);
    setCurrentView('report_form');
  };

  // Callback from report form to trigger location confirmation workflow
  const handleStartMapLocationPicker = () => {
    setIsSelectingLocationCoords(true);
    setCurrentView('map');
    triggerToast('📍 Presiona la ubicación exacta en el mapa para tu reporte.');
  };

  // Called when user selects coords on map click
  const handleMapLocationConfirm = (lat: number, lng: number, address: string) => {
    setSelectedCoordinates({ lat, lng, address });
    setIsSelectingLocationCoords(false);
    setCurrentView('report_form');
    triggerToast('✅ Ubicación confirmada y guardada.');
  };

  // Add report to collection
  const handleReportSubmit = (newReportData: Partial<Report>) => {
    const reportId = `report-${Date.now()}`;
    const fullReport: Report = {
      id: reportId,
      category: newReportData.category || 'lost',
      petName: newReportData.petName,
      breed: newReportData.breed,
      gender: newReportData.gender,
      size: newReportData.size,
      color: newReportData.color,
      description: newReportData.description || '',
      image: newReportData.image || '',
      date: 'Hoy',
      timeAgo: 'Hace unos instantes',
      locationName: newReportData.locationName || 'Santiago Centro, Chile',
      lat: newReportData.lat || -33.4489,
      lng: newReportData.lng || -70.6693,
      reporterName: currentUser?.name || 'Vecino Comunitario',
      reporterAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      reporterPhone: newReportData.reporterPhone || '+56 9 9000 0000',
      isVerifiedUser: true,
      views: 1,
      status: 'activo'
    };

    setReports([fullReport, ...reports]);
    setSelectedCoordinates(undefined); // Reset coords
    setCurrentView('map');
    triggerToast('🎉 ¡Reporte publicado con éxito! Ya es visible en el mapa.');
  };

  // Handle vocal mic search click demo
  const handleMicClick = () => {
    const speechOptions = ['Golden', 'Gato', 'Providencia', 'Naranja', 'Pug'];
    const text = speechOptions[Math.floor(Math.random() * speechOptions.length)];
    setSearchQuery(text);
    triggerToast(`🎤 Filtrando por reconocimiento de voz: "${text}"`);
  };

  // Filter reports according to query search and active filters
  const filteredReports = reports.filter(report => {
    // Category match
    if (mapFilter !== 'all' && report.category !== mapFilter) return false;

    // Search query match (petName, breed, location name)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = report.petName?.toLowerCase().includes(q) || false;
      const breedMatch = report.breed?.toLowerCase().includes(q) || false;
      const descMatch = report.description.toLowerCase().includes(q);
      const locMatch = report.locationName.toLowerCase().includes(q);
      return nameMatch || breedMatch || descMatch || locMatch;
    }

    return true;
  });

  return (
    <div className="w-full min-h-screen bg-slate-900 flex justify-center items-center p-0 md:py-6 lg:py-8 antialiased selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Simulation Mobile Device Iframe Window Mockup */}
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[840px] bg-background-custom rounded-none md:rounded-[40px] shadow-[0px_24px_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col border-0 md:border-[10px] border-slate-950">
        
        {/* View container slot */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          
          {currentView === 'auth' && (
            <AuthScreen 
              onLoginSuccess={handleLoginSuccess} 
              onAlertMessage={triggerToast} 
            />
          )}

          {currentView === 'map' && currentUser && (
            <div className="w-full h-full relative overflow-hidden">
              
              {/* Custom Header with Profile Info */}
              <header className="bg-white/95 backdrop-blur-md shadow-sm absolute top-0 left-0 right-0 px-4 h-16 z-40 transition-all border-b border-[#eeeef0] flex items-center justify-between">
                <button 
                  onClick={() => setCurrentView('profile')}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm scale-95 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary-container shrink-0"
                >
                  <img alt="User Profile avatar" className="w-full h-full object-cover" src={currentUser.avatar} />
                </button>
                
                <h1 className="font-sans text-xl font-black text-primary tracking-tight">Mascosafe</h1>
                
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-[#6f7880] hover:bg-slate-50 scale-95 active:scale-90 transition-all focus:outline-none"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5 text-[#ba1a1a]" />
                </button>
              </header>

              {/* Floating filters layout absolute below top app bar */}
              <div className="absolute top-16 left-0 right-0 p-4 z-10 flex flex-col gap-3 pointer-events-none">
                {/* Search query input box */}
                {!isSelectingLocationCoords && (
                  <div className="bg-white rounded-2xl shadow-md flex items-center px-3 py-2.5 pointer-events-auto border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-[#59b3ef]/40">
                    <Search className="w-4 h-4 text-[#6f7880] mr-2.5 shrink-0" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por zona o raza..."
                      className="w-full bg-transparent text-xs text-[#1a1c1e] outline-none font-medium placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-slate-400 ml-1.5 mr-1 font-bold font-sans"
                      >
                        ✕
                      </button>
                    )}
                    <button 
                      onClick={handleMicClick}
                      className="ml-2 bg-slate-100 p-2 rounded-full text-primary hover:bg-primary-container/20 transition-colors shrink-0"
                      title="Dictado por voz"
                    >
                      <Mic className="w-3.5 h-3.5 fill-primary" />
                    </button>
                  </div>
                )}

                {/* Categories Filter horizontal pill slider */}
                {!isSelectingLocationCoords && (
                  <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar pointer-events-auto snap-x">
                    <button
                      onClick={() => setMapFilter('all')}
                      className={`snap-start whitespace-nowrap font-label text-xs font-bold px-3 py-2 rounded-full shadow-sm border transition-all ${
                        mapFilter === 'all'
                          ? 'bg-primary text-white border-transparent'
                          : 'bg-white border-[#bfc7d1]/50 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🎪 Todos
                    </button>
                    <button
                      onClick={() => setMapFilter('lost')}
                      className={`snap-start whitespace-nowrap font-label text-xs font-semibold px-3 py-2 rounded-full shadow-sm border transition-all ${
                        mapFilter === 'lost'
                          ? 'bg-status-lost text-white border-transparent'
                          : 'bg-status-lost/10 border-status-lost/30 text-status-lost'
                      }`}
                    >
                      🔍 Perdidos
                    </button>
                    <button
                      onClick={() => setMapFilter('spotted')}
                      className={`snap-start whitespace-nowrap font-label text-xs font-semibold px-3 py-2 rounded-full shadow-sm border transition-all ${
                        mapFilter === 'spotted'
                          ? 'bg-status-spotted text-slate-900 border-transparent font-bold'
                          : 'bg-status-spotted/10 border-status-spotted/30 text-[#b38000]'
                      }`}
                    >
                      👁️ Vistos
                    </button>
                    <button
                      onClick={() => setMapFilter('stray')}
                      className={`snap-start whitespace-nowrap font-label text-xs font-semibold px-3 py-2 rounded-full shadow-sm border transition-all ${
                        mapFilter === 'stray'
                          ? 'bg-[#59B3EF] text-white border-transparent'
                          : 'bg-[#59B3EF]/10 border-status-stray/30 text-primary'
                      }`}
                    >
                      🐾 Callejeros
                    </button>
                    <button
                      onClick={() => setMapFilter('danger')}
                      className={`snap-start whitespace-nowrap font-label text-xs font-semibold px-3 py-2 rounded-full shadow-sm border transition-all ${
                        mapFilter === 'danger'
                          ? 'bg-status-danger text-white border-transparent'
                          : 'bg-status-danger/10 border-status-danger/30 text-status-danger'
                      }`}
                    >
                      🚨 Peligros
                    </button>
                  </div>
                )}
              </div>

              {/* Full view leaf-canvas */}
              <div className="w-full h-full pt-16">
                <InteractiveMap 
                  reports={filteredReports}
                  selectedCategory={mapFilter}
                  onSelectReport={handleSelectReport}
                  onAddNewReportClick={handleAddNewReportClick}
                  onMapLocationSelect={handleMapLocationConfirm}
                  isSelectingLocation={isSelectingLocationCoords}
                />
              </div>

              {/* Central Floating Action button overlayed above map (New Report) */}
              {!isSelectingLocationCoords && (
                <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none">
                  <button 
                    onClick={handleAddNewReportClick}
                    className="bg-[#59b3ef] hover:bg-opacity-95 text-white shadow-xl hover:shadow-[#59b3ef]/20 rounded-full px-5 py-3.5 flex items-center gap-2 pointer-events-auto transition-transform active:scale-95 group focus:outline-none"
                  >
                    <PlusCircle className="w-5 h-5 animate-pulse" />
                    <span className="font-label text-sm font-bold tracking-wide">Nuevo Reporte</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {currentView === 'report_form' && currentUser && (
            <ReportForm 
              onBack={() => setCurrentView('map')} 
              onSubmit={handleReportSubmit}
              selectedCoordinates={selectedCoordinates}
              onSelectLocationOnMap={handleStartMapLocationPicker}
              onAlertMessage={triggerToast}
            />
          )}

          {currentView === 'report_detail' && selectedReport && (
            <ReportDetail 
              report={selectedReport} 
              onBack={() => {
                setSelectedReport(null);
                setCurrentView('map');
              }}
              onAlertMessage={triggerToast}
            />
          )}

          {currentView === 'notifications' && currentUser && (
            <AlertsNotifications 
              onBackToMap={() => setCurrentView('map')}
              onSelectReport={handleSelectReport}
              reports={reports}
              userAvatar={currentUser.avatar}
            />
          )}

          {currentView === 'profile' && currentUser && (
            /* ================= PERSONAL PROFILE DASHBOARD SCREEN ================= */
            <div className="w-full h-full bg-background-custom font-sans flex flex-col relative overflow-hidden">
              
              {/* Header block */}
              <header className="bg-white/95 backdrop-blur-md shadow-sm absolute top-0 left-0 right-0 px-4 h-16 z-40 transition-all border-b border-[#eeeef0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary shrink-0 fill-primary/10" />
                  <span className="font-bold text-slate-800 text-sm">Mi Perfil Mascosafe</span>
                </div>
                
                <button 
                  onClick={() => setCurrentView('map')}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Ir al Mapa
                </button>
              </header>

              {/* Profile details metrics bento banner */}
              <div className="flex-1 overflow-y-auto pt-16 px-4 flex flex-col gap-6 pb-24 no-scrollbar">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-[#59b3ef]" />
                  <img alt="User Avatar" src={currentUser.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-[#cae6ff]" />
                  
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{currentUser.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 bg-[#cae6ff]/50 text-primary px-3 py-1 rounded-full text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Rescatista Activado</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-slate-100">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-primary">
                        {reports.filter(r => r.reporterName === currentUser.name).length}
                      </span>
                      <span className="text-[10px] text-[#6f7880] uppercase tracking-wider font-bold">Mis Reportes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-rose-500">12</span>
                      <span className="text-[10px] text-[#6f7880] uppercase tracking-wider font-bold">Puntos de Ayuda</span>
                    </div>
                  </div>
                </div>

                {/* Mis reportes creados dynamico list */}
                <div>
                  <h4 className="text-sm font-black text-[#1a1c1e] mb-2.5 tracking-tight flex items-center gap-1.5">
                    🎈 Mis Reportes en Curso
                  </h4>
                  <div className="flex flex-col gap-3">
                    {reports.filter(r => r.reporterName === currentUser.name).length === 0 ? (
                      <div className="bg-white p-6 rounded-2xl text-center border border-slate-100 text-slate-400 text-xs">
                        No has realizado ningún reporte de emergencia en esta sesión. ¡Compártenos si ves a una mascota en riesgo!
                      </div>
                    ) : (
                      reports.filter(r => r.reporterName === currentUser.name).map((r) => (
                        <div 
                          key={r.id}
                          className="bg-white rounded-2xl p-3 border border-slate-100 flex items-center justify-between shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {r.image ? (
                              <img src={r.image} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="w-12 h-12 bg-rose-50 rounded-xl text-rose-500 flex items-center justify-center shrink-0">🚨</div>
                            )}
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-800 truncate pr-2">{r.petName || r.breed || 'Reporte de Emergencia'}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{r.locationName}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleSelectReport(r)}
                            className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 font-bold px-3 py-1.5 rounded-full outline-none"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Directorio de emergencias Chile */}
                <div>
                  <h4 className="text-sm font-black text-[#1a1c1e] mb-2.5 tracking-tight flex items-center gap-1.5">
                    🚑 Directorio de Rescate y Emergencias (Chile)
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">BIDEMA - Policía de Investigaciones (PDI)</p>
                        <p className="text-[10px] text-slate-400">Brigada de Delitos contra el Medioambiente y Maltrato Animal</p>
                      </div>
                      <a href="tel:134" className="bg-primary/10 text-primary p-2 rounded-full">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Carabineros de Chile</p>
                        <p className="text-[10px] text-slate-400">Canal oficial de orden social y denuncias inmediatas</p>
                      </div>
                      <a href="tel:133" className="bg-primary/10 text-primary p-2 rounded-full">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Hospital Clínico Veterinario U. de Chile</p>
                        <p className="text-[10px] text-slate-400">Emergencias veterinarias de alta complejidad 24 Horas</p>
                      </div>
                      <a href="tel:+56229780300" className="bg-primary/10 text-primary p-2 rounded-full">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Logout action */}
                <button
                  onClick={handleLogout}
                  className="w-full border-2 border-rose-500/30 text-rose-600 hover:bg-rose-50 font-bold py-3.5 rounded-2xl text-xs tracking-wider uppercase mt-4 flex items-center justify-center gap-2 outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión Activa
                </button>

              </div>
            </div>
          )}

        </div>

        {/* PERSISTENT BOTTOM NAVIGATION BAR (Visible once authenticated and not selecting location coordinates) */}
        {currentUser && !isSelectingLocationCoords && (
          <nav className="bg-white/95 backdrop-blur-md shadow-[0px_-8px_24px_rgba(89,179,239,0.06)] absolute bottom-0 left-0 right-0 h-16 z-50 border-t border-slate-100 flex justify-around items-center px-1">
            
            {/* Nav Tab 1: Mapa */}
            <button
              onClick={() => {
                setSelectedReport(null);
                setCurrentView('map');
              }}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all active:scale-95 focus:outline-none ${
                currentView === 'map' || currentView === 'report_detail'
                  ? 'text-primary bg-primary/10 font-bold'
                  : 'text-[#6f7880] hover:text-[#1a1c1e]'
              }`}
            >
              <MapIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight mt-0.5 font-label">Mapa</span>
            </button>

            {/* Nav Tab 2: Reportar */}
            <button
              onClick={() => {
                setSelectedCoordinates(undefined);
                setCurrentView('report_form');
              }}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all active:scale-95 focus:outline-none ${
                currentView === 'report_form'
                  ? 'text-primary bg-primary/10 font-bold'
                  : 'text-[#6f7880] hover:text-[#1a1c1e]'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight mt-0.5 font-label">Reportar</span>
            </button>

            {/* Nav Tab 3: Alertas */}
            <button
              onClick={() => setCurrentView('notifications')}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all active:scale-95 focus:outline-none relative ${
                currentView === 'notifications'
                  ? 'text-primary bg-primary/10 font-bold'
                  : 'text-[#6f7880] hover:text-[#1a1c1e]'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight mt-0.5 font-label">Alertas</span>
              
              {/* Unread dot badge indicator */}
              <span className="absolute top-2 right-4 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </button>

            {/* Nav Tab 4: Perfil */}
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all active:scale-95 focus:outline-none ${
                currentView === 'profile'
                  ? 'text-primary bg-primary/10 font-bold'
                  : 'text-[#6f7880] hover:text-[#1a1c1e]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight mt-0.5 font-label">Perfil</span>
            </button>

          </nav>
        )}

        {/* Dynamic Glowing Feedback alerts */}
        {toastMessage && (
          <div className={`absolute ${currentUser && currentView !== 'auth' ? 'top-20' : 'top-4'} left-4 right-4 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg z-[100] animate-slide-down flex items-center gap-2 border border-slate-800`}>
            <span className="text-primary font-bold">●</span>
            <span className="flex-1 text-slate-100">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 font-bold ml-1 hover:text-white">✕</button>
          </div>
        )}

      </div>
    </div>
  );
}
