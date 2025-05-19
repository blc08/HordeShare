import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { Observable, from, of, forkJoin } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { serverTimestamp } from '@angular/fire/firestore';

export interface User {
  userid: string;
  username: string;
  email: string;
  rank: string;
  uploaded: {value: number, unit: string};
  downloaded: {value: number, unit: string};
  registered: {year: number, month: number, day: number, hour: number, minute: number, second: number};
}

export interface userStats {
  userid: string;
  totalTorrents: number;
  activeTorrents: number;
  hitAndRunWarnings: number;
  completedTorrents: number;
  averageSeedRatio: number;
  overallSeedScore: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  /**
   * Új felhasználó létrehozása a sikeres regisztráció után
   * @param uid - Firebase Auth UID
   * @param username - Felhasználónév
   * @param email - E-mail cím
   * @returns Promise a sikeres adatfeltöltésről
   */
  async createNewUser(uid: string, username: string, email: string): Promise<void> {
    try {
      const currentDate = this.getDefaultRegistrationDate();
      
      const userDocRef = doc(this.firestore, `Users/${uid}`);
      await setDoc(userDocRef, {
        username: username,
        email: email,
        rank: 'User',
        uploaded: { value: 0, unit: 'GB' },
        downloaded: { value: 0, unit: 'GB' },
        registered: currentDate,
        createdAt: serverTimestamp()
      });
      
      const statsDocRef = doc(this.firestore, `UserStats/${uid}`);
      await setDoc(statsDocRef, {
        totalTorrents: 0,
        activeTorrents: 0,
        hitAndRunWarnings: 0,
        completedTorrents: 0,
        averageSeedRatio: 0,
        overallSeedScore: 0,
        createdAt: serverTimestamp()
      });
      
      console.log('Felhasználó sikeresen létrehozva:', uid);
    } catch (error) {
      console.error('Hiba a felhasználó létrehozásakor:', error);
      throw error;
    }
  }

  /**
   * Felhasználónév ellenőrzése, hogy egyedi-e
   * @param username - Ellenőrizendő felhasználónév
   * @returns Promise<boolean> - true, ha egyedi, false, ha már létezik
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const usersRef = collection(this.firestore, 'Users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.empty;
    } catch (error) {
      console.error('Hiba a felhasználónév ellenőrzésekor:', error);
      throw error;
    }
  }

  /**
   * Felhasználói profil lekérése a Firestore-ból
   * @param uid - A felhasználó azonosítója
   * @returns Promise az alapvető felhasználói adatokkal vagy alapértelmezett értékekkel
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.firestore, `Users/${uid}`);
      const userSnapshot = await getDoc(userDocRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return {
          userid: uid,
          username: userData['username'] || 'Ismeretlen felhasználó',
          email: userData['email'] || 'N/A',
          rank: userData['rank'] || 'User',
          uploaded: userData['uploaded'] || { value: 0, unit: 'GB' },
          downloaded: userData['downloaded'] || { value: 0, unit: 'GB' },
          registered: userData['registered'] || this.getDefaultRegistrationDate()
        } as User;
      } else {
        console.warn(`Nincs felhasználói profil a következő azonosítóval: ${uid}`);
        return null;
      }
    } catch (error) {
      console.error('Hiba a felhasználói profil lekérésekor:', error);
      return null;
    }
  }

  /**
   * Felhasználói statisztikák lekérése a Firestore-ból
   * @param uid - A felhasználó azonosítója
   * @returns Promise a felhasználói statisztikákkal vagy alapértelmezett értékekkel
   */
  async getUserStats(uid: string): Promise<userStats | null> {
    try {
      const statsDocRef = doc(this.firestore, `UserStats/${uid}`);
      const statsSnapshot = await getDoc(statsDocRef);
      
      if (statsSnapshot.exists()) {
        const statsData = statsSnapshot.data();
        return {
          userid: uid,
          totalTorrents: statsData['totalTorrents'] || 0,
          activeTorrents: statsData['activeTorrents'] || 0,
          hitAndRunWarnings: statsData['hitAndRunWarnings'] || 0,
          completedTorrents: statsData['completedTorrents'] || 0,
          averageSeedRatio: statsData['averageSeedRatio'] || 0,
          overallSeedScore: statsData['overallSeedScore'] || 0
        } as userStats;
      } else {
        console.warn(`Nincs statisztika a következő felhasználóhoz: ${uid}`);
        return null;
      }
    } catch (error) {
      console.error('Hiba a felhasználói statisztikák lekérésekor:', error);
      return null;
    }
  }

  /**
   * Az aktuális bejelentkezett felhasználó összes adatának lekérése (profil és statisztikák)
   * @returns Observable a felhasználói profillal, statisztikákkal és számított aránnyal
   */
  getCurrentUserData(): Observable<{
    profile: User | null,
    stats: userStats | null,
    ratio: number
  }> {
    return this.authService.currentUser.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          return of({
            profile: null,
            stats: null,
            ratio: 0
          });
        }
        
        return forkJoin({
          profile: from(this.getUserProfile(firebaseUser.uid)),
          stats: from(this.getUserStats(firebaseUser.uid))
        }).pipe(
          map(({ profile, stats }) => {
            let ratio = 0;
            
            if (profile && profile.downloaded && profile.downloaded.value > 0) {
              ratio = Number((profile.uploaded.value / profile.downloaded.value).toFixed(2));
            } else if (profile && profile.uploaded.value > 0) {
              ratio = Infinity;
            }
            
            return { profile, stats, ratio };
          }),
          catchError(error => {
            console.error('Hiba a felhasználói adatok lekérdezése során:', error);
            return of({ profile: null, stats: null, ratio: 0 });
          })
        );
      })
    );
  }

  /**
   * Felhasználói profil és statisztikák lekérése UID alapján
   * @param uid - A felhasználó azonosítója
   * @returns Observable a felhasználói profillal, statisztikákkal és számított aránnyal
   */
  getUserData(uid: string): Observable<{
    profile: User | null,
    stats: userStats | null,
    ratio: number
  }> {
    return forkJoin({
      profile: from(this.getUserProfile(uid)),
      stats: from(this.getUserStats(uid))
    }).pipe(
      map(({ profile, stats }) => {
        let ratio = 0;
        
        if (profile && profile.downloaded && profile.downloaded.value > 0) {
          ratio = Number((profile.uploaded.value / profile.downloaded.value).toFixed(2));
        } else if (profile && profile.uploaded.value > 0) {
          ratio = Infinity;
        }
        
        return { profile, stats, ratio };
      }),
      catchError(error => {
        console.error('Hiba a felhasználói adatok lekérdezése során:', error);
        return of({ profile: null, stats: null, ratio: 0 });
      })
    );
  }

  /**
   * Az aktuális bejelentkezett felhasználó UID-jének lekérése
   * @returns Observable a felhasználó azonosítójával vagy null-lal
   */
  getCurrentUserId(): Observable<string | null> {
    return this.authService.currentUser.pipe(
      map(user => user ? user.uid : null)
    );
  }

  /**
   * Alapértelmezett regisztrációs dátum generálása (jelenlegi dátum)
   */
  private getDefaultRegistrationDate(): { year: number, month: number, day: number, hour: number, minute: number, second: number } {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    };
  }

  /**
   * Firebase auth idő string objektummá konvertálása
   */
  parseCreationTime(creationTime: string | undefined): { year: number, month: number, day: number, hour: number, minute: number, second: number } | null {
    if (!creationTime) return null;
    
    const date = new Date(creationTime);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
  }
}