import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { CartComponent } from './components/cart/cart.component';



@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    DropdownMenuComponent,
    SearchFilterPipe,
    CartComponent,
    
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports:[
    RouterModule,
    NgbModule,
    NgbTypeaheadModule,
    FormsModule,
    SearchFilterPipe,    
  ]
})
export class PublicModule { }
