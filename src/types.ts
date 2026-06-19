export type CategoryType = 'lost' | 'spotted' | 'stray' | 'danger';

export interface Report {
  id: string;
  category: CategoryType;
  petName?: string;
  breed?: string;
  gender?: 'macho' | 'hembra' | 'desconocido';
  size?: 'pequeño' | 'mediano' | 'grande';
  color?: string;
  description: string;
  image: string;
  date: string;
  timeAgo: string;
  locationName: string;
  lat: number;
  lng: number;
  reporterName: string;
  reporterAvatar: string;
  reporterPhone: string;
  isVerifiedUser?: boolean;
  views?: number;
  status: 'activo' | 'resuelto';
}

export type ViewType = 'auth' | 'map' | 'report_form' | 'report_detail' | 'notifications' | 'register' | 'profile' | 'qr_scanner';
