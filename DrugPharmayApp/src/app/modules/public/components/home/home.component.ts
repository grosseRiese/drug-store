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


  countries: any[] | undefined;
  selectedCountry: string | undefined;

  constructor(private drugService: DrugService, private cartService: CartService) {}

  ngOnInit(): void {

    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' }
  ];



    this.selectedDrugForm = new FormGroup({
      selectedDrugName: new FormControl('', [Validators.required]),
      selectedDrugQuantity: new FormControl(0, [Validators.required, Validators.min(1)]), } );
    this.loadDrugsList();
  }

  loadDrugsList():void {
    this.drugService.getDrugs().subscribe({
      next:(data) => {

        this.drugs = data;
        console.log("Drugs: ", this.drugs);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}

