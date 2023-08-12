import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  // Define more routes here
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ]
})
export class HomeRoutingModule { }
