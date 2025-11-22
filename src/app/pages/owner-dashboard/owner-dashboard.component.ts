import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entity, Review, ReviewResponse } from '@/types/models';
import { DataService } from '@/services/data.service';
import { AuthService } from '@/services/auth.service';

interface EntityWithReviews extends Entity {
  reviews: Review[];
  recentReviews: Review[];
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="owner-dashboard" *ngIf="authService.currentUser as user">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="container">
          <h1 class="dashboard-title">Owner Dashboard</h1>
          <p class="dashboard-subtitle">Welcome back, {{ user.displayName }}</p>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🏢</div>
              <div class="stat-content">
                <div class="stat-number">{{ (ownedEntities$ | async)?.length || 0 }}</div>
                <div class="stat-label">Owned Entities</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-number">{{ averageRating$ | async }}</div>
                <div class="stat-label">Average Rating</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">💬</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalReviews$ | async }}</div>
                <div class="stat-label">Total Reviews</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-number">{{ pendingResponses$ | async }}</div>
                <div class="stat-label">Pending Responses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Entities List -->
      <div class="entities-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Your Entities</h2>
            <div class="view-toggles">
              <button 
                class="toggle-btn" 
                [class.active]="viewMode === 'grid'"
                (click)="setViewMode('grid')"
              >
                Grid
              </button>
              <button 
                class="toggle-btn" 
                [class.active]="viewMode === 'list'"
                (click)="setViewMode('list')"
              >
                List
              </button>
            </div>
          </div>

          <div class="entities-container" [class.grid-view]="viewMode === 'grid'">
            <div 
              class="entity-card" 
              *ngFor="let entity of ownedEntitiesWithReviews$ | async"
              [routerLink]="['/entities', entity.id]"
            >
              <div class="entity-header">
                <div class="entity-info">
                  <span class="entity-type">{{ entity.type }}</span>
                  <h3 class="entity-name">{{ entity.name }}</h3>
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
                    <span class="review-count">{{ entity.ratingCount }} reviews</span>
                  </div>
                </div>
              </div>

              <!-- Recent Reviews Preview -->
              <div class="recent-reviews" *ngIf="entity.recentReviews.length > 0">
                <h4 class="recent-reviews-title">Recent Reviews</h4>
                <div class="review-preview" *ngFor="let review of entity.recentReviews">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="reviewer-avatar">{{ getInitials(review.userId) }}</div>
                      <div class="reviewer-details">
                        <span class="reviewer-name">{{ getUserName(review.userId) }}</span>
                        <div class="review-rating">
                          <span *ngFor="let star of getStars(review.rating)" class="star">★</span>
                        </div>
                      </div>
                    </div>
                    <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                  </div>
                  <p class="review-preview-text">{{ review.body | slice:0:150 }}...</p>
                  
                  <!-- Response Actions -->
                  <div class="response-actions" *ngIf="!review.response">
                    <button class="btn btn-outline btn-sm" (click)="showResponseForm(review.id)">
                      Respond
                    </button>
                  </div>
                  
                  <!-- Owner Response -->
                  <div class="owner-response" *ngIf="review.response">
                    <div class="response-header">
                      <span class="response-label">Your Response</span>
                      <span class="response-date">{{ formatDate(review.response.createdAt) }}</span>
                    </div>
                    <p class="response-body">{{ review.response.body }}</p>
                    <div class="response-actions">
                      <button class="btn btn-text btn-sm" (click)="editResponse(review.response.id)">
                        Edit
                      </button>
                      <button class="btn btn-text btn-sm" (click)="hideResponse(review.response.id)">
                        Hide
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="entity-actions">
                <button class="btn btn-primary" [routerLink]="['/entities', entity.id]">
                  View All Reviews
                </button>
                <button class="btn btn-outline" (click)="viewAnalytics(entity.id)">
                  Analytics
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="(ownedEntities$ | async)?.length === 0">
            <div class="empty-state-icon">🏢</div>
            <h3 class="empty-state-title">No entities yet</h3>
            <p class="empty-state-description">
              You haven't claimed any entities yet. When you claim an entity and it's approved by an admin, it will appear here.
            </p>
            <button class="btn btn-primary" routerLink="/entities">
              Browse Entities
            </button>
          </div>
        </div>
      </div>

      <!-- Response Modal -->
      <div class="modal-overlay" *ngIf="showResponseModal" (click)="closeResponseModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Respond to Review</h3>
            <button class="modal-close" (click)="closeResponseModal()">×</button>
          </div>
          
          <form class="response-form" (ngSubmit)="submitResponse()">
            <div class="form-group">
              <label class="form-label">Your Response</label>
              <textarea
                class="form-textarea"
                rows="4"
                [(ngModel)]="responseText"
                name="responseText"
                placeholder="Write your response to this review..."
                required
              ></textarea>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeResponseModal()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!responseText.trim()">
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Not Authorized -->
    <div class="not-authorized" *ngIf="!authService.isLoggedIn">
      <div class="container">
        <div class="not-authorized-content">
          <div class="not-authorized-icon">🔒</div>
          <h2 class="not-authorized-title">Access Denied</h2>
          <p class="not-authorized-description">
            You need to be logged in as an owner to access this page.
          </p>
          <button class="btn btn-primary" routerLink="/login">
            Sign In
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .owner-dashboard {
      min-height: 100vh;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 0;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .dashboard-subtitle {
      font-size: 1.125rem;
      opacity: 0.9;
    }

    .stats-section {
      padding: 3rem 0;
      background: var(--surface-color);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-number {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .entities-section {
      padding: 3rem 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .view-toggles {
      display: flex;
      background: var(--surface-color);
      border-radius: 0.5rem;
      padding: 0.25rem;
    }

    .toggle-btn {
      background: none;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .toggle-btn.active {
      background: white;
      color: var(--primary-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .entities-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .entities-container.grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .entity-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .entity-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .entity-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .entity-info {
      flex: 1;
    }

    .entity-type {
      background: var(--surface-color);
      color: var(--text-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      display: inline-block;
    }

    .entity-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .entity-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .entity-stats {
      text-align: right;
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .rating-stars {
      display: flex;
    }

    .star {
      color: #fbbf24;
      font-size: 1rem;
    }

    .rating-number {
      font-weight: 600;
      color: var(--text-primary);
    }

    .review-count {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .recent-reviews {
      border-top: 1px solid var(--border-color);
      padding-top: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .recent-reviews-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .review-preview {
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .reviewer-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .reviewer-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .reviewer-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .review-rating {
      display: flex;
      gap: 0.125rem;
    }

    .review-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .review-preview-text {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .response-actions {
      display: flex;
      gap: 0.5rem;
    }

    .owner-response {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 0.5rem;
      padding: 0.75rem;
      margin-top: 0.75rem;
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

    .response-body {
      color: #1e40af;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 0.5rem;
    }

    .response-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-text.btn-sm,
    .btn-outline.btn-sm {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }

    .entity-actions {
      display: flex;
      gap: 1rem;
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
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

    .response-form {
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

    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      resize: vertical;
      min-height: 100px;
      transition: border-color 0.2s;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .not-authorized {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .not-authorized-content {
      text-align: center;
      max-width: 400px;
    }

    .not-authorized-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .not-authorized-title {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .not-authorized-description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .entities-container.grid-view {
        grid-template-columns: 1fr;
      }

      .entity-header {
        flex-direction: column;
        gap: 1rem;
      }

      .entity-stats {
        text-align: left;
      }

      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'list';
  showResponseModal = false;
  responseText = '';
  currentReviewId: string | null = null;

  ownedEntities$: Observable<Entity[]>;
  ownedEntitiesWithReviews$: Observable<EntityWithReviews[]>;
  averageRating$: Observable<string>;
  totalReviews$: Observable<number>;
  pendingResponses$: Observable<number>;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    // Mock implementation - would filter by actual ownership in Phase 2
    this.ownedEntities$ = this.dataService.getEntities().pipe(
      map(entities => entities.filter(entity => 
        entity.createdBy === 'user2' // Mock owner user
      ))
    );

    this.ownedEntitiesWithReviews$ = combineLatest([
      this.ownedEntities$,
      this.dataService.reviews$
    ]).pipe(
      map(([entities, reviews]) => {
        return entities.map(entity => {
          const entityReviews = reviews.filter(review => 
            review.entityId === entity.id && review.status === 'published'
          );
          
          return {
            ...entity,
            reviews: entityReviews,
            recentReviews: entityReviews.slice(0, 3) // Show 3 most recent
          };
        });
      })
    );

    this.averageRating$ = this.ownedEntitiesWithReviews$.pipe(
      map(entities => {
        if (entities.length === 0) return '0.0';
        const totalRating = entities.reduce((sum, entity) => sum + entity.ratingAverage, 0);
        return (totalRating / entities.length).toFixed(1);
      })
    );

    this.totalReviews$ = this.ownedEntitiesWithReviews$.pipe(
      map(entities => entities.reduce((sum, entity) => sum + entity.ratingCount, 0))
    );

    this.pendingResponses$ = combineLatest([
      this.ownedEntitiesWithReviews$,
      this.dataService.reviewResponses$
    ]).pipe(
      map(([entities, responses]) => {
        const entityIds = entities.map(e => e.id);
        const reviewsWithoutResponses = entities.reduce((count, entity) => {
          return count + entity.reviews.filter(review => 
            !responses.some(response => response.reviewId === review.id)
          ).length;
        }, 0);
        return reviewsWithoutResponses;
      })
    );
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is owner
    if (!this.authService.isOwner()) {
      // Redirect to home if not owner
      this.router.navigate(['/']);
      return;
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
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
    // Mock implementation
    return userId.charAt(0).toUpperCase();
  }

  getUserName(userId: string): string {
    // Mock implementation
    return `User ${userId.slice(-1)}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  showResponseForm(reviewId: string): void {
    this.currentReviewId = reviewId;
    this.showResponseModal = true;
    this.responseText = '';
  }

  closeResponseModal(): void {
    this.showResponseModal = false;
    this.currentReviewId = null;
    this.responseText = '';
  }

  submitResponse(): void {
    if (!this.responseText.trim() || !this.currentReviewId || !this.authService.currentUser) {
      return;
    }

    this.dataService.createReviewResponse({
      reviewId: this.currentReviewId,
      ownerId: this.authService.currentUser.id,
      ownerDisplayName: this.authService.currentUser.displayName,
      body: this.responseText.trim()
    }).subscribe(() => {
      this.closeResponseModal();
    });
  }

  editResponse(responseId: string): void {
    // Mock implementation
    console.log('Edit response:', responseId);
  }

  hideResponse(responseId: string): void {
    // Mock implementation - would update status to hidden
    console.log('Hide response:', responseId);
  }

  viewAnalytics(entityId: string): void {
    // Mock implementation
    console.log('View analytics for entity:', entityId);
  }
}
