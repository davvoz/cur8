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

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenav, MatNavList, MatListItem, MatIcon, NgFor, MatDivider, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  items = [
    { name: 'Dashboard', url: '/home', icon: '', label: 'Dashboard', image: '../assets/logoTra.png' },
    //{ name: 'Blocks-explorer', url: '/blocks-explorer', icon: 'line_style', label: 'Block Explorer'},mat-skeleton\src\assets\steem_traspa_piccola.png
    //{ name: 'Contact', url: '/contact', icon: 'contacts', label: 'contacts' },
    { name: 'Profile', url: '/login', icon: '', label: 'Profile', image: '../assets/hive_.png' },
    //{ name: 'Profile', url: '/profile', icon: 'account_circle', label: 'account' },
    //{ name: 'Settings', url: '/settings', icon: 'settings', label: 'Settings' },
    //{ name: 'Logout', url: '/logout', icon: 'logout', label: 'Logout' }
  ];

  constructor(private router: Router) {
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }


}
