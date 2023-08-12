import { Routes } from "@angular/router";
import { HomeComponent } from "./public/components/home/home.component";

const Routing: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };