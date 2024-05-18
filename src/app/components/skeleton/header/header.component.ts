import { Component, HostBinding } from '@angular/core';
//importa la toolbar de material
import { MatToolbar } from '@angular/material/toolbar';
//importa la row
import { MatToolbarRow } from '@angular/material/toolbar';
import { SidebarService } from '../../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
//mat-slide
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SwitchService } from '../../../services/switch.service';
//ngIf
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSlideToggleModule, MatToolbar, MatToolbarRow, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMobile: any;

  constructor(private sidebarservice: SidebarService, public switchService: SwitchService, private router: Router) {
    this.isMobile = window.innerWidth <= 768;
  }
  get lightTheme(): boolean {
    return document.documentElement.getAttribute('theme') === 'light';
  }

  toggle(platform: string) {
    this.switchService.switch(platform);
    if (platform === 'HIVE') {
      document.documentElement.setAttribute('theme', '');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
    //navighiamo verso il componente steem o hive in base alla fatto che siamo sul profilo o sulla dashboard
    let urlAttuale = this.router.url;
    if (platform === 'HIVE' && urlAttuale === '/steem') {
      //se siamo sul profilo steem navighiamo verso il profilo hive
      if (urlAttuale === '/steem') {
        this.router.navigate(['/hive']);
      } else {
        //se siamo sulla dashboard steem navighiamo verso la dashboard hive
        this.router.navigate(['/home-hive']);
      }
    } else if (platform === 'STEEM' && urlAttuale === '/hive') {
      //se siamo sul profilo hive navighiamo verso il profilo steem
      if (urlAttuale === '/hive') {
        this.router.navigate(['/steem']);
      } else {
        //se siamo sulla dashboard hive navighiamo verso la dashboard steem
        this.router.navigate(['/home-steem']);
      }
    }



  }

  toggleSidebar() {
    this.sidebarservice.toggle();
  }
}
