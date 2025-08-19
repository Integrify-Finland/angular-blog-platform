import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  mobileOpen = false;
  toggleMobile() { this.mobileOpen = !this.mobileOpen; }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
