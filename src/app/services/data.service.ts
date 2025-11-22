import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Entity,
  Review,
  ReviewResponse,
  OwnershipClaim,
  Flag,
  SearchFilters
} from '../mock';
import {
  mockEntities,
  mockReviews,
  mockReviewResponses,
  mockOwnershipClaims,
  mockFlags,
  getEntityById,
  getReviewsByEntity,
  getReviewsByUser,
  getResponseByReviewId,
  getEntityOwners,
  isEntityOwner,
  createReviewResponse as createResponse,
  createOwnershipClaim as createClaim,
  createFlag as createNewFlag,
  incrementHelpfulCount,
  searchEntities,
  getTopRatedEntities,
  getMostReviewedEntities,
  getRecentReviews,
  getPendingClaims,
  getPendingFlags,
  approveClaim,
  rejectClaim,
  resolveFlag,
  dismissFlag
} from '../mock';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private entitiesSubject = new BehaviorSubject<Entity[]>(mockEntities);
  private reviewsSubject = new BehaviorSubject<Review[]>(mockReviews);
  private reviewResponsesSubject = new BehaviorSubject<ReviewResponse[]>(mockReviewResponses);
  private claimsSubject = new BehaviorSubject<OwnershipClaim[]>(mockOwnershipClaims);
  private flagsSubject = new BehaviorSubject<Flag[]>(mockFlags);

  entities$ = this.entitiesSubject.asObservable();
  reviews$ = this.reviewsSubject.asObservable();
  reviewResponses$ = this.reviewResponsesSubject.asObservable();
  claims$ = this.claimsSubject.asObservable();
  flags$ = this.flagsSubject.asObservable();

  // Entity methods
  getEntities(filters?: SearchFilters): Observable<Entity[]> {
    let entities = [...this.entitiesSubject.value];

    if (filters?.category && filters.category !== 'all') {
      entities = entities.filter(entity => 
        entity.category === filters.category || entity.type === filters.category
      );
    }

    if (filters?.minRating) {
      entities = entities.filter(entity => entity.ratingAverage >= filters.minRating!);
    }

    // Sorting
    if (filters?.sortBy) {
      entities.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'rating':
            aValue = a.ratingAverage;
            bValue = b.ratingAverage;
            break;
          case 'newest':
            aValue = a.createdAt.getTime();
            bValue = b.createdAt.getTime();
            break;
          case 'most-reviewed':
            aValue = a.ratingCount;
            bValue = b.ratingCount;
            break;
          default:
            return 0;
        }

        const order = filters.sortOrder === 'desc' ? -1 : 1;
        if (aValue < bValue) return -1 * order;
        if (aValue > bValue) return 1 * order;
        return 0;
      });
    }

    return of(entities).pipe(delay(300));
  }

  getEntity(id: string): Observable<Entity | undefined> {
    const entity = getEntityById(id);
    return of(entity).pipe(delay(200));
  }

  getEntityById(id: string): Observable<Entity | undefined> {
    return this.getEntity(id);
  }

  searchEntities(query: string, category?: string): Observable<Entity[]> {
    const results = searchEntities(query, category);
    return of(results).pipe(delay(400));
  }

  getTopRatedEntities(limit: number = 6): Observable<Entity[]> {
    const entities = getTopRatedEntities(limit);
    return of(entities).pipe(delay(250));
  }

  getMostReviewedEntities(limit: number = 6): Observable<Entity[]> {
    const entities = getMostReviewedEntities(limit);
    return of(entities).pipe(delay(250));
  }

  createEntity(entityData: {
    type: Entity['type'];
    name: string;
    slug?: string;
    description?: string;
    createdBy?: string;
    status?: string;
    metadata?: Record<string, unknown>;
  }): Observable<Entity> {
    const now = new Date();
    const newEntity: Entity = {
      id: `entity-${Date.now()}`,
      name: entityData.name,
      description: entityData.description || '',
      type: entityData.type,
      category: entityData.type,
      slug: entityData.slug,
      createdBy: entityData.createdBy,
      status: entityData.status || 'active',
      metadata: entityData.metadata || {},
      ratingAverage: 0,
      ratingCount: 0,
      createdAt: now,
      updatedAt: now
    };

    const current = this.entitiesSubject.value;
    this.entitiesSubject.next([...current, newEntity]);
    return of(newEntity).pipe(delay(300));
  }

  // Review methods
  getReviews(entityId: string): Observable<Review[]> {
    const reviews = getReviewsByEntity(entityId);
    return of(reviews).pipe(delay(300));
  }

  getUserReviews(userId: string): Observable<Review[]> {
    const reviews = getReviewsByUser(userId);
    return of(reviews).pipe(delay(200));
  }

  getRecentReviews(limit: number = 10): Observable<Review[]> {
    const reviews = getRecentReviews(limit);
    return of(reviews).pipe(delay(200));
  }

  createReview(reviewData: {
    entityId: string;
    userId: string;
    userDisplayName?: string;
    rating: number;
    title?: string;
    body: string;
    pros?: string[];
    cons?: string[];
    wouldRecommend?: boolean;
  }): Observable<Review> {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      entityId: reviewData.entityId,
      userId: reviewData.userId,
      userDisplayName: reviewData.userDisplayName || 'Anonymous',
      rating: reviewData.rating,
      title: reviewData.title,
      body: reviewData.body,
      pros: reviewData.pros,
      cons: reviewData.cons,
      wouldRecommend: reviewData.wouldRecommend,
      verified: false, // New reviews are not verified by default
      likesCount: 0,
      dislikesCount: 0,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentReviews = this.reviewsSubject.value;
    this.reviewsSubject.next([...currentReviews, newReview]);

    // Update entity review count and average rating
    this.updateEntityReviewStats(reviewData.entityId);

    return of(newReview).pipe(delay(500));
  }

  markReviewHelpful(reviewId: string): Observable<void> {
    incrementHelpfulCount(reviewId);
    
    // Update the subject
    const currentReviews = this.reviewsSubject.value;
    const review = currentReviews.find(r => r.id === reviewId);
    if (review) {
      review.likesCount += 1;
      this.reviewsSubject.next([...currentReviews]);
    }

    return of(undefined).pipe(delay(200));
  }

  // Review Response methods
  getReviewResponse(reviewId: string): Observable<ReviewResponse | undefined> {
    const response = getResponseByReviewId(reviewId);
    return of(response).pipe(delay(200));
  }

  createReviewResponse(responseData: { reviewId: string; ownerId: string; ownerDisplayName: string; body: string }): Observable<ReviewResponse> {
    const newResponse = createResponse(
      responseData.reviewId,
      responseData.ownerId,
      responseData.ownerDisplayName,
      responseData.body
    );
    
    const currentResponses = this.reviewResponsesSubject.value;
    this.reviewResponsesSubject.next([...currentResponses, newResponse]);

    return of(newResponse).pipe(delay(400));
  }

  // Entity Owner methods
  getEntityOwners(entityId: string): Observable<Entity[]> {
    // This would normally fetch owner data, but for mock we'll return empty
    return of([]).pipe(delay(200));
  }

  isEntityOwner(entityId: string, userId: string): Observable<boolean> {
    const isOwner = isEntityOwner(entityId, userId);
    return of(isOwner).pipe(delay(150));
  }

  // Ownership Claim methods
  createOwnershipClaim(entityId: string, entityName: string, userId: string, userDisplayName: string, userEmail: string, proof: string): Observable<OwnershipClaim> {
    const newClaim = createClaim(entityId, entityName, userId, userDisplayName, userEmail, proof);
    
    const currentClaims = this.claimsSubject.value;
    this.claimsSubject.next([...currentClaims, newClaim]);

    return of(newClaim).pipe(delay(500));
  }

  getUserClaims(userId: string): Observable<OwnershipClaim[]> {
    const claims = this.claimsSubject.value.filter(claim => claim.userId === userId);
    return of(claims).pipe(delay(200));
  }

  getPendingClaims(): Observable<OwnershipClaim[]> {
    const claims = getPendingClaims();
    return of(claims).pipe(delay(200));
  }

  approveClaim(claimId: string, reviewedBy: string): Observable<void> {
    approveClaim(claimId, reviewedBy);
    
    // Update the subject
    const currentClaims = this.claimsSubject.value;
    const claim = currentClaims.find(c => c.id === claimId);
    if (claim) {
      claim.status = 'approved';
      claim.reviewedBy = reviewedBy;
      claim.reviewedAt = new Date();
      claim.updatedAt = new Date();
      this.claimsSubject.next([...currentClaims]);
    }

    return of(undefined).pipe(delay(300));
  }

  rejectClaim(claimId: string, reviewedBy: string, rejectionReason: string): Observable<void> {
    rejectClaim(claimId, reviewedBy, rejectionReason);
    
    // Update the subject
    const currentClaims = this.claimsSubject.value;
    const claim = currentClaims.find(c => c.id === claimId);
    if (claim) {
      claim.status = 'rejected';
      claim.reviewedBy = reviewedBy;
      claim.reviewedAt = new Date();
      claim.rejectionReason = rejectionReason;
      claim.updatedAt = new Date();
      this.claimsSubject.next([...currentClaims]);
    }

    return of(undefined).pipe(delay(300));
  }

  // Flag methods
  createFlag(reviewId: string, entityId: string, userId: string, userDisplayName: string, reason: Flag['reason'], description: string): Observable<Flag> {
    const newFlag = createNewFlag(reviewId, entityId, userId, userDisplayName, reason, description);
    
    const currentFlags = this.flagsSubject.value;
    this.flagsSubject.next([...currentFlags, newFlag]);

    return of(newFlag).pipe(delay(400));
  }

  getPendingFlags(): Observable<Flag[]> {
    const flags = getPendingFlags();
    return of(flags).pipe(delay(200));
  }

  resolveFlag(flagId: string, resolvedBy: string): Observable<void> {
    resolveFlag(flagId, resolvedBy);
    
    // Update the subject
    const currentFlags = this.flagsSubject.value;
    const flag = currentFlags.find(f => f.id === flagId);
    if (flag) {
      flag.status = 'resolved';
      flag.resolvedBy = resolvedBy;
      flag.resolvedAt = new Date();
      this.flagsSubject.next([...currentFlags]);
    }

    return of(undefined).pipe(delay(300));
  }

  dismissFlag(flagId: string, resolvedBy: string): Observable<void> {
    dismissFlag(flagId, resolvedBy);
    
    // Update the subject
    const currentFlags = this.flagsSubject.value;
    const flag = currentFlags.find(f => f.id === flagId);
    if (flag) {
      flag.status = 'dismissed';
      flag.resolvedBy = resolvedBy;
      flag.resolvedAt = new Date();
      this.flagsSubject.next([...currentFlags]);
    }

    return of(undefined).pipe(delay(300));
  }

  // Private helper methods
  private updateEntityReviewStats(entityId: string): void {
    const reviews = getReviewsByEntity(entityId);
    const entity = getEntityById(entityId);
    
    if (entity) {
      entity.ratingCount = reviews.length;
      entity.ratingAverage = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      entity.lastReviewAt = reviews.length ? reviews[0].createdAt : undefined;
      entity.updatedAt = new Date();
      
      // Update the entities subject
      const currentEntities = this.entitiesSubject.value;
      const entityIndex = currentEntities.findIndex(e => e.id === entityId);
      if (entityIndex !== -1) {
        currentEntities[entityIndex] = { ...entity };
        this.entitiesSubject.next([...currentEntities]);
      }
    }
  }
}
