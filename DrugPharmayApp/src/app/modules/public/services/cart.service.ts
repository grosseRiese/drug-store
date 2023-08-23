import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICartItem } from '../models/cart-item';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private messageService: MessageService) { }
}