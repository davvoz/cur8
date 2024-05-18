import { Routes } from '@angular/router';
import { HiveComponent } from './components/hive/hive.component';
import { HomeSteemComponent } from './components/home-steem/home-steem.component';
import { HomeComponent } from './components/home/home.component';
import { SteemComponent } from './components/steem/steem.component';
import { StartComponent } from './components/start/start.component';

export const routes: Routes = [
    { path: 'home-hive', component: HomeComponent },
    { path: 'home-steem', component: HomeSteemComponent },
    { path: 'hive', component: HiveComponent },
    { path: 'steem', component: SteemComponent },
    { path:'start', component: StartComponent },
    { path: '', redirectTo: '/start', pathMatch: 'full' }
];

