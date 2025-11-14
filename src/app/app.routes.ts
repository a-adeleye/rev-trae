import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'entities',
    loadComponent: () => import('./pages/entities/entities.component').then(m => m.EntitiesComponent)
  },
  {
    path: 'entities/:id',
    loadComponent: () => import('./pages/entity-detail/entity-detail.component').then(m => m.EntityDetailComponent)
  },
  {
    path: 'write-review',
    loadComponent: () => import('./pages/write-review/write-review.component').then(m => m.WriteReviewComponent)
  },
  {
    path: 'owner/dashboard',
    loadComponent: () => import('./pages/owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  }
];