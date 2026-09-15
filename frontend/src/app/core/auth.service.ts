import { HttpClient, HttpInterceptorFn } from '@angular/common/http'; import { Injectable, signal } from '@angular/core'; import { catchError, map, Observable, of, tap } from 'rxjs';
export type User = { id: string; username: string; email: string; mfaEnabled: boolean };
@Injectable({ providedIn: 'root' }) export class AuthService {
  readonly user = signal<User | null>(null); constructor(private http: HttpClient) {}
  check(): Observable<boolean> { return this.http.get<{user: User}>('/api/auth/me').pipe(tap(r => this.user.set(r.user)), map(() => true), catchError(() => { this.user.set(null); return of(false); })); }
  login(body: {identifier:string; password:string}) { return this.http.post('/api/auth/login', body).pipe(tap(() => this.check().subscribe())); }
  logout() { return this.http.post('/api/auth/logout', {}).pipe(tap(() => this.user.set(null))); }
}
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => next(req.clone({ withCredentials: true }));
