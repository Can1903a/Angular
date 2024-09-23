import { PaymentMethodComponent } from './../payment-method/payment-method.component';
import { Component, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { BasketComponent } from "../basket/basket.component";
import { CardComponent } from "../card/card.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [MatStepperModule, BasketComponent, CardComponent,PaymentMethodComponent,NgIf],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  selectedPaymentMethod: string = '';

  onPaymentMethodSelected(method: string) {
    this.selectedPaymentMethod = method;
  }
}

