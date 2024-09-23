import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-purchase-popup',
  standalone: true,
  imports: [CurrencyPipe,MatButton,MatDialogTitle,MatDialogContent],
  templateUrl: './purchase-popup.component.html',
  styleUrl: './purchase-popup.component.scss'
})
export class PurchasePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<PurchasePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}
