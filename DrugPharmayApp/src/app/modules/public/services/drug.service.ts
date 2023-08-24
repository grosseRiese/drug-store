import { Injectable } from '@angular/core';
import { IDrug } from '../models/idrug';
import { BehaviorSubject, Observable, combineLatest, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugService {
  private cachedData$: BehaviorSubject<IDrug[]> = new BehaviorSubject<IDrug[]>([]);

  private inputSignal$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private inputQuantitySignal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }
  
  public drugs:IDrug[] = [
    { id: 1, name: 'Naproxen', quantity: 10, price: 5.99 },
    { id: 2, name: 'Acetaminophen', quantity: 20, price: 9.99 },
    { id: 3, name: 'Benzonatate', quantity: 78, price: 87 },
    { id: 4, name: 'Cyclobenzaprine', quantity: 43, price: 100 },
    { id: 5, name: 'Loratadine', quantity: 0, price: 25 },
    { id: 6, name: 'Doxycycline', quantity: 30, price: 50 },
    { id: 7, name: 'Rybelsus', quantity: 3, price: 30 },
    { id: 8, name: 'Xanax', quantity: 15, price: 65 },
    { id: 9, name: 'Amoxicillin', quantity: 70, price: 83 },
    { id: 10, name: 'Dupixent', quantity: 40, price: 98 },
    // Add more drugs...
  ];

  getDrugs(): Observable<IDrug[]> {
    if (!this.cachedData$.value.length) {
        this.cachedData$.next(this.drugs);
    }
    //return of(this.drugs);
    return this.cachedData$.asObservable();
  }

   // Method to update the input signal
  updateInputSignal(input: string): void {
    this.inputSignal$.next(input);
  }
   // Method to get the input signal as an observable
  getInputSignal(): Observable<string> {
    return this.inputSignal$.asObservable();
  }

     // Method to update the input signal
  updateInputQuantitySignal(input: number): void {
      this.inputQuantitySignal$.next(input);
    }
   // Method to get the input signal as an observable
  getInputQuantitySignal(): Observable<number> {
    return this.inputQuantitySignal$.asObservable();
  }

  getDrugById(id:number){
    const theDrug = this.drugs.find(drug => drug.id === id);
    return theDrug;
  }

}
