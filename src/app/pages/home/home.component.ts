import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entity, EntityType } from '@/types/models';
import { DataService } from '@/services/data.service';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
      <div class="landing-page">
          <header class="hero">
              <nav class="navbar">
                  <div class="logo">
                      <div class="logo-icon">✓</div>
                      <span class="logo-text">Verdict<span class="accent">.ng</span></span>
                  </div>
                  <div class="nav-links">
                      <a href="#categories">Categories</a>
                      <a href="#business">For Business</a>
                      <a href="#community">Community</a>
                      <a class="muted" href="#">Login</a>
                      <a class="primary" href="#">Get Started</a>
                  </div>
              </nav>

              <div class="hero-content">
                  <div class="badge">The Voice of the People</div>
                  <h1>Your Experience <span class="gradient">Matters Here.</span></h1>
                  <p class="subtitle">
                      Verdict.ng is the open platform for honest reviews on everything from Government services to the
                      latest movies.
                      No filters, just truth.
                  </p>

                  <div class="search-wrapper">
                      <svg viewBox="0 0 24 24" class="search-icon" aria-hidden="true">
                          <path
                                  d="M21 21l-4.35-4.35m0 0A6.5 6.5 0 1010.5 17.5a6.5 6.5 0 006.15-4.85z"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                          ></path>
                      </svg>
                      <input
                              type="text"
                              placeholder="Review a movie, ministry, product..."
                              [(ngModel)]="searchQuery"
                              (input)="onSearchChange()"
                      />
                  </div>

                  <div class="type-filters">
                      <button
                              class="pill"
                              [class.active]="selectedType === 'all'"
                              (click)="filterByType('all')"
                      >
                          All
                      </button>
                      <button
                              class="pill"
                              [class.active]="selectedType === 'brand'"
                              (click)="filterByType('brand')"
                      >
                          Brands
                      </button>
                      <button
                              class="pill"
                              [class.active]="selectedType === 'product'"
                              (click)="filterByType('product')"
                      >
                          Products
                      </button>
                      <button
                              class="pill"
                              [class.active]="selectedType === 'movie'"
                              (click)="filterByType('movie')"
                      >
                          Movies
                      </button>
                      <button
                              class="pill"
                              [class.active]="selectedType === 'music'"
                              (click)="filterByType('music')"
                      >
                          Music
                      </button>
                  </div>
              </div>
              <div class="reviews-grid">
                  <div class="review-card" *ngFor="let review of featuredReviews">
                      <div class="review-header">
                          <div class="avatar" [style.backgroundColor]="review.color">{{ review.initials }}</div>
                          <div>
                              <h4>{{ review.name }}</h4>
                              <small>Reviewing <span class="accent">{{ review.subject }}</span></small>
                          </div>
                          <span class="timestamp">{{ review.time }}</span>
                      </div>
                      <div class="stars" aria-hidden="true">
                          <span *ngFor="let star of [1,2,3,4,5]; let i = index"
                                [class.faded]="i >= review.stars">★</span>
                      </div>
                      <p class="quote">“{{ review.text }}”</p>
                  </div>
              </div>
          </header>

          <section class="stats">
              <div class="stat" *ngFor="let stat of stats">
                  <div class="stat-icon">{{ stat.icon }}</div>
                  <div>
                      <div class="stat-value">{{ stat.value }}</div>
                      <div class="stat-label">{{ stat.label }}</div>
                  </div>
              </div>
          </section>

          <section id="categories" class="categories">
              <div class="section-header">
                  <h2>Explore by Category</h2>
                  <p>Find ratings for everything that matters to your daily life.</p>
              </div>
              <div class="category-grid">
                  <a class="category-card" *ngFor="let category of categories" href="#">
                      <div class="category-icon" [style.backgroundColor]="category.tint" [style.color]="category.color">
                          {{ category.icon }}
                      </div>
                      <h3>{{ category.title }}</h3>
                      <p>{{ category.subtitle }}</p>
                  </a>
                  <a class="category-card muted" href="#">
                      <div class="category-icon">→</div>
                      <h3>View All</h3>
                      <p>Explore 100+ Categories</p>
                  </a>
              </div>
          </section>

          <section id="business" class="business">
              <div class="business-content">
                  <div class="business-text">
                      <div class="eyebrow">Verdict for Business</div>
                      <h2>Turn feedback into your superpower.</h2>
                      <p>
                          Companies that actively manage their Verdict.ng profile see a 40% increase in customer trust.
                          Respond to reviews,
                          analyze sentiment, and grow.
                      </p>
                      <ul>
                          <li *ngFor="let point of businessPoints">{{ point }}</li>
                      </ul>
                      <button class="primary">Claim Business Profile</button>
                  </div>
                  <div class="business-card">
                      <div class="rating-summary">
                          <div>
                              <small>Overall Rating</small>
                              <div class="rating-score">4.8<span class="out-of">/5</span></div>
                          </div>
                          <div class="trend">↗</div>
                      </div>
                      <div class="rating-bars">
                          <div class="bar" *ngFor="let bar of ratingBars">
                              <span class="bar-label">{{ bar.label }}</span>
                              <div class="bar-track">
                                  <div class="bar-fill" [style.width]="bar.width"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section class="top-rated" *ngIf="(topRatedEntities$ | async)?.length">
              <div class="section-header">
                  <h2>Top Rated on Verdict.ng</h2>
                  <p>See what the community loves right now.</p>
              </div>
              <div class="entities-grid">
                  <a class="entity-card" *ngFor="let entity of topRatedEntities$ | async"
                     [routerLink]="['/entities', entity.id]">
                      <div class="entity-header">
                          <span class="entity-type">{{ entity.type }}</span>
                          <div class="entity-rating">
                              <div class="stars">
                                  <span *ngFor="let star of getStars(entity.ratingAverage)">★</span>
                              </div>
                              <span class="rating-text">{{ entity.ratingAverage.toFixed(1) }}</span>
                          </div>
                      </div>
                      <h3>{{ entity.name }}</h3>
                      <p>{{ entity.description }}</p>
                      <div class="entity-footer">{{ entity.ratingCount }} reviews</div>
                  </a>
              </div>
          </section>

          <footer class="footer" id="community">
              <div class="footer-brand">
                  <div class="logo-icon">✓</div>
                  <div>
                      <h3>Verdict.ng</h3>
                      <p>Empowering Nigerians with the information they need to make better decisions.</p>
                  </div>
              </div>
              <div class="footer-links">
                  <div>
                      <h4>Platform</h4>
                      <a href="#">About Us</a>
                      <a href="#">Categories</a>
                      <a href="#">Write a Review</a>
                      <a href="#">Help Center</a>
                  </div>
                  <div>
                      <h4>Business</h4>
                      <a href="#">Verdict for Business</a>
                      <a href="#">Plans & Pricing</a>
                      <a href="#">Business Login</a>
                      <a href="#">Success Stories</a>
                  </div>
                  <div>
                      <h4>Legal</h4>
                      <a href="#">Privacy Policy</a>
                      <a href="#">Terms of Service</a>
                      <a href="#">Content Guidelines</a>
                  </div>
              </div>
              <div class="footer-bottom">
                  <span>© 2024 Verdict.ng. All rights reserved.</span>
                  <span class="status">● Systems Operational</span>
              </div>
          </footer>
      </div>
  `,
  styles: [`
    .landing-page {
      background: linear-gradient(180deg, #fff7ed 0%, #ffffff 40%, #f8fafc 100%);
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }
    .hero {position: relative;
      padding: 3rem 1.5rem 2rem;
      overflow: hidden;
      background: radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.15), transparent 35%),
      radial-gradient(circle at 90% 10%, rgba(239, 68, 68, 0.12), transparent 30%),
      linear-gradient(120deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
      box-shadow: 0 30px 80px rgba(15, 23, 42, 0.1);
      border-radius: 0 0 2.5rem 2.5rem;
    }.navbar {
       display: flex;
       justify-content: space-between;
       align-items: center;
       max-width: 1200px;
       margin: 0 auto 2.5rem;
     }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f97316, #ef4444);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      box-shadow: 0 15px 35px rgba(249, 115, 22, 0.25);
    }

    .logo-text {
      font-size: 1.25rem;color: #0f172a;
    }

    .accent {
      color: #ea580c;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .nav-links a {
      color: #475569;
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      border-radius: 999px;
      transition: color 0.2s ease, background-color 0.2s ease;
    }

    .nav-links a:hover {
      color: #ea580c;
      background: rgba(234, 88, 12, 0.08);
    }

    .nav-links .muted {
      color: #94a3b8;
    }

    .nav-links .primary {
      background: #0f172a;
      color: #fff;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
    }

    .nav-links .primary:hover {
      background: #ea580c;
      box-shadow: 0 12px 30px rgba(234, 88, 12, 0.35);
    }

    .hero-content {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 999px;
      color: #ea580c;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.75rem;
      margin-bottom: 1rem;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    }

    .hero h1 {
      font-size: clamp(2.5rem, 4vw, 4rem);
      line-height: 1.1;
      margin-bottom: 1rem;
    }

    .gradient {
      background: linear-gradient(90deg, #ea580c, #ef4444, #ea580c);
      -webkit-background-clip: text;
      color: transparent;
    }

    .subtitle {
      color: #64748b;
      font-size: 1.05rem;
      margin: 0 auto 2rem;
      max-width: 720px;
    }

    .search-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .search-bar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 0.75rem;
      background: #fff;
      border-radius: 18px;
      padding: 0.75rem 0.75rem 0.75rem 1rem;
      box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
      width: min(720px, 100%);
      border: 1px solid #e2e8f0;
    }

    .search-icon {
      width: 24px;
      height: 24px;
      color: #94a3b8;
      align-self: center;
    }
    .search-bar input {
      border: none;
      padding: 0.75rem 0.5rem;
      outline: none;
      width: 100%;
      color: #0f172a;
    }
    .search-bar .primary {
      border: none;
      padding: 0.85rem 1.5rem;
      border-radius: 14px;
      cursor: pointer;
    }
    .type-filters {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .pill {
      border: 1px solid #e2e8f0;
      background: #fff;
      color: #0f172a;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pill.active,
    .pill:hover {
      background: #0f172a;
      color: #fff;
      border-color: #0f172a;
    }

    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .review-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 18px;
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
      text-align: left;
    }

    .review-header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #0f172a;
    }

    .review-header h4 {
      margin: 0;
      font-size: 0.95rem;
    }

    .review-header small {
      color: #94a3b8;
    }

    .timestamp {
      color: #94a3b8;
      font-size: 0.75rem;
      font-family: 'Inter', sans-serif;
    }

    .stars {
      color: #fbbf24;
      display: flex;
      gap: 0.1rem;
      font-size: 0.95rem;
    }

    .stars .faded {
      color: #e2e8f0;
    }

    .quote {
      color: #475569;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .stat {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 1rem 1.25rem;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.75rem;
      align-items: center;
      box-shadow: 0 12px 25px rgba(15, 23, 42, 0.06);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fff7ed;
      color: #ea580c;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
    }
    .stat-label {
      color: #94a3b8;
      font-weight: 600;
    }
    .categories {
      padding: 0 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .section-header h2 {
      font-size: 2rem;
      margin-bottom: 0.35rem;
    }

    .section-header p {
      color: #64748b;
      margin: 0;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .category-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 1.25rem;
      display: grid;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
      border-color: #ea580c;
    }

    .category-card.muted {
      background: #f8fafc;
      color: #475569;
      border-style: dashed;
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      background: #fff7ed;
      color: #ea580c;
      font-weight: 700;
    }

    .business {
      background: #0f172a;
      color: #fff;
      margin: 0 1.5rem;
      border-radius: 26px;
      padding: clamp(1.5rem, 4vw, 3rem);
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
    }

    .business-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      align-items: center;
    }

    .business-text h2 {
      font-size: 2.25rem;
      margin: 0.5rem 0 1rem;
    }

    .business-text p {
      color: #cbd5e1;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .business-text ul {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
      display: grid;
      gap: 0.5rem;
      color: #e2e8f0;
      font-weight: 600;
    }
    .eyebrow {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
      letter-spacing: 0.04em;
    }

    .business-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 18px;
      padding: 1.5rem;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .rating-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .rating-summary small {
      text-transform: uppercase;
      color: #cbd5e1;
      letter-spacing: 0.08em;
    }

    .rating-score {
      font-size: 2.5rem;
      font-weight: 800;
    }

    .out-of {
      color: #94a3b8;
      font-size: 1rem;
      font-weight: 600;
    }

    .trend {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(234, 88, 12, 0.15);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #fb923c;
    }

    .rating-bars {
      display: grid;
      gap: 0.75rem;
    }

    .bar {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
      align-items: center;
      color: #cbd5e1;
    }

    .bar-label {
      width: 40px;
      text-align: right;
      font-weight: 700;
    }

    .bar-track {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      overflow: hidden;
      height: 10px;
    }

    .bar-fill {
      background: linear-gradient(90deg, #fb923c, #ea580c);
      height: 100%;
      border-radius: inherit;
    }

    .top-rated {
      padding: 0 1.5rem;
      max-width: 1100px;
      margin: 0 auto 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .entity-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 1.25rem;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 12px 25px rgba(15, 23, 42, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .entity-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 30px rgba(15, 23, 42, 0.1);
      border-color: #ea580c;
    }
    .entity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .entity-type { font-size: 0.75rem;
     background: #f1f5f9;
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
      text-transform: uppercase;
      color: #475569;
      font-weight: 700;
    }
    .entity-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating-text {
      font-weight: 700;
      color: #0f172a;
    }
    .entity-card h3 {
      margin: 0.35rem 0;
    }.entity-card p {
       margin: 0 0 0.75rem;
       color: #64748b;
       line-height: 1.5;
     }
    .entity-footer {
      color: #94a3b8;
      font-weight: 600;
    }

    .footer {
      background: #fff;
      border-top: 1px solid #e2e8f0;
      padding: 2rem 1.5rem 2.5rem;
      display: grid;
      gap: 1.5rem;
      color: #475569;
    }
    .footer-brand {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.75rem;
      align-items: center;
    }
    .footer-brand h3 {
      margin: 0;
      color: #0f172a;
    }
    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .footer-links h4 {
      margin-bottom: 0.5rem;
      color: #0f172a;
    }

    .footer-links a {
      display: block;
      color: inherit;
      text-decoration: none;
      margin: 0.25rem 0;
      transition: color 0.2s ease;
    }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-weight: 600;
    }

    .status {
      color: #10b981;
    }

    .primary {
      background: linear-gradient(90deg, #0f172a, #0f172a 60%, #111827);
      color: #fff;
      font-weight: 700;
      border: none;
      border-radius: 999px;
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 25px rgba(15, 23, 42, 0.25);
      background: linear-gradient(90deg, #ea580c, #f97316);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }

      .hero {
        padding: 2rem 1rem 1.5rem;
      }
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }

      .business {
        margin: 0 1rem;
      }
    }
    
  `]
})
export class HomeComponent implements OnInit {
    searchQuery = '';
    selectedType: EntityType | 'all' = 'all';
    topRatedEntities$: Observable<Entity[]>;

    featuredReviews = [
        {
            initials: 'JD',
            name: 'John Doe',
            subject: 'Ministry of Works',
            time: '2m ago',
            stars: 4,
            color: '#ffedd5',
            text: 'Surprisingly fast service at the registration center today. The new digital process is actually working.'
        },
        {
            initials: 'SA',
            name: 'Sarah A.',
            subject: 'Infinix Note 30',
            time: '15m ago',
            stars: 5,
            color: '#eff6ff',
            text: "Battery life is incredible. I've used it for 2 days straight without charging. Best value for money."
        },
        {
            initials: 'MK',
            name: 'Mike K.',
            subject: 'Dune: Part Two',
            time: '1h ago',
            stars: 5,
            color: '#f5f3ff',
            text: 'A cinematic masterpiece. The visuals, the sound design, everything was perfect. Must watch in IMAX.'
        }
    ];

    stats = [
        { value: '2.5M+', label: 'Reviews Posted', icon: '💬' },
        { value: '150k+', label: 'Entities Listed', icon: '🏢' },
        { value: '850k+', label: 'Monthly Users', icon: '👥' }
    ];

    categories = [
        { title: 'Music', subtitle: 'Albums, Singles, Concerts', icon: '♫', color: '#f43f5e', tint: '#fff1f2' },
        { title: 'Products', subtitle: 'Tech, Fashion, Home', icon: '🛍', color: '#2563eb', tint: '#eff6ff' },
        { title: 'Movies', subtitle: 'Cinema, Nollywood, TV', icon: '🎬', color: '#7c3aed', tint: '#f3e8ff' },
        { title: 'Government', subtitle: 'Agencies, Ministries, Public Services', icon: '🏛', color: '#059669', tint: '#ecfdf3' },
        { title: 'Dining', subtitle: 'Restaurants, Cafes, Fast Food', icon: '🍽', color: '#f59e0b', tint: '#fffbeb' },
        { title: 'Finance', subtitle: 'Banks, Fintech, Insurance', icon: '👛', color: '#0891b2', tint: '#ecfeff' },
        { title: 'Travel', subtitle: 'Airlines, Hotels, Logistics', icon: '✈', color: '#4f46e5', tint: '#eef2ff' }
    ];

    businessPoints = [
        'Claim your free company profile',
        'Respond to customers directly',
        'Showcase your rating on your site'
    ];

    ratingBars = [
        { label: '5 ★', width: '80%' },
        { label: '4 ★', width: '15%' },
        { label: '3 ★', width: '5%' }
    ];

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
        if (this.searchQuery.trim()) {
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
