import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router ,RouterOutlet} from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    template: '<router-outlet></router-outlet>',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  data: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const dialog = params['d'];
      if (dialog) {
        if (dialog === 'register') {
          this.openRegisterDialog();
        } else if (dialog === 'login') {
          this.openLoginDialog();
        }
      }
    });
  }


  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
    });
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
    });
  }

}
