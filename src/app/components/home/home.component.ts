import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styles: [`
    .home-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 180px);
      padding: 24px 16px;
    }
    .welcome-card {
      max-width: 680px;
      width: 100%;
      padding: 48px 36px;
      text-align: center;
      border-radius: 16px;
      background: #ffffff;
      border-top: 5px solid #1565c0;
      box-shadow: 0 10px 30px rgba(21, 101, 192, 0.08);
    }
    .hero-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1565c0;
      margin: 0 auto 20px;
    }
    .hero-icon mat-icon {
      font-size: 38px;
      width: 38px;
      height: 38px;
    }
    .welcome-title {
      font-size: 1.9rem;
      font-weight: 700;
      color: #0d47a1;
      margin: 0 0 14px;
      line-height: 1.25;
    }
    .welcome-subtitle {
      font-size: 1.05rem;
      color: #475569;
      max-width: 540px;
      margin: 0 auto 32px;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .action-btn {
      padding: 0 24px;
      height: 44px;
      font-weight: 500;
    }
  `]
})
export class HomeComponent {}

