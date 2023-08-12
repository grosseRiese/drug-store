import { Injectable, computed, signal } from '@angular/core';
import { IDrug } from '../models/idrug';
import { DrugService } from './drug.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private drugService:DrugService) {  
  }
  //observable
  //public cartItems$ = new BehaviorSubject<IDrug[]>([]);
  //public totalItems$ = new BehaviorSubject<number>(0);
  // public drugsItems : IDrug[]=[];

  //signal Angular v-16..
  
  public cartItems = signal<IDrug[]>([]);
  public subTotal = computed(()=>this.cartItems().reduce((prev: any, curr: IDrug) => {
    return prev + curr.price;
  }, 0));
  public totalItems = computed(() => this.cartItems().length);

  public selectedQuantity = signal<number>(1);////selectQny


  //new with signal
  addItemSignal(drugs:IDrug){
    this.cartItems.mutate((val)=>{
      val.push(drugs);
    });

    this.drugService.drugs?.forEach((d)=>{
      if(d.id=== drugs.id){
        d.quantity = drugs.quantity-1;
        /*
        d.quantity = d.quantity - drugs.quantity;//-1;
        if(d.quantity<=0){
          drugs.quantity=0;
        };
        */

      }
    });
  }
  

  removeDrugSignal(id:number){
    this.cartItems.mutate((val)=>{
      const drug = val.splice(id,1);
      this.drugService.drugs?.forEach((d)=>{
        if(d.id=== drug[0].id){
          d.quantity = drug[0].quantity+1;
          /*
          d.quantity = drug[0].quantity+d.quantity;
          if(d.quantity<=0){
            drug[0].quantity=0;
          };
          */
        }
      });
    })
  }
}
function WritableSignal<T>(arg0: number) {
  throw new Error('Function not implemented.');
}
