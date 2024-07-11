import { Component, OnInit } from '@angular/core';
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
export class CategoryselectionComponent implements OnInit {
  upperCategories: UpperCategory[] = [];
  subcategories: { [key: string]: Category[] } = {};
  selectedUpperCategoryId?: string;

  constructor(private categoryService: CategoryService, private router: Router) { }

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
    this.router.navigate(['/home/products'], { queryParams: { subCategoryId } });
  }
}

export interface UpperCategory {
  _id: string;
  UstKategori_Adi: string;
  subcategories?: Category[];
}

export interface Category {
  _id: string;
  Kategori_Adi: string;
  UstKategori_id: string;
}
