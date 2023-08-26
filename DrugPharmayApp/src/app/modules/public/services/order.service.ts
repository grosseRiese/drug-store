import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { DrugService } from './drug.service';
import { IDrug } from '../models/idrug';
import { ICartItem } from '../models/cart-item';
import { MessageService } from 'primeng/api';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private inputSignal$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private cartItems$: BehaviorSubject<ICartItem[]> = new BehaviorSubject<ICartItem[]>([]);

  private inputQuantitySignal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  drugs: IDrug[] = this.drugService.drugs;

  cartItemsLength: number = 0;

  public cartItemsLength$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private drugService:DrugService,
    private cartService:CartService,
    private messageService: MessageService) {

     // Subscribe to input changes and update button availability
    const p = this.inputSignal$.subscribe(drugName => {
      const desiredQuantity = this.inputQuantitySignal$.value;
      this.updateAddButtonAvailability(drugName, desiredQuantity);
    });

    this.inputQuantitySignal$.subscribe(quantity => {
      const drugName = this.inputSignal$.value;
      this.updateAddButtonAvailability(drugName, quantity);
    });

  }
  // Method to update the cart items length
  updateCartItemsLength(length: number) {
    this.cartItemsLength$.next(length);
  }
   // Function to update the drug name input
  updateDrugName(drugName: string) {
    this.inputSignal$.next(drugName);
  }

  // Function to update the quantity input
  updateQuantity(quantity: number) {
    this.inputQuantitySignal$.next(quantity);
  }

  // Function to update 'ADD' button availability based on drug name and quantity
  updateAddButtonAvailability(drugName: string, quantity: number) {
    const drug = this.drugs.find(d => d.name === drugName);
    if (drug && quantity <= drug.quantity) {
      console.log(`'ADD' button is available for ${drugName}`);
    } else {
      console.log(`'ADD' button is not available for ${drugName}`);
    }
  }
   // Check if a drug quantity is available
  isDrugAvailable(drugName: string, quantity: number): boolean {
    const drug = this.drugs.find(d => d.name === drugName);

    if (drug && quantity !=0) {
      return quantity <= drug.quantity; // Check if requested quantity is less than or equal to available quantity
    }
    return false; // Drug not found
  }

  addToCart(cartItem: ICartItem): void {

    this.cartItems$.subscribe(item=> {
      console.log("subscribe item...: ", item);
    });
    
      const currentCartItems = this.cartItems$.value;
      
      console.log("currentCartItems: ", currentCartItems);
    
      const existingCartItem = currentCartItems.find(item => item.drugName === cartItem.drugName);
    
      if (existingCartItem) {
        // Drug is already added, update the quantity
        existingCartItem.quantity += cartItem.quantity;
        existingCartItem.totalPrice += cartItem.totalPrice;
        this.updateQuantityInOriginalData(cartItem.drugName, cartItem.quantity);

      } else {
        // Drug is not in the cart, add it as a new item
        this.cartItems$.next([...currentCartItems, cartItem]);
        this.updateQuantityInOriginalData(cartItem.drugName, cartItem.quantity);
      }
    
      console.log("Order-service success --> currentCartItems: ", currentCartItems);
    
      this.messageService.add({
        severity: 'success',
        summary: 'Order Added',
        detail: 'Order successfully added to the cart.'
      });

  }

  updateQuantityInOriginalData(drugName: string, quantity: number): void {
    const drug = this.drugs.find(d => d.name === drugName);
    if (drug) {
      drug.quantity -= quantity;
    }
  }

  getCartItems(): BehaviorSubject<ICartItem[]> {
    return this.cartItems$;
  }

  updateCartItems(updatedCartItems: ICartItem[]): void {
    this.cartItems$.next(updatedCartItems);
  }

  updateCartItemsObservable(updatedCartItems:ICartItem[] ): void {
      this.cartItems$.next(updatedCartItems);
  }
  
  deleteRowById(id: number): void {
    // Get the current cart items
    const currentCartItems = this.cartItems$.value;
      console.log("currentCartItems deleteRowById: ",currentCartItems);
    // Find the item to be deleted
    const itemToDelete = currentCartItems.find(item => item.id === id);

    if (itemToDelete) {
      // Restore drug's quantity
      const drug = this.drugService.getDrugById(itemToDelete.id); 
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