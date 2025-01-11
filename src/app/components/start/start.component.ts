import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchService } from '../../services/switch.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';  // Add this import

@Component({
  selector: 'app-platform-dialog',
  template: `
    <div class="dialog-container">
      <mat-icon class="close-icon" (click)="dialogRef.close()">close</mat-icon>
      
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="title-icon">rocket_launch</mat-icon>
        Welcome to Cur8!
      </h2>
      
      <mat-dialog-content>
        <div class="main-content">
          <p class="primary-text">You can use our website normally to explore content and manage your account.</p>
          <p class="secondary-text">Or use our Telegram mini-apps for quick posting:</p>
          
          <div class="platform-buttons">
            <button mat-raised-button color="primary" (click)="openPlatform('hive')" class="platform-btn">
              <mat-icon>telegram</mat-icon>
              Post on Hive
            </button>
            <button mat-raised-button color="primary" (click)="openPlatform('steem')" class="platform-btn">
              <mat-icon>telegram</mat-icon>
              Post on Steem
            </button>
          </div>
          
          <button mat-button class="skip-btn" (click)="dialogRef.close()">
            Continue to website
          </button>
        </div>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      position: relative;
    }
    .close-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      &:hover {
        opacity: 1;
      }
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      margin-bottom: 24px;
    }
    .title-icon {
      color: #1976d2;
    }
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .primary-text {
      font-size: 16px;
      color: rgba(0,0,0,0.87);
    }
    .secondary-text {
      font-size: 14px;
      color: rgba(0,0,0,0.6);
    }
    .platform-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }
    .platform-btn {
      width: 100%;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .skip-btn {
      margin-top: 8px;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  `],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class PlatformDialogComponent {
  constructor(public dialogRef: MatDialogRef<PlatformDialogComponent>) {}

  openPlatform(platform: string): void {
    this.dialogRef.close(platform);
  }
}

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, MatDialogModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  isMobile = false;
  lightTheme = true;

  constructor(
    private switchService: SwitchService,
    private dialog: MatDialog
  ) {
    this.isMobile = window.innerWidth <= 768;
    this.openDialog(); // Open dialog when component initializes
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PlatformDialogComponent, {
      width: '400px',
      disableClose: false,  // Allow closing by clicking outside
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(platform => {
      if (platform) {
        this.openTelegram(platform);
      }
    });
  }

  openTelegram(platform: string) {
    let url = '';
    if (platform === 'hive') {
      url = 'https://t.me/cur8_hiveBot';
    } else if (platform === 'steem') {
      url = 'https://t.me/cur8_steemBot';
    }
    window.open(url, '_blank');
  }

  toggle() {
    if (this.switchService.platform === 'STEEM') {
      document.documentElement.setAttribute('theme', 'light');
      this.switchService.switchPlatform();
      this.lightTheme = true;
    }
    if (this.switchService.platform === 'HIVE') {
      document.documentElement.setAttribute('theme', '');
      this.switchService.switchPlatform();
      this.lightTheme = false;
    }
  }
}
