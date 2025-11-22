export type EntityType = 'brand' | 'product' | 'movie' | 'music';

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'regular' | 'owner' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  type: EntityType;
  category?: EntityType; // legacy alias
  imageUrl?: string;
  website?: string;
  ratingAverage: number;
  ratingCount: number;
  ratingSum?: number;
  createdBy?: string;
  slug?: string;
  status?: string;
  lastReviewAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  entityId: string;
  userId: string;
  userDisplayName: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend?: boolean;
  verified?: boolean;
  likesCount: number;
  dislikesCount: number;
  status: 'published' | 'hidden' | 'flagged';
  response?: ReviewResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  ownerId: string;
  ownerDisplayName: string;
  body: string;
  status: 'published' | 'hidden' | 'flagged';
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityOwner {
  id: string;
  entityId: string;
  userId: string;
  userDisplayName: string;
  createdAt: Date;
}

export interface OwnershipClaim {
  id: string;
  entityId: string;
  entityName: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  proof?: string; // Description of proof provided
  message?: string;
  evidence?: {
    website?: string;
    companyEmail?: string;
  };
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flag {
  id: string;
  reviewId: string;
  entityId: string;
  userId: string;
  userDisplayName: string;
  reason: 'inappropriate' | 'spam' | 'fake' | 'other';
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

// Search and filter types
export interface SearchFilters {
  category?: string;
  minRating?: number;
  sortBy?: 'name' | 'rating' | 'newest' | 'most-reviewed';
  sortOrder?: 'asc' | 'desc';
}

// Form data types
export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
}

export interface ClaimFormData {
  proof: string;
}

export interface FlagFormData {
  reason: 'inappropriate' | 'spam' | 'fake' | 'other';
  description: string;
}

// Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// User role type guard
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isOwner(user: User | null): boolean {
  return user?.role === 'owner' || user?.role === 'admin';
}

export function isRegularUser(user: User | null): boolean {
  return user?.role === 'regular' || user?.role === 'owner' || user?.role === 'admin';
}
