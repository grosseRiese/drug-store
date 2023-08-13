import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { CartComponent } from './components/cart/cart.component';



@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    //CartComponent,
    SearchFilterPipe,
    
    
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    
  ],
  exports:[
    RouterModule,
    FormsModule,
    NgbModule,
    NgbTypeaheadModule,
    SearchFilterPipe,    
  ]
})
export class PublicModule { }
