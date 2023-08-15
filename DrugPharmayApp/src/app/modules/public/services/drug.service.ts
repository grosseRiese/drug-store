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
    { id: 1, name: 'Drug A', quantity: 10, price: 5.99 },
    { id: 2, name: 'Drug B', quantity: 20, price: 9.99 },
    { id: 3, name: 'Drug C', quantity: 78, price: 87 },
    { id: 4, name: 'Drug D', quantity: 43, price: 100 },
    { id: 5, name: 'Drug E', quantity: 0, price: 25 },
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

  /*
  getDrugsWithSignal(): Observable<IDrug[]> {
    return combineLatest([
      this.getInputSignal(),
      this.getDrugs()
    ]).pipe(
      switchMap(([inputSignal, drugs]) => {
        // Filter drugs based on inputSignal (for example, drug.name)
        const filteredDrugs = drugs.filter(drug => drug.name.includes(inputSignal));
        console.log("filteredDrugs: ",filteredDrugs);
        return of(filteredDrugs);
      })
    );
  }
  */

}
