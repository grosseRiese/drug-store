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
    public cartService:CartService,
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

  onDrugNameChange(item: ICartItem): void {

    this.cartService.getCartItemsObservable().pipe(
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
      console.log('Updated Cart Items:', updatedCartItems);
      this.cartService.updateCartItemsObservable(updatedCartItems);
    });
    


    /*
     // Update the cart items
    this.cartService.getCartItemsObservable().pipe(
      take(1), // Take one emission to ensure the update is atomic
      map(cartItems => {
        return cartItems.map(cartItem => {
          if (cartItem.id === item.id) {
            return { ...cartItem, drugName: item.drugName };
          }
          return cartItem;
        });
      })
    ).subscribe(updatedCartItems => {
      this.cartService.updateCartItems(updatedCartItems);
    });
    */
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
        const t= updatedCartItem;
      this.cartItems$.pipe(take(1)).subscribe(cartItems => {
        const updatedCartItems = cartItems.map(item =>
          item.id === t.id ? t : item
        );

        console.log('trt cart items:', updatedCartItems);///?

        this.cartService.updateCartItemsObservable(updatedCartItems); 
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
  
      this.cartService.updateCartItemsObservable(updatedCartItems); // Update the cart items
    });
  }
  
  updateCartItemTotalPrice(cartItem: ICartItem): void {
    cartItem.totalPrice = cartItem.price * cartItem.quantity;
  }
  
  onDeleteRow(id: number): void {
    this.cartService.deleteRowById(id);
    this.cartItems$ = this.orderService.getCartItems();
  }

}
