export interface UploadProgress {
  isUploading: boolean;
  progress: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: 'center' | 'user';
  title: string;
  description?: string;
}
