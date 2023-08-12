import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';



@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    DropdownMenuComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
  ],
  exports:[
    RouterModule,
    NgbModule,
    NgbTypeaheadModule,
    FormsModule,    
  ]
})
export class PublicModule { }
