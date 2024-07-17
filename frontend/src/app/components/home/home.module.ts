import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from '../login/login.component';
import { ProductsComponent } from '../products/products.component';
import { DialogGuard } from '../../dialog.guard';
import { RegisterComponent } from '../register/register.component';
import { ProfileComponent } from '../profile/profile.component';
import { AccountComponent } from '../account/account.component';

const routes: Routes = [
  {
  path: '', component: HomeComponent,children: [
    { path: 'products', component: ProductsComponent},
    { path: 'login', component: LoginComponent ,canActivate: [DialogGuard]},
    { path: 'register', component: RegisterComponent, canActivate: [DialogGuard] },
    { path: 'account', component: AccountComponent, children: [
      { path: 'profile', component: ProfileComponent }
    ]}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule]
})
export class HomeModule { }
