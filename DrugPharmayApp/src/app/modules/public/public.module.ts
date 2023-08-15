import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';





@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent, 
    CartComponent,
    
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
  ],
  exports:[
    RouterModule,
  ]
})
export class PublicModule { }
