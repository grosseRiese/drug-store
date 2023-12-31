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
import { HeaderComponent } from './core/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartService } from './modules/public/services/cart.service';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    FavoriteButtonComponent,
    CollapseButtonComponent,
    AuthDirective,
    CapitalizePipe,
    SafePipe,
    HeaderComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    
  ],
  providers: [CartService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
