import { ProductService ,Product} from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  cardForm: FormGroup;
  isFlipped: boolean = false;
  cartItems: Product[] = [];  // Store cart items
  totalAmount: number = 0;    // Total price

  constructor(private fb: FormBuilder, private cartService: CartService, private http: HttpClient,private product: ProductService) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cardName: ['', Validators.required],
      cardExpiryMonth: ['', Validators.required],
      cardExpiryYear: ['', Validators.required],
      cardCvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  ngOnInit() {
    // Subscribe to cart items
    this.cartService.cartItems$.subscribe((items: Product[]) => {
      this.cartItems = items;
      this.totalAmount = this.cartItems.reduce((total, item) => total + (item.Urunler_Fiyat * item.adet), 0);
    });
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  onSubmit() {
    const paymentData = {
      price: parseFloat(this.totalAmount.toFixed(2)), // Sayıya dönüştür
      paidPrice: parseFloat(this.totalAmount.toFixed(2)), // Sayıya dönüştür
      currency: 'TRY',
      basketId: 'B67832', // Static basket ID, can be dynamic
      paymentCard: {
        cardHolderName: this.cardForm.get('cardName')?.value,
        cardNumber: this.cardForm.get('cardNumber')?.value,
        expireMonth: this.cardForm.get('cardExpiryMonth')?.value,
        expireYear: this.cardForm.get('cardExpiryYear')?.value,
        cvc: this.cardForm.get('cardCvc')?.value,
        registerCard: '0' // Don't register the card
      },
      buyer: {
        id: 'BY789', // Static buyer ID, can be dynamic
        name: 'John',
        surname: 'Doe',
        identityNumber: '74300864791', // Static identity number
        email: 'johndoe@example.com',
        gsmNumber: '+905350000000',
        registrationAddress: 'Sample Address',
        ip: '85.34.78.112', // Can be dynamic
        city: 'Istanbul',
        country: 'Turkey'
      },
      shippingAddress: {
        contactName: 'John Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Sample Shipping Address'
      },
      billingAddress: {
        contactName: 'John Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Sample Billing Address'
      },
      basketItems: this.cartItems.map(item => ({
        id: item._id,
        name: item.Urunler_Adi,
        category1: item.Kategori_id.toString(),
        price: parseFloat(item.Urunler_Fiyat.toFixed(2)),
        itemType: 'PHYSICAL'
      }))
    };
    console.log(paymentData);

    this.http.post('http://localhost:3001/api/payment', paymentData, {
  headers: { 'Content-Type': 'application/json' }
}).subscribe(
  (response) => {
    console.log('Payment successful:', response);
  },
  (error) => {
    console.error('Payment failed:', error);
  }
);

  }
}
