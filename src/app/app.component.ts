import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-navbar {
      background: linear-gradient(90deg, #0d47a1 0%, #1976d2 100%);
      color: #ffffff;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(13, 71, 161, 0.2);
    }
    .navbar-inner {
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: 0.2px;
    }
    .nav-item {
      color: rgba(255, 255, 255, 0.92) !important;
      font-weight: 500;
      border-radius: 8px;
    }
    .active-nav-link {
      background: rgba(255, 255, 255, 0.18);
    }
    .navbar-right {
      display: flex;
      align-items: center;
    }
    .user-avatar-btn {
      color: #ffffff;
    }
    .user-avatar-btn mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .app-content {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .app-footer {
      background: #0f172a;
      color: #e2e8f0;
      text-align: center;
      padding: 16px;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
  `]
})
export class AppComponent {}
