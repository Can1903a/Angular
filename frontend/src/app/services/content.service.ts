import { Injectable } from '@angular/core';

export interface UserItem {
  text: string;
  path: string;
  class: string;
}

export interface AdminItem {
  text: string;
  path: string;
  class: string;
}


const USER_ITEMS: UserItem[] = [
  {
    text: 'Products',
    path: '/products',
    class: 'left'
  },
  {
    text: 'Account',
    path: '/account',
    class: 'right'
  }
];

const GUEST_ITEMS: UserItem[] = [
  {
    text: 'Products',
    path: '/products',
    class: 'left'
   },
  { text: 'Login',
    path: '/login',
    class: 'right'
  },
  { text: 'Register',
    path: '/register',
    class: 'right'
  },
  { text: 'ShoppingCart',
    path: '/basket',
    class: 'right'
  }
];

const ADMIN_ITEMS: AdminItem[] = [
  {
    text: 'Products ',
    path: '/admin/products',
    class: 'left'
  },

  {
    text: 'Users',
    path: '/admin/users',
    class: 'left'
  },

  {
    text: 'Comments',
    path: '/admin/comments',
    class: ''
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
