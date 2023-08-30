import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, of, switchMap, take } from 'rxjs';
import { ICartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { DrugService } from '../../services/drug.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],

})
export class CartComponent implements OnInit,OnDestroy {
  cartItems$: Observable<ICartItem[]>;// = this.orderService.getCartItems();
  totalSum:number = 0; 

  drugNames: string[] = []; // Array to store drug names for autocomplete
  editorEnabled = false; 
  editId:number =0;

  constructor( 
    public drugService:DrugService,
    public orderService:OrderService,
    private cdr: ChangeDetectorRef,) {
      
      this.cartItems$ = this.orderService.getCartItems();
    
  }

  ngOnInit(): void {
  
    // Fetch drug names and populate the drugNames array
    this.drugService.getDrugs().subscribe(drugs => {
      this.drugNames = drugs.map(drug => drug.name);
    });
    
      this.cartItems$.subscribe((items) => {
      this.totalSum = items.reduce((sum, item) => sum + item.totalPrice, 0);
    });
    // Subscribe to the totalSum$ BehaviorSubject to keep the totalSum property updated
      this.orderService.totalSum$.subscribe(newTotalSum => {
      this.totalSum = newTotalSum;
    });

  }

  ngOnDestroy() {
  }

  onDrugNameChange(item: ICartItem): void {

    this.cartItems$.pipe(
      take(1),
      switchMap(cartItems => {
        const newDrug = this.drugService.drugs.find(drug => drug.name === item.drugName);
        //console.log("New drug",newDrug,-----,item);
        if (newDrug) {
          const updatedCartItem = {
            ...item,
            drugName: newDrug.name,
            id: newDrug.id,
            price: newDrug.price,
            isAvailable: newDrug.quantity > 0
          };
          return of(cartItems.map(cartItem => (cartItem.id === item.id ? updatedCartItem : cartItem)));
        } else {
          return of(cartItems); // No change needed
        }
      })
    ).subscribe(updatedCartItems => {
      this.orderService.updateCartItemsObservable(updatedCartItems);
    });
  } 

  updateCartItemDrugName(cartItem: ICartItem, newDrugName: string): void {
    
    const newDrug = this.drugService.drugs.find(drug => drug.name === newDrugName);

    if (newDrug) {
      //console.log('Found new drug:', newDrug);//

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

        this.orderService.updateCartItemsObservable(updatedCartItems); 
        this.cdr.detectChanges(); // Trigger change detection

        
      }); 
    }
  }
  
  updateCartItemQuantity(cartItem: ICartItem, newQuantity: number): void {
    this.cartItems$.pipe(take(1)).subscribe(cartItems => {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === cartItem.id) {
          item.quantity = newQuantity;
          // Check if requested quantity is available
          const isAvailable = this.orderService.isRequestedQuantityAvailable(item.drugName, item.quantity);
          item.isAvailable = isAvailable;
          this.updateCartItemTotalPrice(item);
        }
        return item;
      });
  
      this.orderService.updateCartItemsObservable(updatedCartItems); // Update the cart items
      this.cdr.detectChanges();
    });
  }
  
  updateCartItemTotalPrice(cartItem: ICartItem): void {
    cartItem.totalPrice = cartItem.price * cartItem.quantity;
  }
  
  onDeleteRow(id: number): void {
    this.orderService.deleteRowById(id);
    this.cartItems$ = this.orderService.getCartItems();
  }

  refreshEditor(id:number) {
    this.editId=id;
    this.editorEnabled  = true; // Set the editor availability to true
  }

  saveChanges(): void {
    this.cartItems$.pipe(take(1)).subscribe(cartItems => {
      this.orderService.updateCartItemsObservable(cartItems);
      this.orderService.saveOrder(cartItems);
    });
  }

  isSaveButtonEnabled(): boolean {
    let isAnyUnavailable = false;
  
    this.cartItems$.pipe(take(1)).subscribe(cartItems => {
      isAnyUnavailable = cartItems.some(item => item.quantity > 0 && !item.isAvailable);
    });
  
    return !isAnyUnavailable;
  }
  
  getSavedOrders(): Observable<ICartItem[]> {
    return this.orderService.getSavedOrders();
  }

  isQuantityUnavailable(item: ICartItem): boolean {
    return item.quantity > 0 && !item.isAvailable;
  }
  hasUnavailableItems(cartItems: ICartItem[] | null): boolean {
    return cartItems?.some(item => item.quantity > 0 && !item.isAvailable) || false;
  }


}