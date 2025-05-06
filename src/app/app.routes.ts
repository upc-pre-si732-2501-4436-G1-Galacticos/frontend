import { Routes } from '@angular/router';
import {LayoutComponent} from './core/layout/layout.component';
import {AuthLayoutComponent} from './iam/layout/auth-layout/auth-layout.component';
import {LoginComponent} from './iam/pages/login/login.component';
import {RegisterComponent} from './iam/pages/register/register.component';
import {PageNotFoundComponent} from './public/pages/page-not-found/page-not-found.component';
import {authGuard} from './iam/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./some/home.component').then(m => m.HomeComponent) },
      { path: 'diets', loadComponent: () => import('./some/diets.component').then(m => m.DietsComponent) },
      { path: 'routines', loadComponent: () => import('./some/routines.component').then(m => m.RoutinesComponent) },
      { path: 'planner', loadComponent: () => import('./some/planner.component').then(m => m.PlannerComponent) },
      { path: 'profile', loadComponent: () => import('./some/profile.component').then(m => m.ProfileComponent) },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
