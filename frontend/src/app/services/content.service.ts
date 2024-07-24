import { Injectable } from '@angular/core';

export interface UserItem {
  text: string;
  path: string;
}

export interface AdminItem {
  text: string;
  path: string;
}

//Buraya css class vercen

const USER_ITEMS: UserItem[] = [
  {
    text: 'Products',
    path: '/products'
  },
  {
    text: 'Account',
    path: '/account'
  }
];

const GUEST_ITEMS: UserItem[] = [
  {
    text: 'Products',
    path: '/products'
   },
  { text: 'Login',
    path: '/login'
  },
  { text: 'Register',
    path: '/register'
  }
];

const ADMIN_ITEMS: AdminItem[] = [
  {
    text: 'Products ',
    path: '/admin/products'
  },

  {
    text: 'Users',
    path: '/admin/users'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  public get AdminItems() : AdminItem[]{
    return ADMIN_ITEMS;
  }

  public get UserItems() : UserItem[]{
    return USER_ITEMS;
  }

  public get GuestItems(): UserItem[] {
    return GUEST_ITEMS;
  }
}
