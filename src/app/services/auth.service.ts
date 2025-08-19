import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Role } from '../models/user.type';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private URL = 'http://localhost:3000/users';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  isAuthenticated = computed(() => !!this.currentUser() && !!this.token());
  isAdminOrEditor = computed(() => {
    const u = this.currentUser();
    return !!u && !u.blocked && (u.role === 'admin' || u.role === 'editor');
  });

  constructor() { this.restore(); }

  login(identifier: string): Observable<User> {
    const key = identifier.includes('@') ? 'email' : 'username';
    const url = `${this.URL}?${key}=${encodeURIComponent(identifier)}`;

    return this.http.get<User[]>(url).pipe(
      map(list => list[0] ?? null),
      tap(user => {
        if (!user) throw new Error('User not found');
        if (user.blocked) throw new Error('Your account is blocked');
        this.currentUser.set(user);
        this.token.set('dummy-token');
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('authToken', 'dummy-token');
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  }

  hasAnyRole(roles: Role[]): boolean {
    const u = this.currentUser();
    return !!u && !u.blocked && roles.includes(u.role);
  }

  private restore() {
    try {
      const u = localStorage.getItem('authUser');
      const t = localStorage.getItem('authToken');
      if (u && t) {
        this.currentUser.set(JSON.parse(u) as User);
        this.token.set(t);
      }
    } catch {
      this.logout();
    }
  }
}
