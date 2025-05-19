import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
  updateProfile
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;
  
  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.currentUser = authState(this.auth);
  }
  
  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  updateUserProfile(displayName: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      return updateProfile(user, { displayName });
    }
    return Promise.reject(new Error('No authenticated user!'));
  }
  
  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }
  
  isLoggedIn(): Observable<User | null> {
    console.log(this.currentUser);
    return this.currentUser;
  }
  
  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }
}