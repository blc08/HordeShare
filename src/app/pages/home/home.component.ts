import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoggedIn = false;
  
  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  }
}