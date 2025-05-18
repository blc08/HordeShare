import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  public isLoggedIn$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Listen to authentication state changes
    this.isLoggedIn$ = this.afAuth.authState.pipe(
      map(user => !!user)
    );

    // Get auth data, then get firestore user document
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userData: User = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified
        };
        this.userSubject.next(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        this.userSubject.next(null);
        localStorage.removeItem('user');
      }
    });
  }

  // Sign in with email/password
  async signIn(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['home']);
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Sign up with email/password
  async signUp(email: string, password: string, displayName?: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      // Create user document in Firestore
      if (result.user) {
        await this.updateUserData({
          uid: result.user.uid,
          email: email,
          displayName: displayName || '',
          photoURL: '',
          emailVerified: false
        });
        
        // Update profile in Firebase Authentication
        await result.user.updateProfile({
          displayName: displayName || ''
        });
        
        this.router.navigate(['home']);
      }
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update user data in Firestore
  private updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    return userRef.set(user, { merge: true });
  }

  // Error handler
  private handleError(error: any): Promise<never> {
    console.error('Authentication error:', error);
    return Promise.reject(error);
  }
}