import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent {
  @Output() selectedMethod = new EventEmitter<string>();

  onSelectPaymentMethod(method: string) {
    this.selectedMethod.emit(method);
  }
}
