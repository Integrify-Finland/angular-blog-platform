import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.type';
import { catchError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private URL = 'http://localhost:3000/users';

  users = signal<User[]>([]);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.URL).pipe(
      catchError(err => { console.error(err); throw err; })
    );
  }

  setBlocked(id: number, blocked: boolean): Observable<User> {
    return this.http.patch<User>(`${this.URL}/${id}`, { blocked }).pipe(
      catchError(err => { console.error(err); throw err; })
    );
  }
}
