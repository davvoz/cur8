import { Component } from '@angular/core';
//importa navlist
import { MatSidenav } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
//ngIf
import { NgIf } from '@angular/common';
import { SwitchService } from '../../../services/switch.service';
import { SidebarService } from '../../../services/sidebar.service';
import { PrezziComponent } from "../../prezzi/prezzi.component";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    imports: [MatSidenav, MatNavList, MatListItem, MatIcon, NgFor, MatDivider, NgIf, PrezziComponent]
})
export class SidebarComponent {

  itemsHive = [
    { name: 'Dashboard', url: '/home-hive', icon: '', label: 'HIVE', image: '../assets/logoTra.png' },
    { name: 'Profile', url: '/hive', icon: '', label: 'Profile', image: '../assets/hive_.png' },
  ];

  itemsSteem = [
    { name: 'Dashboard', url: '/home-steem', icon: '', label: 'STEEM', image: '../assets/logoTra.png' },
    { name: 'Profile', url: '/steem', icon: '', label: 'Profile', image: '../assets/steem_traspa_piccola.png' },
  ];

  items = this.itemsHive;
  platform = 'hive';

  constructor(private router: Router,public switchService: SwitchService,private sidebarService: SidebarService) {
    
    this.switchService.switchEmitter.subscribe((platform: string) => {
      this.platform = platform;
      this.items = platform === 'HIVE' ? this.itemsHive : this.itemsSteem;
      this.navigateTo(this.items[0].url);
    });
  }

  navigateTo(url: string) {
   
    this.router.navigate([url]);
  }


}
