import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  drugNames: string[] = []; // Array to store drug names for autocomplete

  constructor( 
    public drugService:DrugService,
    public orderService:OrderService,
    private cdr: ChangeDetectorRef,) {

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

  
  /* */
  onDrugNameChange(item: ICartItem): void {
  
    this.cartItems$.pipe(
      take(1),
      map(cartItems => {
        return cartItems.map(cartItem => {
          if (cartItem.id === item.id) {
            const newDrug = this.drugService.drugs.find(drug => drug.name === item.drugName);
            console.log('New Drug:', newDrug);
            if (newDrug) {
              return { ...cartItem, drugName: item.drugName, id: newDrug.id, price: newDrug.price,isAvailable:newDrug.quantity > 0 };
            }
          }
          return cartItem;
        });
      })
    ).subscribe(updatedCartItems => {
      console.log('__Updated Cart Items:', updatedCartItems);
      this.orderService.updateCartItemsObservable(updatedCartItems);
    });
  } 
 
  

  updateCartItemDrugName(cartItem: ICartItem, newDrugName: string): void {
    const newDrug = this.drugService.drugs.find(drug => drug.name === newDrugName);

    if (newDrug) {
      console.log('Found new drug:', newDrug);//

      const updatedCartItem: ICartItem = {
        ...cartItem,
        drugName: newDrug.name,
        id: newDrug.id,
        price: newDrug.price,
        isAvailable: newDrug.quantity > 0
      };

      console.log('Updated cart item:', updatedCartItem);///

      this.updateCartItemTotalPrice(updatedCartItem);
      
      this.cartItems$.pipe(take(1)).subscribe(cartItems => {
        const updatedCartItems = cartItems.map(item =>
          item.id === updatedCartItem.id ? updatedCartItem : item
        );

        console.log('OMG cart items:', updatedCartItems);///?

        this.orderService.updateCartItems(updatedCartItems); 
        this.cdr.detectChanges(); // Trigger change detection

        
      });
    }

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
  
      this.orderService.updateCartItemsObservable(updatedCartItems); // Update the cart items
    });
  }
  
  updateCartItemTotalPrice(cartItem: ICartItem): void {
    cartItem.totalPrice = cartItem.price * cartItem.quantity;
  }
  
  onDeleteRow(id: number): void {
    this.orderService.deleteRowById(id);
    this.cartItems$ = this.orderService.getCartItems();
  }

}
