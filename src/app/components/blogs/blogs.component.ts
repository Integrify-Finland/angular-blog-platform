import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.type';

@Component({
  selector: 'app-blogs',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit {
  blogService = inject(BlogService)
  blogs = computed<Blog[]>(()=> this.blogService.blogs())

  ngOnInit(): void {
    this.blogService.findAllBlogs().subscribe((blogs) => {
      this.blogService.blogs.set(blogs)
    });
  }
}
