import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { IDrug } from '../../models/idrug';
import { CartService } from '../../services/cart.service';
import { DrugService } from '../../services/drug.service';
import { OrderService } from '../../services/order.service';
import { Message, MessageService } from 'primeng/api';
import { CartItem } from '../../models/cart-item';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit{
  public drugs: IDrug[] = [];
  selectedDrugForm!: FormGroup;

  //inputValue: string ='';
  errorMessage: Message[] = [];

  constructor(private drugService: DrugService,
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService ) {}

  ngOnInit(): void {
    this.selectedDrugForm = new FormGroup({
      selectedDrugName: new FormControl('', [Validators.required]),
      selectedDrugQuantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });
      
    this.loadDrugsList();

    this.selectedDrugForm.get('selectedDrugName')?.valueChanges.subscribe(value => {
      //this.inputValue = value;
      this.drugService.updateInputSignal(value);
      console.log("Value: ",value);
    });

    this.selectedDrugForm.get('selectedDrugQuantity')?.valueChanges.subscribe(value => {
      this.drugService.updateInputQuantitySignal(value);
      console.log("updateInputQuantitySignal: ",value);
    });

  }

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

  addOrder(){
    const drugName =this.selectedDrugForm.get('selectedDrugName')?.value.name; 
    const quantity = this.selectedDrugForm.get('selectedDrugQuantity')?.value;

    //console.log("Home.ts: ",drugName);
    //console.log("Home.ts: ",quantity);
    

    if(this.orderService.isDrugAvailable(drugName,quantity)){
      this.errorMessage =[]; 
      this.messageService.add({ severity: 'success', summary: 'Order Added', detail: 'Order successfully added.' });
        console.log("Success...");

        /*
        const cartItem: CartItem = {
          id:0,
          drugName: drugName,
          quantity: quantity,
          price : price
          isAvailable:false,
          totalPrice:price*quantity
        };
    
        this.cartService.addToCart(cartItem);
        */

    }else{
      this.errorMessage = [{ severity: 'error', summary: 'Error', detail: `${drugName} ${quantity} is not available` }];
      this.messageService.add(this.errorMessage[0]);
      console.log("Error..X..");
    }

  }

}

