export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  role: 'member' | 'facilitator' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  plan?: SubscriptionPlan;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  specialty: string;
  created_at: string;
}

export type ContentCategory = 'meditation' | 'yoga' | 'pilates' | 'online_sessie';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MediaType = 'audio' | 'video';

export interface Content {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  thumbnail_url: string;
  media_url: string;
  media_type: MediaType;
  duration_minutes: number;
  difficulty: Difficulty;
  instructor_id: string;
  is_premium: boolean;
  is_featured: boolean;
  tags: string[];
  sort_order: number;
  created_at: string;
  instructor?: Instructor;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  created_at: string;
  items?: Content[];
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title: string;
  body: string;
  image_url: string;
  created_at: string;
  author?: Profile;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
  content?: Content;
}

export interface UserProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_seconds: number;
  completed: boolean;
  last_played_at: string;
  created_at: string;
  content?: Content;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author_id: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  sort_order: number;
  author?: Profile;
}
