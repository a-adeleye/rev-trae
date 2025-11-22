import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OwnershipClaim, Entity, User } from '@/types/models';
import { DataService } from '@/services/data.service';
import { AuthService } from '@/services/auth.service';

interface ClaimWithDetails extends OwnershipClaim {
  entity?: Entity;
  user?: User;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container" *ngIf="authService.currentUser as user">
      <!-- Header -->
      <div class="admin-header">
        <div class="container">
          <h1 class="admin-title">Admin Dashboard</h1>
          <p class="admin-subtitle">Manage ownership claims and moderate content</p>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <div class="stat-number">{{ pendingClaims$ | async }}</div>
                <div class="stat-label">Pending Claims</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-number">{{ approvedClaims$ | async }}</div>
                <div class="stat-label">Approved Claims</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">❌</div>
              <div class="stat-content">
                <div class="stat-number">{{ rejectedClaims$ | async }}</div>
                <div class="stat-label">Rejected Claims</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🚩</div>
              <div class="stat-content">
                <div class="stat-number">{{ flaggedItems$ | async }}</div>
                <div class="stat-label">Flagged Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Claims Management -->
      <div class="claims-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Ownership Claims</h2>
            <div class="filter-tabs">
              <button 
                class="filter-tab" 
                [class.active]="activeFilter === 'pending'"
                (click)="setFilter('pending')"
              >
                Pending ({{ pendingClaims$ | async }})
              </button>
              <button 
                class="filter-tab" 
                [class.active]="activeFilter === 'approved'"
                (click)="setFilter('approved')"
              >
                Approved
              </button>
              <button 
                class="filter-tab" 
                [class.active]="activeFilter === 'rejected'"
                (click)="setFilter('rejected')"
              >
                Rejected
              </button>
              <button 
                class="filter-tab" 
                [class.active]="activeFilter === 'all'"
                (click)="setFilter('all')"
              >
                All
              </button>
            </div>
          </div>

          <!-- Claims List -->
          <div class="claims-list">
            <div 
              class="claim-card" 
              *ngFor="let claim of filteredClaims$ | async"
            >
              <div class="claim-header">
                <div class="claim-info">
                  <h3 class="entity-name">{{ claim.entity?.name || 'Loading...' }}</h3>
                  <span class="entity-type">{{ claim.entity?.type }}</span>
                  <div class="claim-meta">
                    <span class="claim-date">{{ formatDate(claim.createdAt) }}</span>
                    <span class="claim-status" [class]="'status-' + claim.status">
                      {{ claim.status }}
                    </span>
                  </div>
                </div>
                
                <div class="claimer-info">
                  <div class="claimer-avatar">{{ getInitials(claim.user?.displayName) }}</div>
                  <div class="claimer-details">
                    <span class="claimer-name">{{ claim.user?.displayName || 'Loading...' }}</span>
                    <span class="claimer-email">{{ claim.user?.email }}</span>
                  </div>
                </div>
              </div>

              <div class="claim-content">
                <div class="claim-message" *ngIf="claim.message">
                  <h4 class="message-title">Message</h4>
                  <p class="message-text">{{ claim.message }}</p>
                </div>
                
                <div class="claim-evidence" *ngIf="claim.evidence?.website || claim.evidence?.companyEmail">
                  <h4 class="evidence-title">Evidence</h4>
                  <div class="evidence-list">
                    <div class="evidence-item" *ngIf="claim.evidence?.website">
                      <span class="evidence-label">Website:</span>
                      <a [href]="claim.evidence?.website" target="_blank" class="evidence-link">
                        {{ claim.evidence?.website }}
                      </a>
                    </div>
                    <div class="evidence-item" *ngIf="claim.evidence?.companyEmail">
                      <span class="evidence-label">Company Email:</span>
                      <span class="evidence-text">{{ claim.evidence?.companyEmail }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="claim-actions" *ngIf="claim.status === 'pending'">
                <button class="btn btn-success" (click)="approveClaim(claim.id)">
                  Approve
                </button>
                <button class="btn btn-danger" (click)="rejectClaim(claim.id)">
                  Reject
                </button>
                <button class="btn btn-secondary" (click)="viewEntity(claim.entityId)">
                  View Entity
                </button>
              </div>
              
              <div class="claim-actions" *ngIf="claim.status !== 'pending'">
                <button class="btn btn-secondary" (click)="viewEntity(claim.entityId)">
                  View Entity
                </button>
                <button class="btn btn-outline" (click)="revertClaim(claim.id)">
                  Revert Decision
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="(filteredClaims$ | async)?.length === 0">
              <div class="empty-state-icon">📋</div>
              <h3 class="empty-state-title">No claims found</h3>
              <p class="empty-state-description">
                {{ getEmptyStateMessage() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Moderation -->
      <div class="moderation-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Content Moderation</h2>
            <p class="section-subtitle">Review flagged content and take action</p>
          </div>

          <div class="moderation-grid">
            <div class="moderation-card">
              <h3 class="card-title">Flagged Reviews</h3>
              <p class="card-description">Reviews that have been flagged by users</p>
              <button class="btn btn-primary">Review Flagged Reviews</button>
            </div>
            
            <div class="moderation-card">
              <h3 class="card-title">Flagged Responses</h3>
              <p class="card-description">Owner responses that have been flagged</p>
              <button class="btn btn-primary">Review Flagged Responses</button>
            </div>
            
            <div class="moderation-card">
              <h3 class="card-title">Entity Management</h3>
              <p class="card-description">Manage entity visibility and status</p>
              <button class="btn btn-primary">Manage Entities</button>
            </div>
          </div>
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
            You need to be logged in as an admin to access this page.
          </p>
          <button class="btn btn-primary" routerLink="/login">
            Sign In
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
    }

    .admin-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 0;
    }

    .admin-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .admin-subtitle {
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

    .claims-section {
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

    .filter-tabs {
      display: flex;
      background: var(--surface-color);
      border-radius: 0.5rem;
      padding: 0.25rem;
    }

    .filter-tab {
      background: none;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .filter-tab.active {
      background: white;
      color: var(--primary-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .claims-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .claim-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    .claim-header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .entity-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
    }

    .entity-type {
      background: var(--surface-color);
      color: var(--text-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 0.5rem;
    }

    .claim-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .claim-date {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .claim-status {
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .claim-status.status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .claim-status.status-approved {
      background: #d1fae5;
      color: #065f46;
    }

    .claim-status.status-rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .claimer-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .claimer-avatar {
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

    .claimer-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .claimer-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .claimer-email {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .claim-content {
      margin-bottom: 1.5rem;
    }

    .message-title,
    .evidence-title {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .message-text {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .evidence-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .evidence-item {
      display: flex;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .evidence-label {
      font-weight: 500;
      color: var(--text-primary);
      min-width: 80px;
    }

    .evidence-link {
      color: var(--primary-color);
      text-decoration: none;
    }

    .evidence-link:hover {
      text-decoration: underline;
    }

    .evidence-text {
      color: var(--text-secondary);
    }

    .claim-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-success {
      background: var(--success-color);
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-danger {
      background: var(--error-color);
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
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

    .moderation-section {
      padding: 3rem 0;
      background: var(--surface-color);
    }

    .section-subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .moderation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .moderation-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .card-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
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
      .claim-header {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .claimer-info {
        justify-content: flex-start;
      }

      .claim-actions {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .moderation-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeFilter: 'pending' | 'approved' | 'rejected' | 'all' = 'pending';
  
  pendingClaims$: Observable<number>;
  approvedClaims$: Observable<number>;
  rejectedClaims$: Observable<number>;
  flaggedItems$: Observable<number>;
  filteredClaims$: Observable<ClaimWithDetails[]>;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    // Mock data for Phase 1 - would use actual data service in Phase 2
    this.pendingClaims$ = of(1); // Mock pending claim
    this.approvedClaims$ = of(1); // Mock approved claim
    this.rejectedClaims$ = of(0); // Mock rejected claims
    this.flaggedItems$ = of(0); // Mock flagged items

    // Mock claims data
    const mockClaims: ClaimWithDetails[] = [
      {
        id: 'claim1',
        entityId: 'entity5',
        entityName: 'Nike',
        userId: 'user4',
        userDisplayName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        status: 'pending',
        message: 'I am the marketing manager for Nike and would like to manage reviews for our brand.',
        evidence: {
          website: 'https://nike.com',
          companyEmail: 'marketing@nike.com'
        },
        createdAt: new Date('2024-11-12'),
        updatedAt: new Date('2024-11-12'),
        resolvedAt: undefined,
        entity: {
          id: 'entity5',
          type: 'brand',
          name: 'Nike',
          slug: 'nike',
          description: 'Sportswear and athletic footwear company',
          createdBy: 'user4',
          status: 'active',
          ratingCount: 38,
          ratingSum: 152,
          ratingAverage: 4.0,
          lastReviewAt: new Date('2024-11-09'),
          metadata: {},
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-11-09')
        },
        user: {
          id: 'user4',
          displayName: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'regular',
          createdAt: new Date('2024-01-04'),
          updatedAt: new Date('2024-01-04')
        }
      }
    ];

    this.filteredClaims$ = of(mockClaims).pipe(
      map(claims => {
        if (this.activeFilter === 'all') {
          return claims;
        }
        return claims.filter(claim => claim.status === this.activeFilter);
      })
    );
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is admin
    if (!this.authService.isAdmin()) {
      // Redirect to home if not admin
      this.router.navigate(['/']);
      return;
    }
  }

  setFilter(filter: 'pending' | 'approved' | 'rejected' | 'all'): void {
    this.activeFilter = filter;
  }

  getInitials(name?: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  getEmptyStateMessage(): string {
    switch (this.activeFilter) {
      case 'pending':
        return 'No pending ownership claims to review.';
      case 'approved':
        return 'No approved ownership claims.';
      case 'rejected':
        return 'No rejected ownership claims.';
      default:
        return 'No ownership claims found.';
    }
  }

  approveClaim(claimId: string): void {
    // Mock implementation for Phase 1
    console.log('Approving claim:', claimId);
    alert('Claim approved successfully!');
    
    // Update the mock data
    this.pendingClaims$ = of(0);
    this.approvedClaims$ = of(2);
  }

  rejectClaim(claimId: string): void {
    // Mock implementation for Phase 1
    console.log('Rejecting claim:', claimId);
    alert('Claim rejected successfully!');
    
    // Update the mock data
    this.pendingClaims$ = of(0);
    this.rejectedClaims$ = of(1);
  }

  revertClaim(claimId: string): void {
    // Mock implementation for Phase 1
    console.log('Reverting claim decision:', claimId);
    alert('Claim decision reverted successfully!');
    
    // Update the mock data
    this.pendingClaims$ = of(1);
    this.approvedClaims$ = of(1);
    this.rejectedClaims$ = of(0);
  }

  viewEntity(entityId: string): void {
    this.router.navigate(['/entities', entityId]);
  }
}
