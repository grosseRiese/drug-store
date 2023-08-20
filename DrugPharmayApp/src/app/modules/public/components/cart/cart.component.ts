import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],

})
export class CartComponent {
  cartItems$: Observable<ICartItem[]> = this.orderService.getCartItems();
  totalSum: number = 0; // Initialize the total sum

  constructor( public orderService:OrderService) {
    this.cartItems$.subscribe((items) => {
      this.totalSum = items.reduce((sum, item) => sum + item.totalPrice, 0);
    });

  }
}
