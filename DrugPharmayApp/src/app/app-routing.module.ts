import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*{
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },*/
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: 'dashboard',
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/private/private.module').then((m) => m.PrivateModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/public/public.module').then((m) => m.PublicModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
