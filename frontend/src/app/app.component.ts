import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router ,RouterOutlet} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatDialog } from '@angular/material/dialog';

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
    public dialog: MatDialog
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
