import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    const originalDrugName = item.drugName;
    const newDrugName = item.drugName; // Assuming the drug name is updated in the template

    this.cartService.sendDrugNameChange(originalDrugName, newDrugName);
  }

  getDrugNameChangeObservable(): Observable<{ originalName: string; newName: string }> {
    return this.drugNameChange$.asObservable();
  }

}
