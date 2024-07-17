// admin.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LoginComponent } from '../components/login/login.component';
import { RoleGuard } from '../role.guard';
import { ProductsComponent } from '../components/products/products.component';
import { AccountComponent } from '../components/account/account.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,canActivate: [RoleGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'account', component: AccountComponent, children: [
        { path: 'products', component: ProductsComponent }
      ]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule]
})
export class AdminModule { }
