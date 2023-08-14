import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { CartComponent } from './components/cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    SearchFilterPipe,
    CartComponent,
    
    
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    RouterModule,
  ]
})
export class PublicModule { }
