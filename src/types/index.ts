export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  avatar?: string;
  joinDate: string;
  rating: number;
  reviewCount: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: 'tools' | 'appliances' | 'skills' | 'services' | 'others';
  type: 'rent' | 'borrow' | 'hire';
  price: number;
  deposit?: number;
  priceUnit: 'hour' | 'day' | 'week' | 'month' | 'job';
  images: string[];
  owner: User;
  district: string;
  address: string;
  available: boolean;
  condition?: 'new' | 'like-new' | 'good' | 'fair';
  postedDate: string;
  views: number;
  rating?: number;
  reviewCount?: number;
}

export interface Message {
  id: string;
  from: User;
  to: User;
  item?: Item;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export type District = 
  | 'Kuala Lumpur'
  | 'Petaling Jaya'
  | 'Shah Alam'
  | 'Subang Jaya'
  | 'Klang'
  | 'Johor Bahru'
  | 'Penang'
  | 'Ipoh'
  | 'Kota Kinabalu'
  | 'Kuching';
