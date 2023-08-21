import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ICartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],

})
export class CartComponent {
  cartItems$: Observable<ICartItem[]> = this.orderService.getCartItems();
  totalSum: number = 0; // Initialize the total sum

  ////////////////////////////////////////////////////////////////
  private drugNameChange$: BehaviorSubject<{ originalName: string; newName: string }> = new BehaviorSubject<{ originalName: string; newName: string }>({ originalName: '', newName: '' });

  
  constructor( public orderService:OrderService,
    public cartService:CartService) {
    //this.cartItems$ = this.orderService.getCartItems(); 

    this.cartItems$.subscribe((items) => {
      this.totalSum = items.reduce((sum, item) => sum + item.totalPrice, 0);
    });
    
  }


  onDrugNameChange(item: ICartItem): void {
     // Update the cart items
    const updatedCartItems$ = this.cartService.getCartItemsObservable().pipe(
      take(1), // Take one emission to ensure the update is atomic
      map(cartItems => {
        return cartItems.map(cartItem => {
          if (cartItem.id === item.id) {
            return { ...cartItem, drugName: item.drugName };
          }
          return cartItem;
        });
      })
    );

    this.cartService.updateCartItems(updatedCartItems$);
  }

  getDrugNameChangeObservable(): Observable<{ originalName: string; newName: string }> {
    return this.drugNameChange$.asObservable();
  }

}
