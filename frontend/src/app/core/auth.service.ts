import { HttpClient, HttpInterceptorFn } from '@angular/common/http'; import { Injectable, signal } from '@angular/core'; import { catchError, map, Observable, of, tap } from 'rxjs';
export type User = { id: string; username: string; email: string; mfaEnabled: boolean };
@Injectable({ providedIn: 'root' }) export class AuthService {
  readonly user = signal<User | null>(null); constructor(private http: HttpClient) {}
  check(): Observable<boolean> { return this.http.get<{user: User}>('/api/auth/me').pipe(tap(r => this.user.set(r.user)), map(() => true), catchError(() => { this.user.set(null); return of(false); })); }
  login(body: {identifier:string; password:string}) { return this.http.post<{mfaRequired:boolean}>('/api/auth/login', body).pipe(tap(r => { if(!r.mfaRequired) this.check().subscribe(); })); }
  mfaPending() { return this.http.get<{pending:boolean}>('/api/auth/mfa/status'); }
  verifyMfa(code:string,recovery=false) { return this.http.post<void>(recovery?'/api/auth/mfa/recovery':'/api/auth/mfa/verify',{code}); }
  logout() { return this.http.post('/api/auth/logout', {}).pipe(tap(() => this.user.set(null))); }
}
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => next(req.clone({ withCredentials: true }));
