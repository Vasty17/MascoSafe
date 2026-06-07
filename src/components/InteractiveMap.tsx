import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report, CategoryType } from '../types';
import { MapPin, Search, Mic, SlidersHorizontal, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';

interface InteractiveMapProps {
  reports: Report[];
  selectedCategory: string;
  onSelectReport: (report: Report) => void;
  onAddNewReportClick: () => void;
  onMapLocationSelect?: (lat: number, lng: number, address: string) => void;
  isSelectingLocation?: boolean;
}

export default function InteractiveMap({
  reports,
  selectedCategory,
  onSelectReport,
  onAddNewReportClick,
  onMapLocationSelect,
  isSelectingLocation = false
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Colors based on Status Chip style guide
  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'lost': return '#F06543'; // status-lost
      case 'spotted': return '#FFB800'; // status-spotted
      case 'stray': return '#59B3EF'; // status-stray
      case 'danger': return '#D92D20'; // status-danger
      default: return '#006493';
    }
  };

  const getCategoryIconHtml = (category: CategoryType) => {
    switch (category) {
      case 'lost': return '⚠️';
      case 'spotted': return '👁️';
      case 'stray': return '🐾';
      case 'danger': return '🚨';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Santiago, Chile initial coordinates
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      touchZoom: true
    }).setView([-33.4489, -70.6693], 13);

    // Standard high quality light map layer matching Mascosafe Soft UI
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Zoom controls at top right instead of bottom
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Force map size refresh representing iFrame layout adjustments
    setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Set up Map click handler for selecting a location on report form mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      if (!isSelectingLocation || !onMapLocationSelect) return;
      const { lat, lng } = e.latlng;
      
      // Basic reverse geocoding message
      const randomStreets = [
        'Av. Providencia 1420',
        'Av. Irarrázaval 3550',
        'Paseo Ahumada 240',
        'Av. Vitacura 5200',
        'Av. Apoquindo 4800',
        'Parque Forestal'
      ];
      const mockAddress = randomStreets[Math.floor(Math.random() * randomStreets.length)] + `, Santiago`;
      onMapLocationSelect(lat, lng, mockAddress);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isSelectingLocation, onMapLocationSelect]);

  // Update Markers based on reports list and dynamic filters
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Filter reports according to selected categories
    const filteredReports = reports.filter(report => {
      if (selectedCategory === 'all') return true;
      return report.category === selectedCategory;
    });

    filteredReports.forEach(report => {
      const color = getCategoryColor(report.category);
      const iconBadgeHtml = getCategoryIconHtml(report.category);

      // Create beautiful custom Circular Avatar Pin Icon
      const pinHtml = `
        <div class="relative w-12 h-12 flex items-center justify-center">
          <!-- Outer Ping Glow for Lost Pets -->
          ${report.category === 'lost' ? `<div class="absolute inset-0 bg-[${color}] rounded-full animate-ping opacity-25 scale-110"></div>` : ''}
          
          <!-- Outer colored border tail -->
          <div class="w-11 h-11 rounded-full bg-white border-[3px] shadow-md flex items-center justify-center relative z-10 transition-transform active:scale-95" style="border-color: ${color};">
            ${
              report.image
                ? `<img src="${report.image}" class="w-full h-full rounded-full object-cover p-0.5" />`
                : `<div class="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-lg">${iconBadgeHtml}</div>`
            }
            
            <!-- Category Alert badge overlay -->
            <div class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm border-2 border-white" style="background-color: ${color};">
              ${iconBadgeHtml}
            </div>
          </div>
          <!-- Tiny Map Pin Tail -->
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]" style="border-t-color: ${color}; z-index: 9;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-map-pin-div',
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      const marker = L.marker([report.lat, report.lng], { icon: customIcon });

      // Click callback
      marker.on('click', () => {
        onSelectReport(report);
      });

      markersLayer.addLayer(marker);
    });

    // Also add current User Location marker
    const userLocationHtml = `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="w-4 h-4 bg-[#006493] rounded-full border-4 border-white shadow-md relative z-10"></div>
        <div class="absolute inset-0 bg-[#006493] rounded-full animate-ping opacity-30 z-0 scale-150"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userLocationHtml,
      className: 'user-location-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Draw user resting marker at Santiago center
    const userMarker = L.marker([-33.4489, -70.6693], { icon: userIcon });
    markersLayer.addLayer(userMarker);

  }, [reports, selectedCategory, onSelectReport]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map Element */}
      <div id="leaflet-map-canvas" ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Instructions for Selecting Location */}
      {isSelectingLocation && (
        <div className="absolute top-20 left-12 right-12 bg-primary text-white text-center text-xs font-semibold py-2.5 px-4 rounded-full shadow-lg z-20 animate-bounce">
          📍 Toca cualquier parte del mapa para marcar la ubicación del reporte
        </div>
      )}

      {/* Mic Action Alert (Feedback helper) */}
      <div className="absolute bottom-28 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={onAddNewReportClick}
          className="bg-primary hover:bg-[#004b70] text-white p-3 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all outline-none focus:ring-2 focus:ring-primary-container pointer-events-auto"
          title="Ver ubicación actual"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
