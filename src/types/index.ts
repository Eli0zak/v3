export type PlanType = "basic" | "comfort" | "vip";

export type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "reptile" | "other";

export interface Animal {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  type: PetType;
  age: number;
  children_count: number;
  notes: string;
  created_at: string;
  scan_count: number;
  last_scanned_at: string | null;
  plan: PlanType;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: PlanType;
}

export interface PlanFeatures {
  maxPets: number;
  notifications: {
    email: boolean;
    whatsapp: boolean;
  };
  customPhoto: boolean;
  locationTracking: boolean;
  earlyAccess: boolean;
  unlimited: boolean;
}

export interface PlanInfo {
  name: string;
  description: string;
  price: number;
  color: string;
  features: PlanFeatures;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  color?: string;
  microchip_id?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  pet_id: string;
  tag_number: string;
  status: 'active' | 'inactive' | 'lost';
  created_at: string;
  updated_at: string;
}

export interface Scan {
  id: string;
  tag_id: string;
  scanned_by: string;
  location?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
