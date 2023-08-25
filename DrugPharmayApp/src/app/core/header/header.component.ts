import { Component, HostListener, OnInit } from '@angular/core';
import { OrderService } from 'src/app/modules/public/services/order.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  cartItemsLength: number = 0;

  isMobileMenuVisible = false;

  constructor(public orderService: OrderService) { }
  
  ngOnInit():void {
    this.orderService.getCartItems().subscribe((cartItems) => {
      this.cartItemsLength = cartItems.length;
      // Update cart items length in service
      this.orderService.updateCartItemsLength(cartItems.length); 
    });
    
  }

  toggleMobileMenu(): void {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }

}