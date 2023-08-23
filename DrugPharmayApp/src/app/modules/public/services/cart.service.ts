import { Injectable, computed, signal } from '@angular/core';
import { IDrug } from '../models/idrug';
import { DrugService } from './drug.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICartItem } from '../models/cart-item';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$: BehaviorSubject<ICartItem[]> = new BehaviorSubject<ICartItem[]>([]);

  private drugNameChange$: BehaviorSubject<{ originalName: string; newName: string }> = new BehaviorSubject<{ originalName: string; newName: string }>({ originalName: '', newName: '' });


  constructor(private drugService:DrugService,
    private messageService: MessageService) { }

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
  
  /*
  updateCartItems(updatedCartItems: ICartItem[]): void {
    this.cartItems$.next(updatedCartItems);
  }*/
  
 /* getDrugNameChangeObservable(): Observable<{ originalName: string; newName: string }> {
    return this.drugNameChange$.asObservable();
  }
  */

}