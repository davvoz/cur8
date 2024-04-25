import { Component } from '@angular/core';
//importa la toolbar de material
import { MatToolbar } from '@angular/material/toolbar';
//importa la row
import { MatToolbarRow } from '@angular/material/toolbar';
import { SidebarService } from '../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatToolbarRow, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private sidebarservice: SidebarService) {

  }

  toggle() {
    this.sidebarservice.toggle();
  }

}
