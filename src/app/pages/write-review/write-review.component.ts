import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Entity } from '@/types/models';
import { DataService } from '@/services/data.service';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-write-review',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="write-review-container">
      <div class="container">
        <!-- Progress Steps -->
        <div class="progress-steps" *ngIf="!selectedEntity">
          <div class="step" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
            <div class="step-number">1</div>
            <div class="step-label">Choose Entity</div>
          </div>
          <div class="step" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
            <div class="step-number">2</div>
            <div class="step-label">Write Review</div>
          </div>
          <div class="step" [class.active]="currentStep === 3">
            <div class="step-number">3</div>
            <div class="step-label">Confirm</div>
          </div>
        </div>

        <!-- Step 1: Choose Entity -->
        <div class="step-content" *ngIf="currentStep === 1 && !selectedEntity">
          <div class="step-header">
            <h1 class="step-title">Choose what to review</h1>
            <p class="step-description">Search for an existing entity or create a new one</p>
          </div>

          <!-- Search Existing -->
          <div class="search-section">
            <h3 class="section-title">Search existing {{ selectedType }}</h3>
            <div class="search-bar">
              <input
                type="text"
                class="search-input"
                placeholder="Search..."
                [(ngModel)]="searchQuery"
                (input)="onSearchChange()"
              />
              <button class="search-btn" (click)="search()">
                <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>

            <!-- Type Filter -->
            <div class="type-filters">
              <button
                class="filter-btn"
                [class.active]="selectedType === 'brand'"
                (click)="selectType('brand')"
              >
                Brand
              </button>
              <button
                class="filter-btn"
                [class.active]="selectedType === 'product'"
                (click)="selectType('product')"
              >
                Product
              </button>
              <button
                class="filter-btn"
                [class.active]="selectedType === 'movie'"
                (click)="selectType('movie')"
              >
                Movie
              </button>
              <button
                class="filter-btn"
                [class.active]="selectedType === 'music'"
                (click)="selectType('music')"
              >
                Music
              </button>
            </div>

            <!-- Search Results -->
            <div class="search-results" *ngIf="searchResults$ | async as results">
              <div class="result-item" *ngFor="let entity of results">
                <div class="result-info">
                  <h4 class="result-name">{{ entity.name }}</h4>
                  <p class="result-description">{{ entity.description }}</p>
                  <div class="result-rating">
                    <div class="rating-stars">
                      <span *ngFor="let star of getStars(entity.ratingAverage)" class="star">★</span>
                    </div>
                    <span class="rating-text">{{ entity.ratingAverage.toFixed(1) }} ({{ entity.ratingCount }} reviews)</span>
                  </div>
                </div>
                <button class="btn btn-primary" (click)="selectEntity(entity)">
                  Select
                </button>
              </div>

              <div class="no-results" *ngIf="results.length === 0 && searchQuery">
                <p>No {{ selectedType }} found matching "{{ searchQuery }}"</p>
                <button class="btn btn-outline" (click)="createNewEntity()">
                  Create new {{ selectedType }}
                </button>
              </div>
            </div>
          </div>

          <!-- Create New -->
          <div class="create-section">
            <h3 class="section-title">Or create a new {{ selectedType }}</h3>
            <button class="btn btn-outline" (click)="createNewEntity()">
              Create {{ selectedType }}
            </button>
          </div>
        </div>

        <!-- Step 2: Write Review -->
        <div class="step-content" *ngIf="currentStep === 2 || selectedEntity">
          <div class="step-header">
            <h1 class="step-title">Write your review</h1>
            <p class="step-description">Share your experience with {{ selectedEntity?.name }}</p>
          </div>

          <div class="review-form">
            <div class="entity-preview" *ngIf="selectedEntity">
              <div class="entity-info">
                <h3 class="entity-name">{{ selectedEntity.name }}</h3>
                <span class="entity-type">{{ selectedEntity.type }}</span>
              </div>
              <button class="btn btn-text" (click)="changeEntity()">Change</button>
            </div>

            <form class="form" (ngSubmit)="submitReview()">
              <div class="form-group">
                <label class="form-label">Rating *</label>
                <div class="rating-input">
                  <button
                    type="button"
                    class="star-btn"
                    *ngFor="let star of [1,2,3,4,5]"
                    (click)="setRating(star)"
                    [class.active]="rating >= star"
                  >
                    ★
                  </button>
                </div>
                <div class="rating-text">{{ getRatingText() }}</div>
              </div>

              <div class="form-group">
                <label class="form-label" for="title">Review Title</label>
                <input
                  type="text"
                  id="title"
                  class="form-input"
                  [(ngModel)]="reviewTitle"
                  name="title"
                  placeholder="Summarize your experience in a few words"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="body">Your Review *</label>
                <textarea
                  id="body"
                  class="form-textarea"
                  rows="6"
                  [(ngModel)]="reviewBody"
                  name="body"
                  placeholder="Tell us about your experience with this {{ selectedEntity?.type }}..."
                  required
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancelReview()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!canSubmit()">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Step 3: Confirmation -->
        <div class="step-content" *ngIf="currentStep === 3">
          <div class="confirmation">
            <div class="confirmation-icon">✅</div>
            <h2 class="confirmation-title">Review Submitted!</h2>
            <p class="confirmation-message">
              Thank you for sharing your experience. Your review will help others make informed decisions.
            </p>
            <div class="confirmation-actions">
              <button class="btn btn-primary" (click)="goToEntity()">View Entity</button>
              <button class="btn btn-outline" (click)="writeAnotherReview()">Write Another Review</button>
            </div>
          </div>
        </div>

        <!-- Create Entity Modal -->
        <div class="modal-overlay" *ngIf="showCreateModal" (click)="closeCreateModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Create New {{ selectedType | titlecase }}</h3>
              <button class="modal-close" (click)="closeCreateModal()">×</button>
            </div>
            
            <form class="create-form" (ngSubmit)="createEntity()">
              <div class="form-group">
                <label class="form-label" for="entityName">Name *</label>
                <input
                  type="text"
                  id="entityName"
                  class="form-input"
                  [(ngModel)]="newEntityName"
                  name="entityName"
                  placeholder="Enter {{ selectedType }} name"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="entityDescription">Description</label>
                <textarea
                  id="entityDescription"
                  class="form-textarea"
                  rows="3"
                  [(ngModel)]="newEntityDescription"
                  name="entityDescription"
                  placeholder="Describe this {{ selectedType }}..."
                ></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" (click)="closeCreateModal()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!newEntityName.trim()">
                  Create {{ selectedType | titlecase }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .write-review-container {
      min-height: 100vh;
      padding: 2rem 0;
    }

    .progress-steps {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .step-number {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--border-color);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: all 0.2s;
    }

    .step.active .step-number {
      background: var(--primary-color);
      color: white;
    }

    .step.completed .step-number {
      background: var(--success-color);
      color: white;
    }

    .step-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .step.active .step-label {
      color: var(--primary-color);
      font-weight: 500;
    }

    .step-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .step-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .step-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .step-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
    }

    .search-section,
    .create-section {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .search-bar {
      display: flex;
      margin-bottom: 1.5rem;
      background: var(--surface-color);
      border-radius: 0.75rem;
      overflow: hidden;
    }

    .search-input {
      flex: 1;
      border: none;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      outline: none;
      background: transparent;
    }

    .search-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 1rem 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .search-btn:hover {
      background: var(--primary-hover);
    }

    .search-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .type-filters {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .filter-btn {
      background: white;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .search-results {
      margin-top: 1.5rem;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      transition: all 0.2s;
    }

    .result-item:hover {
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
    }

    .result-info {
      flex: 1;
    }

    .result-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
    }

    .result-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .result-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating-stars {
      display: flex;
    }

    .star {
      color: #fbbf24;
      font-size: 1rem;
    }

    .rating-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .no-results {
      text-align: center;
      padding: 2rem;
    }

    .no-results p {
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    .review-form {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 2rem;
    }

    .entity-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--surface-color);
      border-radius: 0.5rem;
      margin-bottom: 2rem;
    }

    .entity-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .entity-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .entity-type {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
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

    .rating-input {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #e2e8f0;
      cursor: pointer;
      transition: color 0.2s;
    }

    .star-btn:hover,
    .star-btn.active {
      color: #fbbf24;
    }

    .rating-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
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
      min-height: 120px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .confirmation {
      text-align: center;
      padding: 3rem 2rem;
    }

    .confirmation-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .confirmation-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .confirmation-message {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .confirmation-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
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

    .create-form {
      padding: 1.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .progress-steps {
        gap: 1rem;
      }

      .step-label {
        display: none;
      }

      .form-actions,
      .confirmation-actions {
        flex-direction: column;
      }

      .type-filters {
        justify-content: center;
      }

      .result-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class WriteReviewComponent implements OnInit {
  currentStep = 1;
  selectedType: 'brand' | 'product' | 'movie' | 'music' = 'brand';
  searchQuery = '';
  selectedEntity: Entity | null = null;
  
  rating = 0;
  reviewTitle = '';
  reviewBody = '';
  
  newEntityName = '';
  newEntityDescription = '';
  showCreateModal = false;
  
  searchResults$: Observable<Entity[]>;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchResults$ = of([]);
  }

  ngOnInit(): void {
    // Check if entity was pre-selected from route params
    this.route.queryParams.subscribe(params => {
      if (params['entity']) {
        this.dataService.getEntityById(params['entity']).subscribe(entity => {
          if (entity) {
            this.selectedEntity = entity;
            this.currentStep = 2;
          }
        });
      }
    });

    // Check authentication
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
  }

  onSearchChange(): void {
    if (this.searchQuery.trim()) {
      this.searchResults$ = this.dataService.searchEntities(this.searchQuery, this.selectedType);
    } else {
      this.searchResults$ = this.dataService.getEntities().pipe(
        map(entities => entities.filter(e => e.type === this.selectedType))
      );
    }
  }

  search(): void {
    this.onSearchChange();
  }

  selectType(type: 'brand' | 'product' | 'movie' | 'music'): void {
    this.selectedType = type;
    this.onSearchChange();
  }

  selectEntity(entity: Entity): void {
    this.selectedEntity = entity;
    this.currentStep = 2;
  }

  changeEntity(): void {
    this.selectedEntity = null;
    this.currentStep = 1;
  }

  createNewEntity(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newEntityName = '';
    this.newEntityDescription = '';
  }

  createEntity(): void {
    if (!this.newEntityName.trim() || !this.authService.currentUser) {
      return;
    }

    const newEntity = {
      type: this.selectedType,
      name: this.newEntityName.trim(),
      slug: this.newEntityName.toLowerCase().replace(/\s+/g, '-'),
      description: this.newEntityDescription.trim() || undefined,
      createdBy: this.authService.currentUser.id,
      status: 'active' as const,
      metadata: {}
    };

    this.dataService.createEntity(newEntity).subscribe(entity => {
      this.selectedEntity = entity;
      this.closeCreateModal();
      this.currentStep = 2;
    });
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  getRatingText(): string {
    const texts = [
      'Poor - 1 star',
      'Fair - 2 stars',
      'Good - 3 stars',
      'Very Good - 4 stars',
      'Excellent - 5 stars'
    ];
    return this.rating > 0 ? texts[this.rating - 1] : 'Click to rate';
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '★' : '☆');
    }
    return stars;
  }

  canSubmit(): boolean {
    return this.rating > 0 && this.reviewBody.trim().length > 0 && this.selectedEntity !== null;
  }

  submitReview(): void {
    if (!this.canSubmit() || !this.selectedEntity || !this.authService.currentUser) {
      return;
    }

    const review = {
      entityId: this.selectedEntity.id,
      userId: this.authService.currentUser.id,
      rating: this.rating,
      title: this.reviewTitle.trim() || undefined,
      body: this.reviewBody.trim()
    };

    this.dataService.createReview(review).subscribe(() => {
      this.currentStep = 3;
    });
  }

  cancelReview(): void {
    if (confirm('Are you sure you want to cancel? Your review will not be saved.')) {
      this.router.navigate(['/']);
    }
  }

  goToEntity(): void {
    if (this.selectedEntity) {
      this.router.navigate(['/entities', this.selectedEntity.id]);
    }
  }

  writeAnotherReview(): void {
    this.currentStep = 1;
    this.selectedEntity = null;
    this.rating = 0;
    this.reviewTitle = '';
    this.reviewBody = '';
  }
}