import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'torrents',
        loadComponent: () => import('./pages/torrents/torrents.component').then(m => m.TorrentsComponent)
    },
    {
        path: 'hitnrun',
        loadComponent: () => import('./pages/hitnrun/hitnrun.component').then(m => m.HitNRunComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    },
];