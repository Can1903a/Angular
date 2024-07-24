import { AdminItem, ContentService, UserItem } from './../services/content.service';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SliderComponent } from "../shared/slider/slider.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, SliderComponent],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
`,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  public adminNavigationItems: AdminItem[] = [];
  public userNavigationItems: UserItem[] = [];

  currentItem: AdminItem | UserItem = {
    text: '',
    path: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private contentService: ContentService) {}

  ngOnInit(): void {
  }

}
