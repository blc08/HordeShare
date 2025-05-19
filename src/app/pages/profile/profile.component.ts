import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'; 
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User, UserService, userStats } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userStats: userStats | null = null;
  ratio: number = 0;
  
  private userSubscription: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.getCurrentUserData().subscribe({
      next: ({ profile, stats, ratio }) => {
        this.user = profile;
        this.userStats = stats;
        this.ratio = ratio;
      },
      error: (err) => console.error('Hiba a felhasználói adatok betöltésekor:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  formatRegistrationDate(date: User['registered'] | undefined): string {
    if (!date) return 'N/A';
    // Ensure two digits for hour, minute, second if needed
    const pad = (num: number) => num < 10 ? '0' + num : num;
    return `${date.year}-${pad(date.month)}-${pad(date.day)} ${pad(date.hour)}:${pad(date.minute)}:${pad(date.second)}`;
  }
  
  // Arány formázása olvasható formára
  formatRatio(ratio: number): string {
    if (ratio === Infinity) return '∞';
    return ratio.toFixed(2);
  }
  
  // Seed score színének meghatározása
  getSeedScoreColor(score: number): string {
    if (score >= 80) return 'primary'; // Kiváló - kék
    if (score >= 60) return 'accent';  // Jó - sárga/narancs
    return 'warn';                     // Gyenge - piros
  }
}