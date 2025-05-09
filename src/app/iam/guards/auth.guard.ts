import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, take} from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);
  return authenticationService.isSignedIn.pipe(
    take(1),
    map(isSignedIn => {
      const token = localStorage.getItem('token');
      if (isSignedIn && token) return true;
      router.navigate(['/sign-in']).then();
      return false;
    }));
};
