import { Component } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatSidenav,MatSidenavContainer,MatSidenavModule,RouterModule,MatListModule,FormsModule,MatFormFieldModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

}
