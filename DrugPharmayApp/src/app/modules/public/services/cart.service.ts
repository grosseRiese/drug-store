import { Injectable, computed, signal } from '@angular/core';
import { IDrug } from '../models/idrug';
import { DrugService } from './drug.service';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

  constructor(private drugService:DrugService) { }

  getCartItems(): BehaviorSubject<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(cartItem: CartItem): void {
    const currentCartItems = this.cartItems$.value;
    this.cartItems$.next([...currentCartItems, cartItem]);
  }

}