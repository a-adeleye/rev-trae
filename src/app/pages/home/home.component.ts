import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Entity } from '@/types/models';
import { DataService } from '@/services/data.service';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">Discover & Review</h1>
          <p class="hero-subtitle">Share your experiences with brands, products, movies, and music</p>
          
          <!-- Search Bar -->
          <div class="search-section">
            <div class="search-bar">
              <input 
                type="text" 
                class="search-input" 
                placeholder="Search brands, products, movies, music..."
                [(ngModel)]="searchQuery"
                (input)="onSearchChange()"
              />
              <button class="search-btn" (click)="search()">
                <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
            
            <!-- Type Filters -->
            <div class="type-filters">
              <button 
                class="filter-btn" 
                [class.active]="selectedType === 'all'"
                (click)="filterByType('all')"
              >
                All
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedType === 'brand'"
                (click)="filterByType('brand')"
              >
                Brands
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedType === 'product'"
                (click)="filterByType('product')"
              >
                Products
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedType === 'movie'"
                (click)="filterByType('movie')"
              >
                Movies
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedType === 'music'"
                (click)="filterByType('music')"
              >
                Music
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Top Rated Entities -->
      <section class="top-rated">
        <div class="container">
          <h2 class="section-title">Top Rated</h2>
          <div class="entities-grid">
            <div 
              class="entity-card" 
              *ngFor="let entity of topRatedEntities$ | async"
              [routerLink]="['/entities', entity.id]"
            >
              <div class="entity-header">
                <span class="entity-type">{{ entity.type }}</span>
                <div class="entity-rating">
                  <div class="rating-stars">
                    <span *ngFor="let star of getStars(entity.ratingAverage)" class="star">★</span>
                  </div>
                  <span class="rating-text">{{ entity.ratingAverage.toFixed(1) }}</span>
                </div>
              </div>
              <h3 class="entity-name">{{ entity.name }}</h3>
              <p class="entity-description">{{ entity.description }}</p>
              <div class="entity-footer">
                <span class="review-count">{{ entity.ratingCount }} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section" *ngIf="!authService.isLoggedIn">
        <div class="container">
          <h2 class="cta-title">Join the community</h2>
          <p class="cta-subtitle">Share your experiences and help others make informed decisions</p>
          <div class="cta-buttons">
            <a routerLink="/login" class="btn btn-primary">Sign In</a>
            <a routerLink="/write-review" class="btn btn-outline">Write a Review</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 3rem;
      opacity: 0.9;
    }

    .search-section {
      max-width: 600px;
      margin: 0 auto;
    }

    .search-bar {
      display: flex;
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .search-input {
      flex: 1;
      border: none;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      outline: none;
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
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: white;
      color: var(--text-primary);
    }

    .top-rated {
      padding: 4rem 0;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 2rem;
      text-align: center;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
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
      align-items: center;
      margin-bottom: 1rem;
    }

    .entity-type {
      background: var(--surface-color);
      color: var(--text-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .entity-rating {
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
      font-weight: 600;
      color: var(--text-primary);
    }

    .entity-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .entity-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .entity-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .cta-section {
      background: var(--surface-color);
      padding: 4rem 0;
      text-align: center;
    }

    .cta-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .cta-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .entities-grid {
        grid-template-columns: 1fr;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  selectedType: EntityType | 'all' = 'all';
  topRatedEntities$: Observable<Entity[]>;

  constructor(
    public authService: AuthService,
    private dataService: DataService
  ) {
    this.topRatedEntities$ = this.dataService.getEntities().pipe(
      map(entities => entities
        .sort((a, b) => b.ratingAverage - a.ratingAverage)
        .slice(0, 6)
      )
    );
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSearchChange(): void {
    // Implement search functionality
  }

  search(): void {
    // Navigate to entities page with search query
    if (this.searchQuery.trim()) {
      // This will be implemented when we create the entities component
    }
  }

  filterByType(type: EntityType | 'all'): void {
    this.selectedType = type;
    // Implement filtering logic
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
}