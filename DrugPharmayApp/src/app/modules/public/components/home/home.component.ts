import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { IDrug } from '../../models/idrug';
import { CartService } from '../../services/cart.service';
import { DrugService } from '../../services/drug.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public drugs: IDrug[] = [];
  selectedDrugForm!: FormGroup;

  inputValue: string ='';

 

  constructor(private drugService: DrugService, private cartService: CartService) {}

  ngOnInit(): void {
    this.selectedDrugForm = new FormGroup({
      selectedDrugName: new FormControl('', [Validators.required]),
      selectedDrugQuantity: new FormControl(0, [Validators.required, Validators.min(1)]), } );
      
    this.loadDrugsList();

    this.selectedDrugForm.get('selectedDrugName')?.valueChanges.subscribe(value => {
      this.inputValue = value;
      this.drugService.updateInputSignal(value);
      console.log("Value: ",value);
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
  /*
  onInputValueChanged(value: string): void {
    this.inputValue = value;
    this.drugService.updateInputSignal(value);
  }
  */

  

}

