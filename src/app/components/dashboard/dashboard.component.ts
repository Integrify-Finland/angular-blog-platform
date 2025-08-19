import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.type';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogFormComponent } from '../blog-form/blog-form.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, BlogFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  blogService = inject(BlogService)
  blogs = computed<Blog[]>(()=> this.blogService.blogs())
  loading = true;

  showForm = signal(false);
  submitting = signal(false);

  editingBlog = signal<Blog | null>(null);
  submittingEdit = signal(false); 

  pendingDelete = signal<Blog | null>(null);
  deleting = signal(false);

  ngOnInit(): void {
    if (this.blogs().length > 0) {
      this.loading = false;
      return;
    }

    this.blogService.findAllBlogs().subscribe({
      next: (blogs) => {
        this.blogService.blogs.set(blogs);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggleForm() { this.showForm.update(v => !v); }

  startEdit(blog: Blog) {
    this.editingBlog.set(blog);
  }

  cancelEdit() {
    this.editingBlog.set(null);
  }

  startDelete(blog: Blog) {
    this.pendingDelete.set(blog);
  }
  cancelDelete() {
    this.pendingDelete.set(null);
    this.deleting.set(false);
  }
  confirmDelete() {
    const target = this.pendingDelete();
    if (!target) return;
    this.deleting.set(true);
    this.blogService.deleteBlog(target.id).subscribe({
      next: () => {
        this.blogService.blogs.update(list => list.filter(b => b.id !== target.id));
        this.deleting.set(false);
        this.pendingDelete.set(null);
      },
      error: () => this.deleting.set(false),
    });
  }

}
