import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatToolbarRow } from '@angular/material/toolbar';
import { SidebarService } from '../../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SwitchService } from '../../../services/switch.service';
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
    document.documentElement.setAttribute('theme', '');
    this.isMobile = window.innerWidth <= 768;
    // this.router.events.subscribe((val) => {
    //   if (this.router.url === '/steem' || this.router.url === '/home-steem' ) {
    //     document.documentElement.setAttribute('theme', 'light');
    //   }
    //   if (this.router.url === '/hive' || this.router.url === '/home-hive' ) {
    //     document.documentElement.setAttribute('theme', '');
    //   }
    // });
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
      }
    }
    if (platform === 'STEEM' && urlAttuale === '/hive') {
      //se siamo sul profilo hive navighiamo verso il profilo steem
      if (urlAttuale === '/hive') {
        this.router.navigate(['/steem']);
      }
    }
    if (platform === 'HIVE' && urlAttuale === '/home-steem') {
      //se siamo sulla dashboard steem navighiamo verso la dashboard hive
      if (urlAttuale === '/home-steem') {
        this.router.navigate(['/home-hive']);
      }
    }
    if (platform === 'STEEM' && urlAttuale === '/home-hive') {
      //se siamo sulla dashboard hive navighiamo verso la dashboard steem
      if (urlAttuale === '/home-hive') {
        this.router.navigate(['/home-steem']);
      }
    }
    //Se siamo sulle transazioni 
    if (platform === 'HIVE' && urlAttuale === '/transazioni-cur8-steem') {
      //se siamo sulle transazioni steem navighiamo verso le transazioni hive
      if (urlAttuale === '/transazioni-cur8-steem') {
        this.router.navigate(['/transazioni-hive']);
      }
    }
    if (platform === 'STEEM' && urlAttuale === '/transazioni-hive') {
      //se siamo sulle transazioni hive navighiamo verso le transazioni steem
      if (urlAttuale === '/transazioni-hive') {
        this.router.navigate(['/transazioni-cur8-steem']);
      }
    }
    //se sei su mobile apri la sidebar
    if ( this.sidebarservice.isOpen && urlAttuale === '/start') {
      this.sidebarservice.toggle();
    }

  }

  toggleSidebar() {
    this.sidebarservice.toggle();
  }
}
