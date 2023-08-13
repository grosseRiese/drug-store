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

  selectedDrug:any;
  selectedDrugForm!: FormGroup;


  constructor( private drugService: DrugService, public cartService: CartService) {}

  ngOnInit(): void {
  
    this.selectedDrugForm = new FormGroup({
      selectedDrugName: new FormControl('', [Validators.required]),
      selectedDrugQuantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      //available: new FormControl(false)
    },this.compareQuantityValidator.bind(this) );
    
    this.loadDrugsList();
  }

  compareQuantityValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDrug = control.get('selectedDrugName')?.value;
    const selectedDrugQuantity = control.get('selectedDrugQuantity')?.value;
  
    //console.log("selectedDrug : ", selectedDrug);
    //console.log("selectedDrugQuantity : ", selectedDrugQuantity);
  
    if (selectedDrug && selectedDrugQuantity > 0) {

      //console.log("All Drugs: ", this.drugs);

      const drug = this.drugs.find(item => item.name === selectedDrug)!;

      //console.log("Found Drug from compareQuantityValidator(): ", drug?.name);
  
      if (drug && selectedDrugQuantity > drug.quantity) {
        return { quantityExceeded: true };
      }

      //console.log(">>>> OUT Drug from compareQuantityValidator(): ",{selectedDrug,selectedDrugQuantity});

      //let difference = drug.quantity - selectedDrugQuantity;
      // Store the updated drug quantity in local storage
      //localStorage.setItem(`drug_${drug.id}`, difference.toString());
      //localStorage.setItem(`hello  ${drug.id, drug.name, drug.quantity, drug.price}`, difference.toString());

      //localStorage.setItem(`_${selectedDrug}_difference `,JSON.stringify({id:drug.id,name:selectedDrug,price:selectedDrugQuantity*drug.price ,quantity:selectedDrugQuantity}) );
      //console.log("Differance : ", difference.toString());
    }
  
    return null;
  }
  
  searchDrugs = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? [] : this.drugs.filter(drug => drug.name.toLowerCase().includes(term.toLowerCase())).map(drug => drug.name)
      )
    );

    getMatchingDrugs(term: string): string[] {
      // Filter drugs based on the user's input
      const matchingDrugs = this.drugs.filter(drug =>
        drug.name.toLowerCase().includes(term.toLowerCase())).map(drug => drug.name); 

      return matchingDrugs;
    }
    

  loadDrugsList():void {
    this.drugService.getDrugs().subscribe({
      next:(data) => {

        this.drugs = data;
        console.log("Drugs: ", this.drugs); ///////////
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updateSelectedDrug() {
    const selectedDrugName = this.selectedDrugForm.value.selectedDrugName; //result = name
    const selectedDrug = this.drugs.find((item) => item.name === selectedDrugName);//unary + to cast the id as number...

    
    if (selectedDrug) {
        this.selectedDrugForm.patchValue({
          selectedDrugQuantity: selectedDrug.quantity,
        });
    }
    
  }
 
  addToCart() {//addToCart(drugs:IDrug) 
  
    const selectedDrugName = this.selectedDrugForm.value.selectedDrugName; //result = name
    const selectedDrugQuantity:number = this.selectedDrugForm.value.selectedDrugQuantity; //result = quantity

  
    if (selectedDrugName && selectedDrugQuantity > 0) {
      const selectedDrug = this.drugs.find(item => item.name === selectedDrugName);
  
      console.log("Hello selectedDrug ! ",selectedDrug);

      console.log(`ID: ${selectedDrug?.id} 
        - Name:  ${selectedDrugName}
        - Quantity: ${selectedDrugQuantity} 
        - price: ${(selectedDrug?.price) } `);


      if (selectedDrug) {
        
        const cartItem = {
          id: selectedDrug.id,
          name: selectedDrug.name,
          quantity: selectedDrugQuantity,
          price: selectedDrug.price
        };
        //console.log("---",cartItem);
        //localStorage.setItem(`myCart`,JSON.stringify(selectedDrug) ) ;

        this.cartService.selectedQuantity.set(selectedDrugQuantity);//////SelectedQNY

       // this.cartService.addItemSignal(selectedDrug);
      
        this.cartService.addItemSignal(cartItem);
      }

    }
  }

  

}

