import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { SwitchService } from '../../../services/switch.service';
import { PrezziComponent } from "../../prezzi/prezzi.component";
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [MatSidenav, MatNavList, MatListItem, MatIcon, NgFor, MatDivider, NgIf, PrezziComponent]
})
export class SidebarComponent {


  itemsHive = [
    { name: 'start', url: '/start', icon: 'home', label: 'welcome' },
    { name: 'Dashboard', url: '/home-hive', icon: 'dashboard', label: 'HIVE', image: '../assets/logoTra.png' },
    { name: 'Profile', url: '/hive', icon: 'account_circle', label: 'Profile', image: '../assets/hive_.png' },
    //transazioni
    //  { name: 'Transactions', url: '/transazioni-hive', icon: 'list', label: 'Transactions',image: '../assets/hive_.png' },
    //lista post
    // { name: 'Posts', url: '/lista-post', icon: 'list', label: 'Posts' }
  ];

  itemsSteem = [
    { name: 'start', url: '/start', icon: 'home', label: 'welcome' },
    { name: 'Dashboard', url: '/home-steem', icon: 'dashboard', label: 'STEEM', image: '../assets/logoTra.png' },
    { name: 'Profile', url: '/steem', icon: 'account_circle', label: 'Profile', image: '../assets/steem_traspa_piccola.png' },
    //transazioni
    //  { name: 'Transactions', url: '/transazioni-cur8-steem', icon: 'list', label: 'Transactions', image: '../assets/steem_traspa_piccola.png' }
  ];

  items = this.itemsHive;
  platform = 'HIVE';
  textPost = ' section';
  text = () => this.platform + this.textPost;
  constructor(private router: Router, public switchService: SwitchService, private sidebarService: SidebarService) {
    this.switchService.switchEmitter.subscribe((platform: string) => {
      this.platform = platform;
      this.items = platform === 'HIVE' ? this.itemsHive : this.itemsSteem;

    });
  }

  navigateTo(url: string) {
    //se sei su mobile chiudi la sidebar
    if (window.innerWidth <= 768) {
      this.sidebarService.toggle();
    }
    this.router.navigate([url]);
  }


}
