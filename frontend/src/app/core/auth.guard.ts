import { inject } from '@angular/core'; import { CanActivateFn, Router } from '@angular/router'; import { map } from 'rxjs'; import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = () => { const auth = inject(AuthService), router = inject(Router); return auth.check().pipe(map(ok => ok || router.createUrlTree(['/login']))); };
export const guestGuard: CanActivateFn = () => { const auth = inject(AuthService), router = inject(Router); return auth.check().pipe(map(ok => ok ? router.createUrlTree(['/app/dashboard']) : true)); };
export const mfaGuard: CanActivateFn = () => { const auth=inject(AuthService),router=inject(Router); return auth.mfaPending().pipe(map(r=>r.pending||router.createUrlTree(['/login']))); };
