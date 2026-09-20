import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.user()?.RoleName === 'Admin') {
    return true;
  }
  
  return router.parseUrl('/app/dashboard');
};

