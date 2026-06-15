import React, { useState } from 'react';
import { CategoryType, Report } from '../types';
import { ArrowLeft, Search, Eye, AlertTriangle, Phone, Plus, Camera, MapPin, Upload, Compass, Check, Trash2 } from 'lucide-react';

interface ReportFormProps {
  onBack: () => void;
  onSubmit: (report: Partial<Report>) => void;
  selectedCoordinates?: { lat: number; lng: number; address: string };
  onSelectLocationOnMap: () => void;
  onAlertMessage?: (msg: string) => void;
}

// Collection of beautiful preloaded pet photos for easier testing/simulation
const PRELOADED_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400', label: 'Golden retriever amigable' },
  { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', label: 'Gato naranja dócil' },
  { url: 'https://images.unsplash.com/photo-1537151608828-ea2b117b6281?auto=format&fit=crop&q=80&w=400', label: 'Cachorrito blanco' },
  { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400', label: 'Pug tierno' },
  { url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=400', label: 'Gatito atigrado' }
];

export default function ReportForm({
  onBack,
  onSubmit,
  selectedCoordinates,
  onSelectLocationOnMap,
  onAlertMessage
}: ReportFormProps) {
  // Wizard Steps
  const [category, setCategory] = useState<CategoryType>('lost');
  
  // Form fields
  const [petName, setPetName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'macho' | 'hembra' | 'desconocido'>('desconocido');
  const [size, setSize] = useState<'pequeño' | 'mediano' | 'grande'>('mediano');
  const [color, setColor] = useState('');
  
  // Image handling
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPreloadedGrid, setShowPreloadedGrid] = useState(false);

  // Custom errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadClick = () => {
    setShowPreloadedGrid(true);
  };

  const handleSelectPreloaded = (url: string) => {
    setImagePreview(url);
    setShowPreloadedGrid(false);
    if (onAlertMessage) {
      onAlertMessage('📸 Foto seleccionada con éxito para el reporte.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        if (onAlertMessage) {
          onAlertMessage('📸 Foto de dispositivo cargada con éxito.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria para ayudar en la búsqueda';
    }
    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'El número de teléfono es obligatorio';
    } else if (!/^\+?[\d\s-]{8,15}$/.test(contactPhone.trim())) {
      newErrors.contactPhone = 'Ingresa un número telefónico válido (10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      if (onAlertMessage) {
        onAlertMessage('⚠️ Por favor completa los campos marcados como obligatorios.');
      }
      return;
    }

    const defaultAddress = selectedCoordinates?.address || 'Av. Libertador Bernardo O\'Higgins, Santiago Centro';
    const finalLat = selectedCoordinates?.lat || -33.4489;
    const finalLng = selectedCoordinates?.lng || -70.6693;

    const newReport: Partial<Report> = {
      category,
      petName: petName.trim() || undefined,
      breed: breed.trim() || (category === 'danger' ? 'Advertencia comunitaria' : 'Mascota Mestiza'),
      description: description.trim(),
      reporterPhone: contactPhone.trim(),
      image: imagePreview,
      locationName: defaultAddress,
      lat: finalLat,
      lng: finalLng,
      gender,
      size,
      color: color.trim() || undefined,
      status: 'activo'
    };

    onSubmit(newReport);
  };

  return (
    <div className="absolute inset-0 bg-background-custom flex flex-col overflow-hidden">
      {/* Top Application Bar Header */}
      <header className="bg-white shadow-sm absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-16 transition-colors border-b border-[#eeeef0]">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#f3f3f6] rounded-full scale-95 active:opacity-80 transition-all outline-none"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="font-sans text-lg font-bold text-primary">Crear Reporte</h1>
        <div className="w-10 h-10"></div> {/* Balanced spacer placeholder */}
      </header>

      {/* Main Form content wrapper nested below top bar */}
      <main className="flex-1 overflow-y-auto pt-16 pb-28 px-4 flex flex-col gap-6 no-scrollbar">
        
        {/* STEP 1: ¿Qué sucedió? (Category Select Grid) */}
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-base font-bold text-[#1a1c1e] flex items-center gap-1.5 mt-2">
            1. ¿Qué sucedió?
          </h2>
          
          <div className="grid grid-cols-2 gap-3" id="category-grid">
            {/* Category Button: Perdido */}
            <button
              type="button"
              onClick={() => setCategory('lost')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 text-center transition-all duration-200 active:scale-95 outline-none ${
                category === 'lost' 
                ? 'border-status-lost bg-status-lost/10 shadow-md' 
                : 'border-[#eeeef0] bg-white shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category === 'lost' ? 'bg-status-lost text-white' : 'bg-status-lost/15 text-status-lost'}`}>
                <Search className="w-5 h-5" />
              </div>
              <span className="font-label text-xs font-semibold text-[#1a1c1e]">Perdido</span>
            </button>

            {/* Category Button: Visto */}
            <button
              type="button"
              onClick={() => setCategory('spotted')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 text-center transition-all duration-200 active:scale-95 outline-none ${
                category === 'spotted' 
                ? 'border-status-spotted bg-status-spotted/10 shadow-md' 
                : 'border-[#eeeef0] bg-white shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category === 'spotted' ? 'bg-status-spotted text-white' : 'bg-status-spotted/15 text-status-spotted'}`}>
                <Eye className="w-5 h-5" />
              </div>
              <span className="font-label text-xs font-semibold text-[#1a1c1e]">Visto</span>
            </button>

            {/* Category Button: Callejero */}
            <button
              type="button"
              onClick={() => setCategory('stray')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 text-center transition-all duration-200 active:scale-95 outline-none ${
                category === 'stray' 
                ? 'border-status-stray bg-status-stray/15 shadow-md' 
                : 'border-[#eeeef0] bg-white shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category === 'stray' ? 'bg-status-stray text-white' : 'bg-status-stray/15 text-status-stray'}`}>
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-label text-xs font-semibold text-[#1a1c1e]">Callejero</span>
            </button>

            {/* Category Button: Peligro */}
            <button
              type="button"
              onClick={() => setCategory('danger')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 text-center transition-all duration-200 active:scale-95 outline-none ${
                category === 'danger' 
                ? 'border-status-danger bg-status-danger/10 shadow-md' 
                : 'border-[#eeeef0] bg-white shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category === 'danger' ? 'bg-status-danger text-white' : 'bg-status-danger/15 text-status-danger'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="font-label text-xs font-semibold text-[#1a1c1e]">Peligro</span>
            </button>
          </div>
        </section>

        {/* STEP 2: Evidencia y Ubicación */}
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-base font-bold text-[#1a1c1e]">
            2. Evidencia y Ubicación
          </h2>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eeeef0] flex flex-col gap-4">
            
            {/* Foto Upload simulation box */}
            <div>
              <p className="font-label text-xs font-semibold text-[#1a1c1e] mb-1.5">Foto de la mascota u objeto de peligro</p>
              
              {imagePreview ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden group shadow-inner">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors outline-none focus:ring-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="w-full h-40 bg-slate-50 border-2 border-dashed border-[#bfc7d1] hover:border-primary rounded-xl flex flex-col items-center justify-center text-center px-4 transition-colors active:scale-98 cursor-pointer focus:outline-none"
                  >
                    <Camera className="w-10 h-10 text-[#6f7880] mb-2" />
                    <span className="font-label text-xs font-bold text-[#1a1c1e]">Presiona para agregar foto</span>
                    <span className="text-[11px] text-[#6f7880] mt-1">Comparte una foto clara o selecciona una de muestra</span>
                  </button>

                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs bg-slate-100 hover:bg-slate-200 text-[#1a1c1e] border border-[#bfc7d1]/50 font-bold px-4 py-2 rounded-xl active-press cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      Subir archivo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                    <span className="text-[11px] text-[#6f7880]">O bien:</span>
                    <button
                      type="button"
                      onClick={() => setShowPreloadedGrid(true)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Ver fotos de muestra 🐶
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PRELOADED PHOTOS LIGHTBOX GRID POPUP */}
            {showPreloadedGrid && (
              <div className="bg-slate-50 p-3 rounded-xl border border-[#eeeef0] mt-2 animate-fadeIn">
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-200">
                  <span className="text-xs font-bold text-primary">Elige una foto de muestra rápida:</span>
                  <button type="button" onClick={() => setShowPreloadedGrid(false)} className="text-xs font-bold text-slate-400 font-sans">Cerrar</button>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRELOADED_PHOTOS.map((pet, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreloaded(pet.url)}
                      className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 active:scale-90 transition-transform focus:ring-2 focus:ring-primary"
                    >
                      <img src={pet.url} alt={pet.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CONFIRM/SELECT LOCATION SECTION */}
            <div className="border-t border-[#eeeef0] pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-label text-xs font-semibold text-[#1a1c1e]">Ubicación del reporte</p>
                <button
                  type="button"
                  onClick={onSelectLocationOnMap}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 outline-none"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Ubicar en mapa interactivo
                </button>
              </div>

              {/* Fake Mini confirmation Map visualizer */}
              <div className="w-full h-28 rounded-xl overflow-hidden relative border border-[#eeeef0] flex items-center justify-center bg-slate-100">
                <img 
                  alt="Ubicación elegida" 
                  className="w-full h-full object-cover brightness-95 opacity-80" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiYibs4cRpLtWKauxMcZl079nEY8eED-C1kOXt2osmnQLeVeQS9jSnu2QNRuYnq779zNZyMdajGvHVD3ZwS7LWivddxodWqLBUpPdvQjWc3oP8d9LmpdKq3BLiRPOP6tOsRnUwzYcVvG_u0_qzT_jqINkvbwHxwjdfHARMYFPH2E56SLjuV319sBXuYgJn3CsuM6B4wngDDI4h9qFuLkOpDUjx0Je5ZhlKhEcb9vgfnWOV5Amcm6aK3QripnFTZgq87j3YX7Ge0oY" 
                />
                
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                  <div className="bg-primary/20 p-2.5 rounded-full animate-ping">
                    <MapPin className="w-5 h-5 text-primary fill-white" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 px-2.5 rounded-lg flex items-center justify-between shadow-sm border border-slate-100">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-[#1a1c1e] truncate max-w-[200px]">
                      {selectedCoordinates?.address || 'Av. Insurgentes Sur 100, CDMX'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={onSelectLocationOnMap}
                    className="text-[10px] font-bold text-primary uppercase"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* STEP 3: Detalles adicionales */}
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-base font-bold text-[#1a1c1e]">
            3. Detalles adicionales
          </h2>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eeeef0] flex flex-col gap-4">
            
            {/* Optional Name (Only show if not 'danger' report) */}
            {category !== 'danger' && (
              <div className="flex flex-col gap-1">
                <label className="font-label text-xs font-semibold text-[#1a1c1e]" htmlFor="petName">
                  Nombre de la mascota (si lo sabes)
                </label>
                <input
                  id="petName"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ej. Firulais, Max, Michi..."
                  className="w-full bg-slate-50 border border-[#bfc7d1]/60 text-sm text-[#1a1c1e] rounded-xl px-4 py-3 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
            )}

            {/* Brief Description */}
            <div className="flex flex-col gap-1">
              <label className="font-label text-xs font-semibold text-[#1a1c1e] flex justify-between" htmlFor="description">
                <span>Descripción breve <span className="text-[#ba1a1a] font-bold">*</span></span>
                <span className="text-[10px] font-normal text-slate-400">({description.length}/250)</span>
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 250))}
                placeholder={
                  category === 'danger'
                  ? 'Describe el peligro específico (ej. "Tacos con veneno para perros tirados junto a las bancas", "Panal de abejas agresivo")'
                  : 'Raza física, collar o señas particulares (ej. "Trae collar azul de cuero, oreja derecha caída, muy temeroso")'
                }
                className="w-full bg-slate-50 border border-[#bfc7d1]/60 text-sm text-[#1a1c1e] rounded-xl px-4 py-3 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
              />
              {errors.description && <span className="text-[11px] text-[#ba1a1a] font-semibold">{errors.description}</span>}
            </div>

            {/* Optional filters for better search results */}
            {category !== 'danger' && (
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label text-[11px] font-semibold text-slate-500">Sexo</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-[#bfc7d1]/50 text-xs text-[#1a1c1e] rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="desconocido">Desconocido</option>
                    <option value="macho">Macho ♂</option>
                    <option value="hembra">Hembra ♀</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label text-[11px] font-semibold text-slate-500">Tamaño</label>
                  <select
                    value={size}
                    onChange={(e: any) => setSize(e.target.value)}
                    className="w-full bg-slate-50 border border-[#bfc7d1]/50 text-xs text-[#1a1c1e] rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="font-label text-xs font-semibold text-[#1a1c1e]" htmlFor="contactPhone">
                Tu teléfono de contacto <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ej. +52 55 1234 5678 o 10 dígitos"
                  className="w-full bg-slate-50 border border-[#bfc7d1]/60 text-sm text-[#1a1c1e] rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              {errors.contactPhone && <span className="text-[11px] text-[#ba1a1a] font-semibold">{errors.contactPhone}</span>}
              <p className="text-[10px] text-slate-400 font-medium">Solo se usará para que usuarios te contacten por el reporte.</p>
            </div>

          </div>
        </section>

      </main>

      {/* Sticky Bottom publish action overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe-bottom z-40 shadow-lg rounded-t-xl">
        <button
          onClick={handleSubmit}
          className="w-full bg-[#59b3ef] hover:bg-opacity-95 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active-press transition-all focus:outline-none focus:ring-2 focus:ring-[#59b3ef]"
        >
          <Check className="w-5 h-5 font-bold" />
          <span className="text-sm tracking-wide">Publicar Reporte de Emergencia</span>
        </button>
      </div>

    </div>
  );
}
