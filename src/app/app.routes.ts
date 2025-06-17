import { Routes } from "@angular/router";
import { authGuard } from "./iam/guards/auth.guard";
import { preventAuthGuard } from "./iam/guards/prevent-auth.guard";

import { LayoutComponent } from "./core/layout/layout.component";
import { AuthLayoutComponent } from "./iam/layout/auth-layout/auth-layout.component";
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";

import { SignUpComponent } from "./iam/pages/sign-up/sign-up.component";
import { SignInComponent } from "./iam/pages/sign-in/sign-in.component";
import {SignInTwoFactorComponent} from './iam/pages/sign-in-two-factor/sign-in-two-factor.component';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "home",
        loadComponent: () =>
          import("./public/pages/home/home.component").then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: "diets",
        loadComponent: () =>
          import(
            "./core/pages/diets-management/diets-management.component"
            ).then((m) => m.DietsManagementComponent),
      },
      {
        path: "routines",
        loadComponent: () =>
          import(
            "./core/pages/routines-management/routines-management.component"
            ).then((m) => m.RoutinesManagementComponent),
      },
      {
        path: "planner",
        loadComponent: () =>
          import(
            "./core/pages/planner-management/planner-management.component"
            ).then((m) => m.PlannerManagementComponent),
      },
      {
        path: "profile",
        loadComponent: () =>
          import(
            "./core/pages/profile-management/profile-management.component"
            ).then((m) => m.ProfileManagementComponent),
      },
      {
        path: "exercises",
        loadComponent:()=>
          import(
            "./core/pages/exercises-management/exercises-management.component"
            ).then((m)=>m.ExercisesManagementComponent),
      }
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    canActivate: [preventAuthGuard],
    children: [
      { path: "sign-up", component: SignUpComponent },
      { path: "sign-in", component: SignInComponent },
      { path: "sign-in-two-factor", component: SignInTwoFactorComponent },
      {
        path: "forgot-password",
        loadComponent: () =>
          import("./iam/pages/forgot-password/forgot-password.component").then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: "reset-password",
        loadComponent: () =>
          import("./iam/pages/reset-password/reset-password.component").then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
  { path: "**", component: PageNotFoundComponent },
];
