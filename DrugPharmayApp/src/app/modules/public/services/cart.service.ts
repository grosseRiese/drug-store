import { Injectable, computed, signal } from '@angular/core';
import { IDrug } from '../models/idrug';
import { DrugService } from './drug.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICartItem } from '../models/cart-item';
import { MessageService } from 'primeng/api';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 private cartItems$: BehaviorSubject<ICartItem[]> = new BehaviorSubject<ICartItem[]>([]);

  constructor(private drugService:DrugService,
    private messageService: MessageService) { 
    }

  getCartItems(): BehaviorSubject<ICartItem[]> {
    return this.cartItems$;

  }

///////////////////////////

  getCartItemsObservable(): Observable<ICartItem[]> {
    return this.cartItems$.asObservable();
  }
  
  updateCartItemsObservable(updatedCartItems:ICartItem[] | Observable<ICartItem[]>): void {
    if (updatedCartItems instanceof Observable) {
      updatedCartItems.subscribe(newCartItems => {
        this.cartItems$.next(newCartItems);
      });
    } else {
      this.cartItems$.next(updatedCartItems);
    }
  }
  

  deleteRowById(id: number): void {
    // Get the current cart items
    const currentCartItems = this.cartItems$.value;
      console.log("currentCartItems deleteRowById: ",currentCartItems);
    // Find the item to be deleted
    const itemToDelete = currentCartItems.find(item => item.id === id);

    if (itemToDelete) {
      // Restore drug's quantity
      const drug = this.drugService.getDrugById(itemToDelete.id); // You need to implement this method in DrugService
      console.log("drug deleteRowById: ",drug);
      if (drug) {
        drug.quantity += itemToDelete.quantity;
      }

      // Remove the item from the cart
      const updatedCartItems = currentCartItems.filter(item => item.id !== id);
      this.cartItems$.next(updatedCartItems);
    }
  }



}