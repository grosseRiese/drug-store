import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ICartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { DrugService } from '../../services/drug.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],

})
export class CartComponent implements OnInit {
  cartItems$: Observable<ICartItem[]> = this.orderService.getCartItems();
  totalSum: number = 0; // Initialize the total sum

  ////////////////////////////////////////////////////////////////
  private drugNameChange$: BehaviorSubject<{ originalName: string; newName: string }> = new BehaviorSubject<{ originalName: string; newName: string }>({ originalName: '', newName: '' });

  drugNames: string[] = []; // Array to store drug names for autocomplete

  constructor( 
    public drugService:DrugService,
    public orderService:OrderService,
    public cartService:CartService) {
    //this.cartItems$ = this.orderService.getCartItems(); 

    this.cartItems$.subscribe((items) => {
      this.totalSum = items.reduce((sum, item) => sum + item.totalPrice, 0);
    });
    
  }

  ngOnInit(): void {
    // Fetch drug names and populate the drugNames array
    this.drugService.getDrugs().subscribe(drugs => {
      this.drugNames = drugs.map(drug => drug.name);
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

  deleteCartItem(item: ICartItem): void {
    const updatedCartItems$ = this.cartItems$.pipe(
      take(1),
      map(cartItems => cartItems.filter(cartItem => cartItem.id !== item.id))
    );
  
    this.cartService.updateCartItems(updatedCartItems$);
  }

  updateCartItemDrugName(cartItem: ICartItem, newDrugName: string): void {

    this.cartItems$.pipe(take(1)).subscribe(cartItems => {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === cartItem.id) {
          cartItem.drugName = newDrugName;
          this.updateCartItemTotalPrice(item);
        }
        return item;
      });
  
      this.cartService.updateCartItems(updatedCartItems); 
    });
  }
  
  updateCartItemQuantity(cartItem: ICartItem, newQuantity: number): void {
    this.cartItems$.pipe(take(1)).subscribe(cartItems => {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === cartItem.id) {
          item.quantity = newQuantity;
          this.updateCartItemTotalPrice(item);
        }
        return item;
      });
  
      this.cartService.updateCartItems(updatedCartItems); // Update the cart items
    });
  }
  
  updateCartItemTotalPrice(cartItem: ICartItem): void {
    cartItem.totalPrice = cartItem.price * cartItem.quantity;
    
  }
  

}
