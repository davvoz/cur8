import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlocksExplorerComponent } from './blocks-explorer/blocks-explorer.component';
import { HiveComponent } from './hive/hive.component';
// items = [
//     { name: 'Home', url: '/home', icon: 'home', label: 'Home' },
//     { name: 'About', url: '/about', icon: 'info', label: 'About' },
//     { name: 'Contact', url: '/contact', icon: 'contact', label: 'Contact' },
//     { name: 'Login', url: '/login', icon: 'login', label: 'Login' },
//     { name: 'Register', url: '/register', icon: 'register', label: 'Register' },
//     { name: 'Profile', url: '/profile', icon: 'profile', label: 'Profile' },
//     { name: 'Settings', url: '/settings', icon: 'settings', label: 'Settings' },
//     { name: 'Logout', url: '/logout', icon: 'logout', label: 'Logout' }
//   ];

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'blocks-explorer', component: BlocksExplorerComponent },
    { path: 'contact', component: HomeComponent },
    { path: 'login', component: HiveComponent },
    { path: 'register', component: HomeComponent },
    { path: 'profile', component: HomeComponent },
    { path: 'settings', component: HomeComponent },
    { path: 'logout', component: HomeComponent }
    ];
