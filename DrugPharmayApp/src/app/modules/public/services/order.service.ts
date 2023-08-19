import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DrugService } from './drug.service';
import { IDrug } from '../models/idrug';
import { ICartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private inputSignal$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private cartItems$: BehaviorSubject<ICartItem[]> = new BehaviorSubject<ICartItem[]>([]);

  private inputQuantitySignal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  drugs: IDrug[] = this.drugService.drugs;
  
  constructor(private drugService:DrugService) {

     // Subscribe to input changes and update button availability
    this.inputSignal$.subscribe(drugName => {
      const desiredQuantity = this.inputQuantitySignal$.value;
      this.updateAddButtonAvailability(drugName, desiredQuantity);
    });

    this.inputQuantitySignal$.subscribe(quantity => {
      const drugName = this.inputSignal$.value;
      this.updateAddButtonAvailability(drugName, quantity);
    });

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
    const currentCartItems = this.cartItems$.value;
    this.cartItems$.next([...currentCartItems, cartItem]);
    this.updateQuantityInOriginalData(cartItem.drugName, cartItem.quantity);
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


}
