import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navigation">
      <div class="container">
        <div class="nav-content">
          <!-- Logo -->
          <div class="nav-brand">
            <a routerLink="/" class="brand-link">
              <span class="brand-text">ReviewApp</span>
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="nav-links">
            <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              Home
            </a>
            <a routerLink="/entities" class="nav-link" routerLinkActive="active">
              Explore
            </a>
            <a routerLink="/write-review" class="nav-link" routerLinkActive="active">
              Write Review
            </a>
          </div>

          <!-- User Menu -->
          <div class="nav-user">
            <!-- Anonymous User -->
            <div class="user-menu" *ngIf="!authService.isLoggedIn">
              <a routerLink="/login" class="btn btn-outline btn-sm">
                Sign In
              </a>
            </div>

            <!-- Logged In User -->
            <div class="user-menu" *ngIf="authService.isLoggedIn">
              <div class="user-dropdown" [class.open]="isDropdownOpen">
                <button class="user-trigger" (click)="toggleDropdown()">
                  <div class="user-avatar">
                    {{ getInitials() }}
                  </div>
                  <span class="user-name">{{ authService.currentUser?.displayName }}</span>
                  <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <div class="dropdown-menu">
                  <!-- Owner Links -->
                  <div class="dropdown-section" *ngIf="authService.isOwner()">
                    <div class="dropdown-title">Owner</div>
                    <a routerLink="/owner/dashboard" class="dropdown-item" (click)="closeDropdown()">
                      Dashboard
                    </a>
                  </div>

                  <!-- Admin Links -->
                  <div class="dropdown-section" *ngIf="authService.isAdmin()">
                    <div class="dropdown-title">Admin</div>
                    <a routerLink="/admin" class="dropdown-item" (click)="closeDropdown()">
                      Admin Panel
                    </a>
                  </div>

                  <!-- User Links -->
                  <div class="dropdown-section">
                    <div class="dropdown-title">Account</div>
                    <button class="dropdown-item" (click)="logout()">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-toggle" (click)="toggleMobileMenu()">
            <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu" [class.open]="isMobileMenuOpen">
          <div class="mobile-links">
            <a routerLink="/" class="mobile-link" (click)="closeMobileMenu()" routerLinkActive="active">
              Home
            </a>
            <a routerLink="/entities" class="mobile-link" (click)="closeMobileMenu()" routerLinkActive="active">
              Explore
            </a>
            <a routerLink="/write-review" class="mobile-link" (click)="closeMobileMenu()" routerLinkActive="active">
              Write Review
            </a>
            
            <!-- Mobile User Links -->
            <div class="mobile-user-section" *ngIf="authService.isLoggedIn">
              <div class="mobile-user-info">
                <div class="mobile-user-avatar">
                  {{ getInitials() }}
                </div>
                <span class="mobile-user-name">{{ authService.currentUser?.displayName }}</span>
              </div>
              
              <div class="mobile-user-links">
                <a routerLink="/owner/dashboard" class="mobile-link" (click)="closeMobileMenu()" *ngIf="authService.isOwner()">
                  Owner Dashboard
                </a>
                <a routerLink="/admin" class="mobile-link" (click)="closeMobileMenu()" *ngIf="authService.isAdmin()">
                  Admin Panel
                </a>
                <button class="mobile-link mobile-logout" (click)="logout(); closeMobileMenu()">
                  Sign Out
                </button>
              </div>
            </div>
            
            <div class="mobile-auth" *ngIf="!authService.isLoggedIn">
              <a routerLink="/login" class="btn btn-primary btn-full" (click)="closeMobileMenu()">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navigation {
      background: white;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
    }

    .nav-brand {
      flex-shrink: 0;
    }

    .brand-link {
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.25rem;
    }

    .brand-text {
      background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: var(--text-primary);
    }

    .nav-link.active {
      color: var(--primary-color);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-color);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-menu {
      position: relative;
    }

    .user-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-trigger:hover {
      border-color: var(--primary-color);
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-name {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .dropdown-icon {
      width: 1rem;
      height: 1rem;
      transition: transform 0.2s;
    }

    .user-dropdown.open .dropdown-icon {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s;
      margin-top: 0.5rem;
    }

    .user-dropdown.open .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-section {
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }

    .dropdown-section:last-child {
      border-bottom: none;
    }

    .dropdown-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.5rem;
      border: none;
      background: none;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .dropdown-item:hover {
      background: var(--surface-color);
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--text-primary);
    }

    .menu-icon {
      width: 1.5rem;
      height: 1.5rem;
    }

    .mobile-menu {
      display: none;
      background: white;
      border-top: 1px solid var(--border-color);
      padding: 1rem 0;
    }

    .mobile-menu.open {
      display: block;
    }

    .mobile-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-link {
      padding: 0.75rem 0;
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      transition: color 0.2s;
    }

    .mobile-link:hover {
      color: var(--primary-color);
    }

    .mobile-link.active {
      color: var(--primary-color);
      font-weight: 600;
    }

    .mobile-auth {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .mobile-user-section {
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
    }

    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .mobile-user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .mobile-user-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .mobile-user-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-left: 3.5rem;
    }

    .mobile-logout {
      color: var(--error-color);
    }

    .btn-full {
      width: 100%;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .nav-user {
        display: none;
      }

      .mobile-toggle {
        display: block;
      }

      .nav-link.active::after {
        display: none;
      }

      .mobile-link.active {
        position: relative;
        padding-left: 1rem;
      }

      .mobile-link.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 1.5rem;
        background: var(--primary-color);
        border-radius: 0 2px 2px 0;
      }
    }

    @media (max-width: 640px) {
      .nav-content {
        padding: 0.75rem 0;
      }

      .brand-text {
        font-size: 1.125rem;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class NavigationComponent {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  getInitials(): string {
    const user = this.authService.currentUser;
    if (!user) return '?';
    return user.displayName.charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeDropdown();
  }
}