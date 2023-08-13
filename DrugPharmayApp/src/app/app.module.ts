import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { FavoriteButtonComponent } from './shared/components/buttons/favorite-button/favorite-button.component';
import { CollapseButtonComponent } from './shared/components/buttons/collapse-button/collapse-button.component';
import { AuthDirective } from './shared/directives/auth.directive';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { SafePipe } from './shared/pipes/safe.pipe';
import { PublicModule } from './modules/public/public.module';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './core/header/header.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    FavoriteButtonComponent,
    CollapseButtonComponent,
    AuthDirective,
    CapitalizePipe,
    SafePipe,
    HeaderComponent
  
  ],
  imports: [
    BrowserModule,
    PublicModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
