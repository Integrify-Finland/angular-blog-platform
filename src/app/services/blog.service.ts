// src/app/services/blog.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog, CreateBlog, UpdateBlog } from '../models/blog.type';
import { Observable, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private http = inject(HttpClient);

  blogs = signal<Blog[]>([]);

  private URL = 'http://localhost:3000/blogs';

  findAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.URL).pipe(
      catchError((err) => { console.error(err); throw err; })
    );
  }

  findOneBlog(id: number | string): Observable<Blog> {
    return this.http.get<Blog>(`${this.URL}/${id}`).pipe(
      catchError((err) => { console.error(err); throw err; })
    );
  }

  createBlog(payload: CreateBlog): Observable<Blog> {
    return this.http.post<Blog>(this.URL, payload).pipe(
      catchError((err) => { console.error(err); throw err; })
    );
  }

  updateBlog(id: number, payload: UpdateBlog): Observable<Blog> {
    return this.http.patch<Blog>(`${this.URL}/${id}`, payload).pipe(
      catchError((err) => { console.error(err); throw err; })
    );
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      catchError((err) => { console.error(err); throw err; })
    );
  }
}
