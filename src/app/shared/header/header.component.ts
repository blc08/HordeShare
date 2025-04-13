import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatIconModule,
    CommonModule
  ],
  template: `
    <app-header 
      [username]="'JohnDoe'"
      [rank]="'Gold Member'"
      [isLoggedIn]="true"
      [uploadData]="'3.2 TB'"
      [downloadData]="'1.8 TB'"
      [ratio]="1.78">
    </app-header>
  `
})
export class HeaderComponent {
  constructor() {
  }
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
    ratio = 3.4;
  
}