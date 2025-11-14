import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, getCurrentUser, getUserById, mockUsers } from '../mock';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize with a mock user for Phase 1 testing
    this.initializeMockUser();
  }

  private initializeMockUser(): void {
    // For Phase 1, we'll start with no user logged in
    // Users can switch between different mock users for testing
    this.currentUserSubject.next(null);
  }

  // Mock authentication methods for Phase 1
  async signInWithEmailLink(email: string): Promise<void> {
    // Simulate sending email link
    console.log(`Mock: Email link sent to ${email}`);
    
    // For testing purposes, automatically sign in after a delay
    setTimeout(() => {
      const mockUser = mockUsers.find(u => u.email === email) || mockUsers[0];
      this.currentUserSubject.next(mockUser);
      console.log(`Mock: Signed in as ${mockUser.displayName}`);
    }, 1000);
  }

  async signInWithGoogle(): Promise<void> {
    // Simulate Google sign-in
    console.log('Mock: Google sign-in initiated');
    
    // For testing, sign in as a mock user
    setTimeout(() => {
      const mockUser = mockUsers[0]; // John Doe
      this.currentUserSubject.next(mockUser);
      console.log(`Mock: Signed in with Google as ${mockUser.displayName}`);
    }, 1000);
  }

  async signOut(): Promise<void> {
    // Simulate sign-out
    console.log('Mock: Signing out');
    this.currentUserSubject.next(null);
  }

  // Test method to switch between mock users
  switchMockUser(userId: string): void {
    const user = getUserById(userId);
    if (user) {
      this.currentUserSubject.next(user);
      console.log(`Mock: Switched to user ${user.displayName}`);
    }
  }

  // Test method to sign in as a specific mock user
  signInAsMockUser(userId: string): void {
    const user = getUserById(userId);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === 'admin' : false;
  }

  isOwner(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === 'owner' || user.role === 'admin' : false;
  }

  isRegularUser(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === 'regular' || user.role === 'owner' || user.role === 'admin' : false;
  }

  // Simulate completing email link sign-in
  completeSignInWithEmailLink(email: string, code: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = mockUsers.find(u => u.email === email) || mockUsers[0];
        this.currentUserSubject.next(mockUser);
        console.log(`Mock: Completed email link sign-in for ${mockUser.displayName}`);
        resolve();
      }, 500);
    });
  }

  // Simulate sending verification email
  async sendVerificationEmail(): Promise<void> {
    console.log('Mock: Verification email sent');
  }

  // Simulate password reset
  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log(`Mock: Password reset email sent to ${email}`);
  }
}