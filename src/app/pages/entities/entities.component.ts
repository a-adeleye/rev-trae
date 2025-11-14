import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entity, EntityType } from '@/types/models';
import { DataService } from '@/services/data.service';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="entities-container">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Explore</h1>
          <p class="page-subtitle">Discover and review brands, products, movies, and music</p>
        </div>

        <!-- Search and Filters -->
        <div class="search-filters">
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

        <!-- Results -->
        <div class="results-section">
          <div class="results-header">
            <h2 class="results-title">
              {{ (filteredEntities$ | async)?.length || 0 }} Results
            </h2>
            <div class="sort-options">
              <select class="sort-select" [(ngModel)]="sortBy" (change)="onSortChange()">
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="recent">Recently Added</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          <!-- Entity Grid -->
          <div class="entities-grid">
            <div
              class="entity-card"
              *ngFor="let entity of filteredEntities$ | async"
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
                <span class="entity-date">{{ formatDate(entity.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="(filteredEntities$ | async)?.length === 0">
            <div class="empty-state-icon">🔍</div>
            <h3 class="empty-state-title">No entities found</h3>
            <p class="empty-state-description">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .entities-container {
      min-height: 100vh;
      padding: 2rem 0;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .page-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
    }

    .search-filters {
      margin-bottom: 3rem;
    }

    .search-bar {
      display: flex;
      max-width: 600px;
      margin: 0 auto 2rem;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      overflow: hidden;
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

    .results-section {
      margin-top: 2rem;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .results-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .sort-select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background: white;
      font-size: 0.875rem;
      cursor: pointer;
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
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .entity-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .review-count {
      font-weight: 500;
    }

    .entity-date {
      font-size: 0.75rem;
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
    }

    @media (max-width: 768px) {
      .results-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .entities-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EntitiesComponent implements OnInit {
  searchQuery = '';
  selectedType: EntityType | 'all' = 'all';
  sortBy = 'rating';
  
  filteredEntities$: Observable<Entity[]>;

  constructor(private dataService: DataService) {
    this.filteredEntities$ = this.dataService.getEntities().pipe(
      map(entities => entities.sort((a, b) => b.ratingAverage - a.ratingAverage))
    );
  }

  ngOnInit(): void {
    this.updateFilteredEntities();
  }

  onSearchChange(): void {
    this.updateFilteredEntities();
  }

  search(): void {
    this.updateFilteredEntities();
  }

  filterByType(type: EntityType | 'all'): void {
    this.selectedType = type;
    this.updateFilteredEntities();
  }

  onSortChange(): void {
    this.updateFilteredEntities();
  }

  private updateFilteredEntities(): void {
    this.filteredEntities$ = this.dataService.searchEntities(this.searchQuery, this.selectedType === 'all' ? undefined : this.selectedType).pipe(
      map(entities => {
        switch (this.sortBy) {
          case 'rating':
            return entities.sort((a, b) => b.ratingAverage - a.ratingAverage);
          case 'reviews':
            return entities.sort((a, b) => b.ratingCount - a.ratingCount);
          case 'recent':
            return entities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          case 'name':
            return entities.sort((a, b) => a.name.localeCompare(b.name));
          default:
            return entities;
        }
      })
    );
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

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  }
}