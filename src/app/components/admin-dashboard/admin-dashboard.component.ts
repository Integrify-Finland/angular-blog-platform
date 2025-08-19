import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.type';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private usersSvc = inject(UsersService);

  users = computed<User[]>(() => this.usersSvc.users());
  loading = signal(true);

  confirmingId = signal<number | null>(null);
  processingId = signal<number | null>(null);

  ngOnInit(): void {
    if (this.users().length > 0) { this.loading.set(false); return; }
    this.usersSvc.getAll().subscribe({
      next: list => { this.usersSvc.users.set(list); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  startConfirm(id: number) { this.confirmingId.set(id); }
  cancelConfirm() { this.confirmingId.set(null); }

  toggleBlock(u: User) {
    const target = !u.blocked;
    this.processingId.set(u.id);
    this.usersSvc.setBlocked(u.id, target).subscribe({
      next: updated => {
        this.usersSvc.users.update(list => list.map(x => x.id === updated.id ? updated : x));
        this.processingId.set(null);
        this.confirmingId.set(null);
      },
      error: () => this.processingId.set(null),
    });
  }
}
