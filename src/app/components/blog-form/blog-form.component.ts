import { Component, Input, Output, EventEmitter, inject, effect, computed, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Blog, UpdateBlog, CreateBlog } from '../../models/blog.type';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './blog-form.component.html',
})
export class BlogFormComponent {
  private blogService = inject(BlogService);

  blog = input<UpdateBlog>({
    title: '',
    date: '',
    authorId: 1,
    content: '',
  });

  isUpdate = input(false);
  @Input() blogId?: number;
  @Input() submitLabel = 'Create';
  @Input() busy = false;

  @Output() cancelled = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Blog>();

  blogForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    date: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    authorId: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  updateForm = effect(() => {
    const value = this.blog();
    this.blogForm.patchValue({
      title: value.title ?? '',
      date: value.date ?? '',
      authorId: (value.authorId ?? 1) as number,
      content: value.content ?? '',
    });
  });

  onCancel() {
    this.cancelled.emit();
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const v = this.blogForm.getRawValue();
    const payload: UpdateBlog = {
      title: v.title.trim(),
      date: v.date,
      authorId: Number(v.authorId),
      content: v.content.trim(),
    };

    if (this.isUpdate()) {
      if (this.blogId == null) {
        console.error('Missing blogId for update');
        return;
      }
      this.blogService.updateBlog(this.blogId, payload).subscribe({
        next: (updated) => {
          this.blogService.blogs.update(list =>
            list.map(b => (b.id === updated.id ? updated : b))
          );
          this.saved.emit(updated);
          this.onCancel();
        },
        error: (err) => console.error(err),
      });
      return;
    }

    this.blogService.createBlog(payload as CreateBlog).subscribe({
      next: (created) => {
        this.blogService.blogs.update(list => [created, ...list]);
        this.saved.emit(created);

        this.blogForm.reset({ title: '', date: '', authorId: 1, content: '' });
        this.blogForm.markAsPristine();
        this.blogForm.markAsUntouched();
      },
      error: (err) => console.error(err),
    });
  }
}
