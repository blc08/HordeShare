import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { userStats } from '../../../interfaces/userStats';

@Component({
  selector: 'app-seed-stats',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
],
  templateUrl: './seed-stats.component.html',
  styleUrl: './seed-stats.component.scss'
})
export class SeedStatsComponent {
  @Input() userStats: userStats = {
    totalTorrents: 0,
    activeTorrents: 0,
    hitAndRunWarnings: 0,
    completedTorrents: 0,
    averageSeedRatio: 0,
    overallSeedScore: 0
  };
  
  getScoreClass(score: number): string {
    if (score >= 90) return 'excellent-score';
    if (score >= 70) return 'good-score';
    if (score >= 50) return 'average-score';
    return 'poor-score';
  }
}
