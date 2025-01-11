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
import { call } from 'web3/lib/commonjs/eth.exports';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [ MatNavList,  MatIcon, NgFor, NgIf, PrezziComponent]
})
export class SidebarComponent {

  welcome = { name: 'start', url: '/start', icon: 'home', label: 'Welcome' , image: ''};
  itemsHive = [
    this.welcome,
    { name: 'Dashboard', url: '/home-hive', icon: '', label: 'Dashboard HIVE', image: '../assets/logoTra.png' },
    { name: 'Profile', url: '/hive', icon: '', label: 'Profile', image: '../assets/hive_.png' },
    { name: 'Telegram', url: 'https://t.me/cur8_hiveBot', icon: '', label: 'Telegram', image: '../assets/telegram.png', isExternal: true }
  ];

  itemsSteem = [
    this.welcome,
    { name: 'Dashboard', url: '/home-steem', icon: '', label: 'Dashboard STEEM', image: '../assets/logoTra.png' },
    { name: 'Profile', url: '/steem', icon: '', label: 'Profile', image: '../assets/steem_traspa_piccola.png' },
    { name: 'Telegram', url: 'https://t.me/cur8_steemBot', icon: '', label: 'Telegram', image: '../assets/telegram.png', isExternal: true }
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
    if (url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      //se sei su mobile chiudi la sidebar
      if (window.innerWidth <= 768) {
        this.sidebarService.toggle();
      }
      this.router.navigate([url]);
    }
  }

}
