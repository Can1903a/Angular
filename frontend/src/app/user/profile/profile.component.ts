import { Component, NgModule, OnInit } from '@angular/core';
import { AccountComponent } from "../account/account.component";
import { MatCard } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormField, MatLabel, MatFormFieldControl } from '@angular/material/form-field';
import { ProfileService } from '../../services/profile.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AccountComponent,ProfileComponent,MatCard,MatTabsModule,MatFormField,MatLabel,FormsModule,ReactiveFormsModule,MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user?: User;
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(user => {
      this.user = user;
    });
  }

  changePassword(): void {
    this.profileService.changePassword(this.currentPassword, this.newPassword).subscribe(response => {
      console.log('Şifre başarıyla değiştirildi', response);
    }, error => {
      console.error('Şifre değiştirilemedi', error);
    });
  }
}
export interface User {
  _id: string;
  Musteriler_Adi: string;
  Musteriler_Soyadi: string;
  Musteriler_Tc: string;
  Musteriler_Sifre: string;
  Musteriler_Email: string;
  Musteriler_Telefon: string;
  isAdmin:boolean;
}
