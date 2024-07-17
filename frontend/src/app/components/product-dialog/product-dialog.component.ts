import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,MatFormField,MatLabel],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      Urunler_Adi: [data.product ? data.product.Urunler_Adi : '', Validators.required],
      Urunler_Aciklama: [data.product ? data.product.Urunler_Aciklama : ''],
      Urunler_Fiyat: [data.product ? data.product.Urunler_Fiyat : 0, Validators.required],
      Resim_URL: [data.product ? data.product.Resim_URL : '', Validators.required],
      Kategori_Id: [data.product ? data.product.Kategori_Id : '', Validators.required]
    });
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
