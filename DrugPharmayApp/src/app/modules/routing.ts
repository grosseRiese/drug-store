import { Routes } from "@angular/router";
import { HomeComponent } from "./public/components/home/home.component";

const Routing: Routes = [
  /**/
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
  
];

export { Routing };