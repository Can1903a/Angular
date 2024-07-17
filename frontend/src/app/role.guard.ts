import { Injectable} from '@angular/core';
import { CanActivate, Router} from '@angular/router';

import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.checkAdminStatus()) {
      return true; // Admin kullanıcı, rotaya erişimine izin ver
    } else {
      this.router.navigate(['/home']); // Admin olmayan kullanıcı, home rotasına yönlendir
      return false;
    }
  }
}
