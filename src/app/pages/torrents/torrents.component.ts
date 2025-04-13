import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { Torrent } from '../../interfaces/torrent';
import { torrentsData_example } from './torrents_data_example';

@Component({
  selector: 'app-torrents',
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule
  ]
})
export class TorrentsComponent implements OnInit {
  torrentsData: Torrent[] = torrentsData_example;

  filteredTorrents: Torrent[] = [];
  searchQuery: string = '';
  categoryFilter: string = 'all';
  sortBy: string = 'seeders';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Movies', value: 'Movies' },
    { name: 'TV Shows', value: 'TV Shows' },
    { name: 'Music', value: 'Music' },
    { name: 'eBook', value: 'eBook' },
    { name: 'Software', value: 'Software' },
    { name: 'Imageset', value: 'Imageset' }
  ];
  
  sortOptions = [
    { name: 'Seeders (High to Low)', value: 'seeders', direction: 'desc' },
    { name: 'Seeders (Low to High)', value: 'seeders', direction: 'asc' },
    { name: 'Size (High to Low)', value: 'size', direction: 'desc' },
    { name: 'Size (Low to High)', value: 'size', direction: 'asc' },
    { name: 'Date (Newest)', value: 'date', direction: 'desc' },
    { name: 'Date (Oldest)', value: 'date', direction: 'asc' }
  ];
  
  downloading: { [key: number]: boolean } = {};

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTorrents = this.torrentsData.filter(torrent => {
      const matchesSearch = torrent.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            torrent.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.categoryFilter === 'all' || torrent.category.name === this.categoryFilter;
      return matchesSearch && matchesCategory;
    });

    this.filteredTorrents.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'seeders') {
        comparison = a.seeders - b.seeders;
      } else if (this.sortBy === 'size') {
        comparison = a.size.value - b.size.value;
      } else if (this.sortBy === 'date') {
        const dateA = new Date(a.upload_date.year, a.upload_date.month - 1, a.upload_date.day);
        const dateB = new Date(b.upload_date.year, b.upload_date.month - 1, b.upload_date.day);
        comparison = dateA.getTime() - dateB.getTime();
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  handleDownload(torrent: Torrent, event: Event): void {
    event.stopPropagation(); // Prevent panel expansion when clicking download
    
    this.downloading[torrent.id] = true;
    
    setTimeout(() => {
      this.downloading[torrent.id] = false;
      this.snackBar.open(`Download started: ${torrent.name}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }, 1500);
    
    console.log(`Downloading ${torrent.name}`);
  }

  onSortChange(option: any): void {
    const selectedOption = this.sortOptions.find(opt => opt.name === option.value);
    if (selectedOption) {
      this.sortBy = selectedOption.value;
      this.sortDirection = selectedOption.direction as 'asc' | 'desc';
      this.applyFilters();
    }
  }

  formatDate(date: { day: number; month: number; year: number }): string {
    return `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`;
  }

  calculateHealth(seeders: number, leechers: number): number {
    if (seeders === 0 && leechers === 0) return 0;
    return Math.min(100, (seeders / (seeders + leechers)) * 100);
  }

  getHealthColor(percentage: number): string {
    if (percentage >= 75) return 'green';
    if (percentage >= 40) return 'orange';
    return 'red';
  }

  // default filters
  clearFilters(): void {
    this.searchQuery = '';
    this.categoryFilter = 'all';
    this.sortBy = 'seeders';
    this.sortDirection = 'desc';
    this.applyFilters();
  }
}