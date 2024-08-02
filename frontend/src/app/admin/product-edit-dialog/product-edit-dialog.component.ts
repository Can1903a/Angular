import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Product, ProductService } from '../../services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService,Category } from '../../services/category.service';
import { NgFor, NgForOf } from '@angular/common';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-product-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,MatInput,MatLabel,MatFormField,MatSelectModule,NgFor,NgForOf,MatButton],
  templateUrl: './product-edit-dialog.component.html',
  styleUrl: './product-edit-dialog.component.scss'
})
export class ProductEditDialogComponent {
  editForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService:CategoryService,
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, isEditMode: boolean }
  ) {
    this.editForm = this.fb.group({
      Urunler_Adi: [data.product.Urunler_Adi || ''],
      Urunler_Aciklama: [data.product.Urunler_Aciklama || ''],
      Urunler_Fiyat: [data.product.Urunler_Fiyat || 0],
      Stok_Adet: [data.product.Stok_Adet || 0],
      Kategori_id: [data.product.Kategori_id || ''],
      IndirimOrani: [data.product.IndirimOrani || 0],
      Resim_URL: [data.product.Resim_URL || '']
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      if (this.data.isEditMode) {
        this.productService.updateProduct(this.data.product._id, formValue).subscribe(
          response => {
            console.log('Product updated successfully', response);
            this.dialogRef.close(response);
          },
          error => {
            console.error('Error updating product', error);
          }
        );
      } else {
        this.productService.addProduct(formValue).subscribe(
          response => {
            console.log('Product added successfully', response);
            this.dialogRef.close(response);
          },
          error => {
            console.error('Error adding product', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
