import { Routes } from '@angular/router';
import { HiveComponent } from './components/hive/hive.component';
import { HomeSteemComponent } from './components/home-steem/home-steem.component';
import { HomeComponent } from './components/home/home.component';
import { SteemComponent } from './components/steem/steem.component';

export const routes: Routes = [
    { path: 'home-hive', component: HomeComponent },
    { path: 'home-steem', component: HomeSteemComponent },
    { path: 'hive', component: HiveComponent },
    { path: 'steem', component: SteemComponent },
    //redirect to home-hive
    { path: '', redirectTo: 'home-hive', pathMatch: 'full' }
];

