import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HiveComponent } from './hive/hive.component';
import { HomeSteemComponent } from './home-steem/home-steem.component';
import { SteemComponent } from './steem/steem.component';

export const routes: Routes = [
    { path: 'home-hive', component: HomeComponent },
    { path: 'home-steem', component: HomeSteemComponent },
    { path: 'hive', component: HiveComponent },
    { path: 'steem', component: SteemComponent },
    { path: '', redirectTo: '/home-hive', pathMatch: 'full' }
    ];
