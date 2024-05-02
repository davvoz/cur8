import { Component } from '@angular/core';
import { SwitchService } from '../services/switch.service';
//mat slide toggle
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

  isMobile = false;
  lightTheme = true;

  constructor(private switchService: SwitchService) {
    this.isMobile = window.innerWidth <= 768;
  }

  toggle() {
    if (this.switchService.platform === 'STEEM') {
      document.documentElement.setAttribute('theme', 'light');
      this.switchService.switchPlatform('STEEM');
      this.lightTheme = true;
    } 
    if (this.switchService.platform === 'HIVE') {
      this.switchService.switchPlatform('HIVE');
      document.documentElement.setAttribute('theme', '');
      this.lightTheme = false;
    }
  }
}
