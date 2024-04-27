import { Component, HostBinding } from '@angular/core';
//importa la toolbar de material
import { MatToolbar } from '@angular/material/toolbar';
//importa la row
import { MatToolbarRow } from '@angular/material/toolbar';
import { SidebarService } from '../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
//mat-slide
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSlideToggleModule, MatToolbar, MatToolbarRow, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private sidebarservice: SidebarService) { }
  get lightTheme(): boolean {
    return document.documentElement.getAttribute('theme') === 'light';
  }

  toggle() {
    if (this.lightTheme) {
      document.documentElement.setAttribute('theme', '');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
  }

  toggleSidebar() {
    this.sidebarservice.toggle();
  }
}
