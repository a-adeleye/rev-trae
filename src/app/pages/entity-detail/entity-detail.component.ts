import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Entity, Review, ReviewResponse } from '@/types/models';
import { DataService } from '@/services/data.service';
import { AuthService } from '@/services/auth.service';

interface ReviewWithResponse extends Review {
  response?: ReviewResponse;
}

@Component({
  selector: 'app-entity-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="entity-detail-container" *ngIf="entity$ | async as entity">
      <!-- Header -->
      <div class="entity-header">
        <div class="container">
          <div class="header-content">
            <div class="breadcrumb">
              <a routerLink="/entities" class="breadcrumb-link">Explore</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">{{ entity.name }}</span>
            </div>
            
            <div class="entity-info">
              <div class="entity-main">
                <span class="entity-type-badge">{{ entity.type }}</span>
                <h1 class="entity-title">{{ entity.name }}</h1>
                <p class="entity-description">{{ entity.description }}</p>
              </div>
              
              <div class="entity-stats">
                <div class="rating-summary">
                  <div class="rating-display">
                    <div class="rating-stars">
                      <span *ngFor="let star of getStars(entity.ratingAverage)" class="star">★</span>
                    </div>
                    <span class="rating-number">{{ entity.ratingAverage.toFixed(1) }}</span>
                  </div>
                  <p class="rating-count">{{ entity.ratingCount }} reviews</p>
                </div>
                
                <div class="entity-actions">
                  <button class="btn btn-primary" routerLink="/write-review" [queryParams]="{ entity: entity.id }">
                    Write a Review
                  </button>
                  
                  <!-- Claim Entity Button -->
                  <button 
                    *ngIf="!isOwner && authService.isLoggedIn"
                    class="btn btn-outline" 
                    (click)="showClaimModal = true"
                  >
                    Is this your {{ entity.type }}?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <div class="container">
          <div class="reviews-header">
            <h2 class="reviews-title">Reviews</h2>
            <div class="reviews-filters">
              <select class="filter-select" [(ngModel)]="reviewFilter" (change)="onReviewFilterChange()">
                <option value="all">All Reviews</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              
              <select class="sort-select" [(ngModel)]="reviewSort" (change)="onReviewSortChange()">
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          <!-- Reviews List -->
          <div class="reviews-list">
            <div class="review-card" *ngFor="let review of reviewsWithResponses$ | async">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">{{ getInitials(review.userId) }}</div>
                  <div class="reviewer-details">
                    <h4 class="reviewer-name">{{ getUserName(review.userId) }}</h4>
                    <p class="review-date">{{ formatDate(review.createdAt) }}</p>
                  </div>
                </div>
                
                <div class="review-rating">
                  <div class="rating-stars">
                    <span *ngFor="let star of getStars(review.rating)" class="star">★</span>
                  </div>
                </div>
              </div>
              
              <div class="review-content">
                <h3 class="review-title" *ngIf="review.title">{{ review.title }}</h3>
                <p class="review-body">{{ review.body }}</p>
              </div>
              
              <div class="review-actions">
                <button class="btn btn-text" (click)="markHelpful(review.id)">
                  👍 Helpful ({{ review.likesCount }})
                </button>
                <button class="btn btn-text" (click)="markNotHelpful(review.id)">
                  👎 Not Helpful ({{ review.dislikesCount }})
                </button>
                <button class="btn btn-text" (click)="flagReview(review.id)">
                  🚩 Flag
                </button>
              </div>
              
              <!-- Owner Response -->
              <div class="owner-response" *ngIf="review.response">
                <div class="response-header">
                  <span class="response-label">Owner Response</span>
                  <span class="response-date">{{ formatDate(review.response.createdAt) }}</span>
                </div>
                <p class="response-body">{{ review.response.body }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="(reviewsWithResponses$ | async)?.length === 0">
            <div class="empty-state-icon">💬</div>
            <h3 class="empty-state-title">No reviews yet</h3>
            <p class="empty-state-description">
              Be the first to share your experience with {{ entity.name }}.
            </p>
            <button class="btn btn-primary" routerLink="/write-review" [queryParams]="{ entity: entity.id }">
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Claim Modal -->
    <div class="modal-overlay" *ngIf="showClaimModal" (click)="showClaimModal = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Claim {{ entity.name }}</h3>
          <button class="modal-close" (click)="showClaimModal = false">×</button>
        </div>
        
        <form class="claim-form" (ngSubmit)="submitClaim()">
          <div class="form-group">
            <label class="form-label">Your Message</label>
            <textarea
              class="form-textarea"
              [(ngModel)]="claimMessage"
              name="message"
              rows="4"
              placeholder="Tell us about your connection to this {{ entity.type }}..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Website (optional)</label>
            <input
              type="url"
              class="form-input"
              [(ngModel)]="claimWebsite"
              name="website"
              placeholder="https://..."
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Company Email (optional)</label>
            <input
              type="email"
              class="form-input"
              [(ngModel)]="claimEmail"
              name="email"
              placeholder="your@company.com"
            />
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="showClaimModal = false">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!claimMessage.trim()">
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .entity-detail-container {
      min-height: 100vh;
    }

    .entity-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 0;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-size: 0.875rem;
    }

    .breadcrumb-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      color: white;
    }

    .breadcrumb-separator {
      color: rgba(255, 255, 255, 0.6);
    }

    .breadcrumb-current {
      color: white;
      font-weight: 500;
    }

    .entity-info {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 3rem;
      align-items: start;
    }

    .entity-main {
      max-width: 600px;
    }

    .entity-type-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .entity-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .entity-description {
      font-size: 1.125rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .entity-stats {
      text-align: center;
    }

    .rating-summary {
      margin-bottom: 2rem;
    }

    .rating-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .rating-stars {
      display: flex;
    }

    .star {
      color: #fbbf24;
      font-size: 1.5rem;
    }

    .rating-number {
      font-size: 2rem;
      font-weight: 700;
    }

    .rating-count {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .entity-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .reviews-section {
      padding: 3rem 0;
      background: var(--surface-color);
    }

    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .reviews-title {
      font-size: 1.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .reviews-filters {
      display: flex;
      gap: 1rem;
    }

    .filter-select,
    .sort-select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background: white;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .review-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .reviewer-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .reviewer-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .review-date {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .review-content {
      margin-bottom: 1rem;
    }

    .review-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .review-body {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .review-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: all 0.2s;
    }

    .btn-text:hover {
      background: var(--surface-color);
      color: var(--text-primary);
    }

    .owner-response {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 1rem;
    }

    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .response-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #0369a1;
      text-transform: uppercase;
    }

    .response-date {
      font-size: 0.75rem;
      color: #64748b;
    }

    .response-body {
      color: #1e40af;
      line-height: 1.5;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .empty-state-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-secondary);
    }

    .claim-form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .entity-info {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .entity-stats {
        text-align: left;
      }

      .reviews-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .reviews-filters {
        flex-direction: column;
        gap: 0.5rem;
      }

      .review-actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class EntityDetailComponent implements OnInit {
  entity$: Observable<Entity | undefined>;
  reviewsWithResponses$: Observable<ReviewWithResponse[]>;
  isOwner = false;
  showClaimModal = false;
  
  reviewFilter = 'all';
  reviewSort = 'recent';
  
  claimMessage = '';
  claimWebsite = '';
  claimEmail = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    public authService: AuthService,
    private router: Router
  ) {
    this.entity$ = this.route.params.pipe(
      switchMap(params => this.dataService.getEntityById(params['id']))
    );

    this.reviewsWithResponses$ = combineLatest([
      this.entity$,
      this.dataService.reviews$,
      this.dataService.reviewResponses$
    ]).pipe(
      map(([entity, reviews, responses]) => {
        if (!entity) return [];
        
        const entityReviews = reviews.filter(review => 
          review.entityId === entity.id && review.status === 'published'
        );
        
        return entityReviews.map(review => ({
          ...review,
          response: responses.find(response => 
            response.reviewId === review.id && response.status === 'published'
          )
        }));
      })
    );
  }

  ngOnInit(): void {
    // Check if current user is owner of this entity
    this.entity$.subscribe(entity => {
      if (entity && this.authService.currentUser) {
        // This would be implemented with proper ownership check in Phase 2
        this.isOwner = false; // Mock for now
      }
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    
    return stars;
  }

  getInitials(userId: string): string {
    // Mock implementation - would get from user service
    return userId.charAt(0).toUpperCase();
  }

  getUserName(userId: string): string {
    // Mock implementation - would get from user service
    return `User ${userId.slice(-1)}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  onReviewFilterChange(): void {
    // Implement review filtering
  }

  onReviewSortChange(): void {
    // Implement review sorting
  }

  markHelpful(reviewId: string): void {
    // Implement helpful marking
    console.log('Marked review as helpful:', reviewId);
  }

  markNotHelpful(reviewId: string): void {
    // Implement not helpful marking
    console.log('Marked review as not helpful:', reviewId);
  }

  flagReview(reviewId: string): void {
    // Implement review flagging
    console.log('Flagged review:', reviewId);
  }

  submitClaim(): void {
    // Mock claim submission for Phase 1
    console.log('Claim submitted:', {
      message: this.claimMessage,
      website: this.claimWebsite,
      email: this.claimEmail
    });
    
    this.showClaimModal = false;
    this.claimMessage = '';
    this.claimWebsite = '';
    this.claimEmail = '';
    
    alert('Claim submitted successfully! You will be notified once your claim is reviewed.');
  }
}