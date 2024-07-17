import { SnackbarService } from './../../services/snackbar.service';
import { Component } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { MESSAGES } from '../../constants';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatSidenav, MatSidenavContainer, MatSidenavModule, RouterModule, MatListModule, FormsModule, MatFormFieldModule,NgIf],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})

export class AccountComponent {
  constructor(private authService: AuthService,private snackBarService: SnackbarService){}
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
        if (!this.isLoggedIn) {
          this.snackBarService.openProfileFailSnackBar(MESSAGES.profileFetchError);
        }
      }
    );

    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

  }
}
