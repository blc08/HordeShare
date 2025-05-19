import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { User, UserService, userStats } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userStats: userStats | null = null;
  ratio: number = 0;
  isLoggedIn: boolean = false;
  
  private userSubscription: Subscription | undefined;
  
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Feliratkozás a felhasználó adatokra
    this.userSubscription = this.userService.getCurrentUserData().subscribe({
      next: ({ profile, stats, ratio }) => {
        this.user = profile;
        this.userStats = stats;
        this.ratio = ratio;
        this.isLoggedIn = !!profile;
      },
      error: (err) => {
        console.error('Hiba a felhasználói adatok betöltésekor:', err);
        this.isLoggedIn = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    // Feliratkozás törlése a memóriaszivárgás elkerülése érdekében
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  // Kijelentkezés metódus
  signOut(): void {
    this.authService.signOut().catch(error => console.error('Kijelentkezési hiba:', error));
  }
  
  // Arány formázása olvasható formára
  formatRatio(ratio: number): string {
    if (ratio === Infinity) return '∞';
    return ratio.toFixed(2);
  }
}