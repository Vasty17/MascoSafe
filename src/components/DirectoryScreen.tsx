import React, { useState } from 'react';
import { ArrowLeft, Search, Star, MapPin, Phone, Clock, Stethoscope, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ContactPlace {
  id: string;
  name: string;
  type: 'clinica' | 'refugio';
  isOpen: boolean;
  isOpen24h: boolean;
  distance: string;
  address: string;
  tags: string[];
  rating: number;
  reviews: number;
  image: string;
  hours: string;
}

const mockPlaces: ContactPlace[] = [
  {
    id: '1',
    name: 'Clínica Veterinaria San Antón',
    type: 'clinica',
    isOpen: true,
    isOpen24h: false,
    distance: '1.2 km',
    address: 'Calle de la Amistad 45, Centro',
    tags: ['Urgencias', 'Rayos X'],
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600',
    hours: '08:00 - 20:00'
  },
  {
    id: '2',
    name: 'Refugio Huellas Felices',
    type: 'refugio',
    isOpen: false,
    isOpen24h: false,
    distance: '3.5 km',
    address: 'Av. de los Animales 12, Las Rosas',
    tags: ['Adopción', 'Voluntariado'],
    rating: 4.9,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600',
    hours: '10:00 - 18:00'
  },
  {
    id: '3',
    name: 'Hospital Mascotas Plus',
    type: 'clinica',
    isOpen: true,
    isOpen24h: true,
    distance: '4.1 km',
    address: 'Paseo Principal 200, Providencia',
    tags: ['Cirugía', '24 Horas'],
    rating: 4.7,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1629813295861-c8eb5ebf6002?auto=format&fit=crop&q=80&w=600',
    hours: '24 Horas'
  }
];

export default function DirectoryScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todas' | 'Clínicas 24h' | 'Refugios'>('Todas');
  const [selectedPlace, setSelectedPlace] = useState<ContactPlace | null>(null);

  const filteredPlaces = mockPlaces.filter(place => {
    if (search && !place.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'Clínicas 24h' && !place.isOpen24h) return false;
    if (filter === 'Refugios' && place.type !== 'refugio') return false;
    return true;
  });

  if (selectedPlace) {
    return (
      <div className="absolute inset-0 bg-background-custom flex flex-col overflow-hidden text-on-background z-50 animate-slide-in">
        <header className="bg-white/95 backdrop-blur-md shadow-sm absolute top-0 left-0 right-0 z-50 flex items-center px-4 h-16 border-b border-[#eeeef0]">
          <button 
            onClick={() => setSelectedPlace(null)}
            className="w-10 h-10 flex items-center justify-center text-primary bg-[#f3f3f6] rounded-full scale-95 active:scale-90 transition-all outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-[#1a1c1e] text-lg ml-3 capitalize tracking-tight flex-1 truncate">
            {selectedPlace.name}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {/* Hero */}
          <div className="relative w-full h-[260px] bg-slate-900">
            <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute top-20 right-4 bg-emerald-400 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> Certificado
            </div>
          </div>

          <div className="bg-white -mt-6 relative z-10 rounded-t-3xl pt-6 px-5 pb-6">
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-2xl font-black text-slate-800 leading-tight">
                {selectedPlace.name}
              </h1>
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-2xl flex flex-col items-center ml-4 shrink-0">
                <span className="text-sm font-black">{selectedPlace.rating}</span>
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Rating</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mb-6">
              <MapPin className="w-4 h-4 text-slate-400" /> {selectedPlace.address}
            </p>

            {/* Boxes */}
            <div className="border border-slate-100 rounded-2xl p-4 shadow-sm mb-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Horarios de Atención
              </h3>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                <span>Lunes - Viernes</span>
                <span className="text-slate-800 font-semibold">{selectedPlace.hours}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Sábados / Domingos</span>
                {selectedPlace.isOpen24h ? (
                  <span className="text-slate-800 font-semibold">24 Horas</span>
                ) : (
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">Solo Emergencias</span>
                )}
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl p-4 shadow-sm mb-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" /> Servicios Destacados
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlace.tags.map((t, i) => (
                  <span key={i} className="bg-[#f0f4f8] text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#e4ece9] relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%231a202c\\' fill-opacity=\\'0.4\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')", backgroundSize: '12px' }} />
              <MapPin className="w-10 h-10 text-primary drop-shadow mb-2 relative z-10" />
              <button className="bg-white text-primary px-4 py-2 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-colors relative z-10 w-full flex items-center justify-center gap-2">
                Ver en Google Maps
              </button>
            </div>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe-bottom z-40 shadow-lg rounded-t-xl">
          <button className="w-full bg-[#da2c38] hover:bg-[#c22430] text-white font-black tracking-wide py-4.5 h-[56px] rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform">
            <ShieldAlert className="w-5 h-5" /> LLAMADA DE EMERGENCIA
            <span className="absolute bottom-1 right-2 text-[8px] font-medium opacity-80 uppercase tracking-widest hidden md:block">Línea directa 24/7</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background-custom flex flex-col overflow-hidden text-on-background z-40">
      
      {/* Header */}
      <header className="bg-white shadow-sm absolute top-0 left-0 right-0 z-50 flex flex-col px-4 pt-4 pb-3 border-b border-[#eeeef0]">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-primary bg-[#f3f3f6] rounded-full scale-95 active:scale-90 transition-all outline-none mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-[#1a1c1e] text-lg tracking-tight">
            Clínicas y Refugios
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar clínicas o refugios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f4f5f7] border border-transparent focus:border-primary/30 focus:bg-white text-sm rounded-2xl py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {['Todas', 'Clínicas 24h', 'Refugios'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                filter === f 
                  ? 'bg-primary text-white scale-105' 
                  : 'bg-[#eef2f6] text-slate-600 hover:bg-[#e4e9f0]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* List Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-[168px] pb-24 px-4 bg-slate-50/50">
        
        <div className="bg-white border text-center border-slate-100 rounded-xl p-3 mb-4 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Ordenar por cercanía<br/><span className="text-[10px] text-slate-400 font-medium">Usa tu ubicación GPS</span></span>
          <div className="w-10 h-6 bg-primary/20 rounded-full relative">
            <div className="w-4 h-4 bg-primary rounded-full absolute right-1 top-1 shadow-sm"></div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredPlaces.map(place => (
            <div key={place.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col pb-4 cursor-pointer" onClick={() => setSelectedPlace(place)}>
              <div className="relative h-[140px] w-full bg-slate-200">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1 ${
                  place.isOpen ? 'bg-[#50e3c2] text-slate-900' : 'bg-white/90 text-red-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${place.isOpen ? 'bg-slate-900' : 'bg-red-500'}`} />
                  {place.isOpen ? (place.isOpen24h ? 'Abierto 24h' : 'Abierto') : 'Cerrado'}
                </div>
              </div>
              <div className="px-4 pt-3 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 leading-tight pr-2">{place.name}</h3>
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-xs font-semibold text-slate-600 shrink-0">
                    <Star className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623]" /> {place.rating}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {place.distance} • {place.address}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {place.tags.map(t => (
                    <span key={t} className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-2 border-t border-slate-50 flex justify-between items-center">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700">
                    <Star className="w-4 h-4 text-slate-300" /> ({place.reviews})
                  </button>
                  <button className="bg-primary hover:bg-[#4ea2dd] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                    Ver más <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPlaces.length === 0 && (
             <div className="py-12 bg-transparent text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
               <Map className="w-8 h-8 text-slate-300 mb-2" />
               <p className="text-sm font-semibold text-slate-500">¿No encuentras lo que buscas?</p>
               <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Intenta ampliar el radio de búsqueda o utiliza filtros específicos.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
