import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { IDrug } from '../../models/idrug';
import { CartService } from '../../services/cart.service';
import { DrugService } from '../../services/drug.service';
import { OrderService } from '../../services/order.service';
import { Message, MessageService } from 'primeng/api';


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
  errorMessage!:string;//Message[] | undefined;

  constructor(private drugService: DrugService,
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService ) {}

  ngOnInit(): void {
    this.selectedDrugForm = new FormGroup({
      selectedDrugName: new FormControl('', [Validators.required]),
      selectedDrugQuantity: new FormControl(0, [Validators.required, Validators.min(1)]), } );
      
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

  addOrder(){
    const drugName =this.selectedDrugForm.get('selectedDrugName')?.value.name; 
    const quantity = this.selectedDrugForm.get('selectedDrugQuantity')?.value;

    if (this.orderService.isDrugAvailable(drugName, quantity)) {

      // Handle successful order addition
      this.errorMessage =''; 
      this.messageService.add({ severity: 'success', summary: 'Order Added', detail: 'Order successfully added.' });

      // Your code to add the order to the table
    } else {
      this.errorMessage = `${drugName} ${quantity} is not available`;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage });
    }
  }

  

}

