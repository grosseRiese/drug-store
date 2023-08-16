import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private availableDrugs: BehaviorSubject<{ [drugName: string]: number }> = new BehaviorSubject({});

  constructor() {}

  // Update the available drugs quantity
  updateAvailableDrugs(drugs: { [drugName: string]: number }): void {
    this.availableDrugs.next(drugs);
  }

  // Check if a drug quantity is available
  isDrugAvailable(drugName: string, quantity: number): boolean {
    const availableDrugs = this.availableDrugs.value;
    return availableDrugs[drugName] >= quantity;
  }
}
