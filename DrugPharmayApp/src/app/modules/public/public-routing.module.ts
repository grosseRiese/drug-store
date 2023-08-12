import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Routing } from '../routing';
import { PublicComponent } from './public.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PublicComponent,
    children: Routing,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class PublicRoutingModule { }
