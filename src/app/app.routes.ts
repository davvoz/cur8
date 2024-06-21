import { Routes } from '@angular/router';
import { HiveComponent } from './components/hive/hive.component';
import { HomeSteemComponent } from './components/home-steem/home-steem.component';
import { HomeComponent } from './components/home/home.component';
import { SteemComponent } from './components/steem/steem.component';
import { StartComponent } from './components/start/start.component';
import { TransazioniCur8Component } from './components/transazioni-cur8/transazioni-cur8.component';
import { TransazioniCur8SteemComponent } from './components/transazioni-cur8-steem/transazioni-cur8-steem.component';
import { ListaPostComponent } from './components/lista-post/lista-post.component';

export const routes: Routes = [
    { path: 'home-hive', component: HomeComponent },
    { path: 'home-steem', component: HomeSteemComponent },
    { path: 'hive', component: HiveComponent },
    { path: 'steem', component: SteemComponent },
    { path:'start', component: StartComponent },
    //transazioni-cur8
     { path: 'transazioni-hive', component: TransazioniCur8Component },
    { path: 'transazioni-cur8-steem', component: TransazioniCur8SteemComponent },
    //lista post
    { path: 'lista-post', component: ListaPostComponent },
    { path: '', redirectTo: '/start', pathMatch: 'full' }
];

