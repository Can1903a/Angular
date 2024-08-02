import { Component, OnInit } from '@angular/core';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Category, CategoryService, UpperCategory } from '../../services/category.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-categoryselection',
  standalone: true,
  imports: [NgFor, NgForOf, NgIf],
  templateUrl: './categoryselection.component.html',
  styleUrl: './categoryselection.component.scss'
})
export class CategoryselectionComponent implements OnInit {
  upperCategories: UpperCategory[] = [];
  subcategories: { [key: string]: Category[] } = {};
  selectedUpperCategoryId?: string;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private categoryService: CategoryService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.categoryService.getUpperCategories().subscribe(
      (categories: UpperCategory[]) => {
        this.upperCategories = categories;

        this.upperCategories.forEach(upperCategory => {
          const ustKategoriId = upperCategory._id;
          this.categoryService.getSubcategories(ustKategoriId).subscribe(
            (subcategories: Category[]) => {
              this.subcategories[ustKategoriId] = subcategories;
            },
            error => {
              console.error('Error fetching subcategories:', error);
            }
          );
        });
      },
      error => {
        console.error('Error fetching upper categories:', error);
      }
    );
  }

  toggleDropdown(upperCategoryId: string): void {
    if (this.selectedUpperCategoryId === upperCategoryId) {
      this.selectedUpperCategoryId = undefined;
    } else {
      this.selectedUpperCategoryId = upperCategoryId;
    }
  }

  onSubcategoryClick(subCategoryId: string): void {
 {
    }  if (this.isAdmin) {
      this.router.navigate(['admin/products'], { queryParams: { subCategoryId } });
    } else {
      this.router.navigate(['/products'], { queryParams: { subCategoryId } });
    }
  }
}
