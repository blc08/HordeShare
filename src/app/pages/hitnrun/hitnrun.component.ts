import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
// Example arrays
import { seedingTorrents_example, warningTorrents_example, completedTorrents_example } from './hitnrun_data_example';
import { SeedStatsComponent } from "./seed-stats/seed-stats.component";

import { userStats } from '../../interfaces/userStats';


interface TorrentItem {
  id: number;
  name: string;
  size: string;
  sizeBytes: number;
  uploadedDate: Date;
  seedTime: number;
  seedTimeRequired: number;
  seedProgress: number;
  seedRatio: number;
  ratioRequired: number;
  // status: 'Seeding' | 'Not Seeding' | 'Complete' | 'Warning';
  status: string;
  peers: number;
  category: string;
  warningDate?: Date;
}

@Component({
  selector: 'app-hitnrun',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    SeedStatsComponent
],
  templateUrl: './hitnrun.component.html',
  styleUrl: './hitnrun.component.scss'
})
export class HitNRunComponent implements OnInit {
  userStats: userStats = {
    totalTorrents: 0,
    activeTorrents: 0,
    hitAndRunWarnings: 0,
    completedTorrents: 0,
    averageSeedRatio: 0,
    overallSeedScore: 0
  }

  seedingTorrents: TorrentItem[] = [];
  warningTorrents: TorrentItem[] = [];
  completedTorrents: TorrentItem[] = [];

  displayedColumns: string[] = ['name', 'size', 'uploadedDate', 'seedTime', 'progress', 'ratio', 'status', 'actions'];
  
  // Paginator
  pageSize = 10;
  pageIndex = 0;
  
  constructor() {}

  ngOnInit(): void {
    this.loadMockData();
    this.calculateUserStats();
  }

  loadMockData(): void {
    this.seedingTorrents = seedingTorrents_example;
    
    this.warningTorrents = warningTorrents_example;
    
    this.completedTorrents = completedTorrents_example;
  }

  calculateUserStats(): void {
    const allTorrents = [...this.seedingTorrents, ...this.warningTorrents, ...this.completedTorrents];
    
    this.userStats.totalTorrents = allTorrents.length;
    this.userStats.activeTorrents = this.seedingTorrents.length;
    this.userStats.hitAndRunWarnings = this.warningTorrents.length;
    this.userStats.completedTorrents = this.completedTorrents.length;
    
    // Seed ratio
    const totalRatio = allTorrents.reduce((sum, torrent) => sum + torrent.seedRatio, 0);
    this.userStats.averageSeedRatio = totalRatio / allTorrents.length;
    
    const warnings = this.userStats.hitAndRunWarnings;
    const completed = this.userStats.completedTorrents;
    const avgRatio = this.userStats.averageSeedRatio;
    
    // Formula: base 70 points + completed bonus - warning penalty + ratio bonus
    this.userStats.overallSeedScore = Math.min(100, Math.max(0, 
      70 + (completed * 5) - (warnings * 15) + (avgRatio > 1 ? 10 : 0)
    ));
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Seeding': return 'accent';
      case 'Not Seeding': return 'warn';
      case 'Warning': return 'warn';
      case 'Complete': return 'primary';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Seeding': return 'cloud_upload';
      case 'Not Seeding': return 'pause_circle';
      case 'Warning': return 'warning';
      case 'Complete': return 'check_circle';
      default: return '';
    }
  }
  
  formatSeedTime(hours: number): string {
    if (hours < 24) {
      return `${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? 
        `${days} days, ${remainingHours} hrs` : 
        `${days} days`;
    }
  }

  startSeeding(torrent: TorrentItem): void {
    console.log('Start seeding', torrent.name);
    // todo: download .torrent file
  }

  handleSort(sort: Sort): void {
    console.log('Sort by', sort.active, 'in', sort.direction, 'order');
  }

  handlePage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  getDaysLeft(torrent: TorrentItem): number {
    const hoursLeft = torrent.seedTimeRequired - torrent.seedTime;
    return Math.ceil(hoursLeft / 24);
  }

  onStatsUpdated() {
    console.log('Szülő komponens értesült a frissítésről!');
    this.calculateUserStats(); // Frissítjük a statisztikákat
  }
  
}