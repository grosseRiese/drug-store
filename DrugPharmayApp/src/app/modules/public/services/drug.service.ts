import { Injectable } from '@angular/core';
import { IDrug } from '../models/idrug';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugService {

  constructor() { }
  
  public drugs = [
    { id: 1, name: 'Drug A', quantity: 10, price: 5.99 },
    { id: 2, name: 'Drug B', quantity: 20, price: 9.99 },
    { id: 3, name: 'Drug C', quantity: 78, price: 87 },
    { id: 4, name: 'Drug D', quantity: 43, price: 100 },
    { id: 5, name: 'Drug E', quantity: 0, price: 25 },
    // Add more drugs...
  ];

  getDrugs(): Observable<IDrug[]> {
    return of(this.drugs);
  }
}
