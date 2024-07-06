import { Component } from '@angular/core';
import { EnvironmentService } from '../../services/environment.service';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categoryselection',
  standalone: true,
  imports: [NgFor,NgForOf,NgIf],
  templateUrl: './categoryselection.component.html',
  styleUrl: './categoryselection.component.scss'
})
export class CategoryselectionComponent {
  upperCategories: UpperCategory[] = [];
  subcategories: { [key: number]: Category[] } = {};
  activeCategory: number | null = null;
  selectedUpperCategoryId?: number;


  constructor(private categoryService: CategoryService,
    private router: Router
  )
  { }


  ngOnInit(): void {
    this.categoryService.getUpperCategories().subscribe(categories => {
      this.upperCategories = categories;
      this.upperCategories.forEach(category => {
        this.categoryService.getSubcategories(category.UstKategori_id).subscribe(subcategories => {
          category.subcategories = subcategories;
        });
      });
    });
  }

/*toggleSubcategories(categoryId: number): void {
    if (this.activeCategory === categoryId) {
      this.activeCategory = null;
      return;
    }

    if (!this.subcategories[categoryId]) {
      this.categoryService.getSubcategories(categoryId).subscribe(subcats => {
        this.subcategories[categoryId] = subcats;
        this.activeCategory = categoryId;
      });
    } else {
      this.activeCategory = categoryId;
    }
  }
*/
  toggleDropdown(upperCategoryId: number): void {
    if (this.selectedUpperCategoryId === upperCategoryId) {
      this.selectedUpperCategoryId = undefined;
    } else {
      this.selectedUpperCategoryId = upperCategoryId;
    }
  }
  onSubcategoryClick(categoryId: number): void {
    this.router.navigate(['/home/products'], { queryParams: { categoryId } });
  }
}
export interface UpperCategory {
  UstKategori_id: number;
  UstKategori_Adi: string;
  subcategories?: Category[];
}

export interface Category {
  Kategori_id: number;
  Kategori_Adi: string;
  UstKategori_id: number;
}
