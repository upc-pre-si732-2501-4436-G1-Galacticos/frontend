import {Routes} from '@angular/router';
import {LayoutComponent} from './core/layout/layout.component';
import {AuthLayoutComponent} from './iam/layout/auth-layout/auth-layout.component';
import {SignUpComponent} from './iam/pages/sign-up/sign-up.component';
import {SignInComponent} from './iam/pages/sign-in/sign-in.component';
import {PageNotFoundComponent} from './public/pages/page-not-found/page-not-found.component';
import {authGuard} from './iam/guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'home', loadComponent: () => import('./public/pages/home/home.component').then(m => m.HomeComponent)},
      {
        path: 'diets',
        loadComponent: () => import('./core/pages/diets-management/diets-management.component').then(m => m.DietsManagementComponent)
      },
      {
        path: 'routines',
        loadComponent: () => import('./core/pages/routines-management/routines-management.component').then(m => m.RoutinesManagementComponent)
      },
      {
        path: 'planner',
        loadComponent: () => import('./core/pages/planner-management/planner-management.component').then(m => m.PlannerManagementComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./core/pages/profile-management/profile-management.component').then(m => m.ProfileManagementComponent)
      },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {path: 'sign-up', component: SignUpComponent},
      {path: 'sign-in', component: SignInComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];
