import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control('', [Validators.required]), // email OR username
  });

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { id } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(id).subscribe({
      next: () => { this.loading.set(false); this.router.navigateByUrl('/admin'); },
      error: (e) => { this.loading.set(false); this.error.set(e?.message ?? 'Login failed'); }
    });
  }
}
