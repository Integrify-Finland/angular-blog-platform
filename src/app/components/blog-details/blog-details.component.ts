import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Blog } from '../../models/blog.type';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-details',
  imports: [RouterLink],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {

  blog = signal<Blog>({
    id: 0,
    title: '',
    date: '',
    authorId: 0,
    content: '',
  });
  blogService = inject(BlogService)
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const blogId = params.get('id');
      if(!blogId) return;
      this.blogService.findOneBlog(blogId).subscribe(blog =>{
        this.blog.set(blog)
      })
    });
  }
}
