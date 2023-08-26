import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { IDrug } from '../../models/idrug';
import { CartService } from '../../services/cart.service';
import { DrugService } from '../../services/drug.service';
import { OrderService } from '../../services/order.service';
import { Message, MessageService } from 'primeng/api';
import { ICartItem } from '../../models/cart-item';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit,OnDestroy{
  public drugs: IDrug[] = [];
  selectedDrugForm!: FormGroup;

  cartItem:ICartItem = {
    id: 0,
    drugName: '',
    quantity: 0,
    price: 0,
    isAvailable: false,
    totalPrice: 0,
    expireDate: new Date(),
  };

  drugId:number = 0;
  drupPrice : number = 0;

  message: Message[] = [];

  drugNameSubscription: Subscription | undefined;
  receivedDrugName: string | undefined;
  cartItemsSubscription: Subscription | undefined;
  rows: ICartItem[] = []; // Initialize with an empty array


  constructor(private drugService: DrugService,
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService ) {}

  ngOnInit(): void {
    this.selectedDrugForm = new FormGroup({
      selectedDrugName: new FormControl('', [Validators.required]),
      selectedDrugQuantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });
      
    this.loadDrugsList();

    this.selectedDrugForm.get('selectedDrugName')?.valueChanges.subscribe(value => {
      this.drugService.updateInputSignal(value);
      console.log("Value: ",value);

       // Find the selected drug by its name
    const selectedDrug = this.drugs.find(drug => drug.name === value.name);
    
    if (value && value.name) {

        if (selectedDrug) {
          // Update the cartItem price based on the selected drug's price
          this.drugId = selectedDrug.id;
          this.drupPrice = selectedDrug.price;
          //console.log(this.cartItem.id + ' ' + this.cartItem.price);
        }
      }
    });

    this.selectedDrugForm.get('selectedDrugQuantity')?.valueChanges.subscribe(value => {
      this.drugService.updateInputQuantitySignal(value);
      //console.log("updateInputQuantitySignal: ",value);
    });

    this.cartItemsSubscription = this.orderService.getCartItems().subscribe(cartItems => {
      this.rows = cartItems;
      this.updateAddButtonAvailability();
    });

  }//EndOf ngOnInit...

  loadDrugsList():void {
    this.drugService.getDrugs().subscribe({
      next:(data) => {
        this.drugs = data;
        console.log('Data:',data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  isAddButtonVisible(): boolean {
    const selectedDrugControl = this.selectedDrugForm.get('selectedDrugName');
    if (!selectedDrugControl || selectedDrugControl.value === null) {
      return false;
    }
  
    const drugName = this.selectedDrugForm.get('selectedDrugName')?.value.name;
    const quantity = this.selectedDrugForm.get('selectedDrugQuantity')?.value;

    return this.orderService.isDrugAvailable(drugName, quantity);
  }

  //addOrderToCart
  addOrder(){
    const drugName =this.selectedDrugForm.get('selectedDrugName')?.value.name; 
    const quantity = this.selectedDrugForm.get('selectedDrugQuantity')?.value;

    //console.log("Home.ts: ",drugName);
    //console.log("Home.ts: ",quantity);
    

    if(this.orderService.isDrugAvailable(drugName,quantity)){

      this.message =[]; 
      
          this.cartItem = {
            drugName: drugName,
            quantity: quantity,
            price: this.drupPrice, 
            id: this.drugId, 
            isAvailable: quantity > 0, 
            totalPrice: this.drupPrice * quantity, 
            expireDate: new Date(), 
          };
            
        this.orderService.addToCart(this.cartItem);
        // Display a message for successful addition
        this.message = [{ severity: 'success', summary: 'Order Added', detail: 'Order successfully added.' }];
        this.messageService.add(this.message[0]);
         // Clear the message after 3 seconds
          setTimeout(() => {
            this.message = [];
          }, 2000); 
    }else{
      this.message = [{ severity: 'error', summary: 'Error', detail: `${drugName} ${quantity} is not available` }];
      this.messageService.add(this.message[0]);
      // Clear the message after 3 seconds
        setTimeout(() => {
          this.message = [];
        }, 2000); 
          }

  }//End of addOrder


    ngOnDestroy(): void {
    
      if(this.cartItemsSubscription){
        this.cartItemsSubscription.unsubscribe();
      }
    }
    
  updateDrugNameInDrugsList(originalName: string, newName: string): void {
    const drugToUpdate = this.drugService.drugs.find(drug => drug.name === originalName);
    if (drugToUpdate) {
      drugToUpdate.name = newName;
      console.log("updateDrugNameInDrugsList: ",newName);
    }
  }

  updateDrugNameInCartItems(originalName: string, newName: string): void {
    const cartItemsToUpdate = this.orderService.getCartItems().value.map(cartItem => {
      if (cartItem.drugName === originalName) {
        return { ...cartItem, drugName: newName };
      }

      console.log("updateDrugNameInCartItems: ",newName);
      return cartItem;
    });

    this.orderService.updateCartItems(cartItemsToUpdate);
  }

  updateAddButtonAvailability(): void {
    const selectedDrugControl = this.selectedDrugForm.get('selectedDrugName');
    if (!selectedDrugControl || selectedDrugControl.value === null) {
      return;
    }
  
    const drugName = selectedDrugControl.value.name;
    const quantity = this.selectedDrugForm.get('selectedDrugQuantity')?.value;
  
    const selectedDrug = this.drugs.find(drug => drug.name === drugName);
    if (selectedDrug) {
      if (quantity > 0 && quantity <= selectedDrug.quantity) {
        // Drug is available in the required quantity
        this.selectedDrugForm.get('selectedDrugName')?.setErrors(null);
      } else {
        // Drug is not available in the required quantity
        this.selectedDrugForm.get('selectedDrugName')?.setErrors({ notAvailable: true });
      }
    }
  }
  
  


}

