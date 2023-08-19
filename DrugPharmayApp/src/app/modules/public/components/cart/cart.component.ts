import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ICartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: Observable<ICartItem[]> = this.orderService.getCartItems();

  constructor( public orderService:OrderService) {}

}
