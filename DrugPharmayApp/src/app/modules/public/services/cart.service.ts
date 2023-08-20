import { Injectable, computed, signal } from '@angular/core';
import { IDrug } from '../models/idrug';
import { DrugService } from './drug.service';
import { BehaviorSubject } from 'rxjs';
import { ICartItem } from '../models/cart-item';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$: BehaviorSubject<ICartItem[]> = new BehaviorSubject<ICartItem[]>([]);

  constructor(private drugService:DrugService,
    private messageService: MessageService) { }

  getCartItems(): BehaviorSubject<ICartItem[]> {
    return this.cartItems$;
  }

  addToCart(cartItem: ICartItem): void {
    const currentCartItems = this.cartItems$.value;
    this.cartItems$.next([...currentCartItems, cartItem]);
  }

}