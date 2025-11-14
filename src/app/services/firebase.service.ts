import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: any;
  private auth: any;
  private firestore: any;
  private storage: any;
  private functions: any;
  private initialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize Firebase
      this.app = initializeApp(firebaseConfig);
      
      // Initialize services
      this.auth = getAuth(this.app);
      this.firestore = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.functions = getFunctions(this.app);

      // Connect to emulators in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.connectToEmulators();
      }

      this.initialized = true;
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  private connectToEmulators(): void {
    try {
      // Connect to Authentication emulator
      connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true });
      
      // Connect to Firestore emulator
      connectFirestoreEmulator(this.firestore, 'localhost', 8080);
      
      // Connect to Storage emulator
      connectStorageEmulator(this.storage, 'localhost', 9199);
      
      // Connect to Functions emulator
      connectFunctionsEmulator(this.functions, 'localhost', 5001);
      
      console.log('Connected to Firebase emulators');
    } catch (error) {
      console.error('Error connecting to Firebase emulators:', error);
    }
  }

  getAuth() {
    return this.auth;
  }

  getFirestore() {
    return this.firestore;
  }

  getStorage() {
    return this.storage;
  }

  getFunctions() {
    return this.functions;
  }

  getApp() {
    return this.app;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}