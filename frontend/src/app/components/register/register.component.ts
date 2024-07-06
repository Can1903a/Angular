import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  surname: string = '';
  tc: string = '';
  email: string = '';
  tel: string = '';
  password: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) { }

  register(registerForm: any) {

    if (registerForm.invalid) {
      this.errorMessage = 'Lütfen tüm alanları doldurun';
      return;
    }


    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Şifreler uyuşmuyor';
      return;
    }
    const user = {
      name: this.name,
      surname: this.surname,
      tc: this.tc,
      email: this.email,
      tel: this.tel,
      password: this.password
    };

    this.authService.register(user).subscribe({
      next: (response: any) => {
        if (response.message === "User registered successfully") {
          this.successMessage = 'Kayıt başarılı!';
          this.router.navigate(['/login']);
          this.dialogRef.close();
        } else {
          this.errorMessage = 'Kayıt başarısız. Lütfen tekrar deneyin.';
        }
      },
      error: (error) => {
        console.error('Kayıt başarısız', error);
        this.errorMessage = 'Kayıt başarısız. Lütfen tekrar deneyin.';
      }
    });
  }
}
