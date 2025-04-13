import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = {
    userid: 12345,
    username: 'test_endre',
    rank: 'User',
    email: 'test@gmail.com',
    uploaded: { value: 1000, unit: 'GB' },
    downloaded: { value: 500, unit: 'GB' },
    registered: {
      year: 2025,
      month: 4,
      day: 9,
      hour: 12,
      minute: 30,
      second: 0
    },
  };

  constructor() { }

  ngOnInit(): void {
  }

  formatRegistrationDate(date: User['registered']): string {
    return `${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}`;
  }
}