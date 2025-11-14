2.1. Top-Level Collections

All Firestore collections are top-level (preferred where applicable):

users

users/{userId} = {
  displayName: string,
  email: string,
  role: "regular" | "owner" | "admin",
  createdAt: Timestamp
}


entities

entities/{entityId} = {
  type: "brand" | "product" | "movie" | "music",
  name: string,
  slug: string,
  description?: string,
  createdBy: string,          // userId
  status: "active" | "pending_verification" | "hidden",

  ratingCount: number,
  ratingSum: number,
  ratingAverage: number,
  lastReviewAt?: Timestamp,

  metadata: {
    brandId?: string,         // entityId of brand
    releaseYear?: number,
    director?: string,
    artist?: string,
    sku?: string,
    // flexible extension
  },

  createdAt: Timestamp,
  updatedAt: Timestamp
}


reviews

reviews/{reviewId} = {
  entityId: string,
  userId: string,
  rating: number,       // 1–5
  title?: string,
  body: string,
  status: "published" | "pending" | "flagged" | "deleted",
  likesCount: number,
  dislikesCount: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}


reviewResponses

reviewResponses/{responseId} = {
  reviewId: string,
  entityId: string,
  ownerUserId: string,
  body: string,
  status: "published" | "hidden",
  createdAt: Timestamp,
  updatedAt: Timestamp
}


entityOwners

entityOwners/{entityOwnerId} = {
  entityId: string,
  userId: string,
  role: "owner" | "manager",
  createdAt: Timestamp
}


ownershipClaims

ownershipClaims/{claimId} = {
  entityId: string,
  userId: string,
  status: "pending" | "approved" | "rejected",
  message?: string,
  evidence: {
    website?: string,
    companyEmail?: string
  },
  createdAt: Timestamp,
  resolvedAt?: Timestamp
}


flags (optional)

flags/{flagId} = {
  targetType: "review" | "response",
  targetId: string,
  reportedBy: string,
  reason: string,
  status: "open" | "reviewed" | "dismissed",
  createdAt: Timestamp
}