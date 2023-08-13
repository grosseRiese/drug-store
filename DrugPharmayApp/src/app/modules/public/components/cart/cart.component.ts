import { Component, OnInit } from '@angular/core';
import { IDrug } from '../../models/idrug';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems:IDrug[]=[];
  constructor(public cartService: CartService) {
  }

  ngOnInit(){
  }

  remove(id:number){
    this.cartService.removeDrugSignal(id);
  }
}