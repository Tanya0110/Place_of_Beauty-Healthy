
export interface ServiceItem {
  id: string;
  title: string;
  price: string;
  description: string;
  duration: string;
  iconName: string;
}

export interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  isBookingRequest?: boolean;
  bookingData?: BookingDetails;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingDetails {
  id: number;
  name: string;
  service: string;
  date: string; // Format: YYYY-MM-DD
  time: string;
  phone: string;
  status: BookingStatus;
  created_at: string;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // Markdown supported
  image: string;
  isOriginal?: boolean; // If true, display full image without crop
  imageScale?: number; // Zoom level
  imageOffset?: { x: number; y: number }; // Pan position
  imageRotation?: number; // Rotation in degrees
  aspectRatio?: number; // Numeric aspect ratio (width / height). Default 1.77 (16:9)
  date: string;
  author: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

export interface GalleryItem {
  id: number;
  src: string;
  category: string;
  imageScale?: number;
  imageOffset?: { x: number; y: number };
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide';
}

export interface Certificate {
  id: string;
  recipientName: string;
  phone: string;
  email: string;
  service: string;
  startDate: string;
  issueDate: string;
  issueTime: string;
  expiryDate: string;
  code: string;
  styleId: number;
}

export enum ViewState {
  HOME = 'HOME',
  BOOKING = 'BOOKING'
}
