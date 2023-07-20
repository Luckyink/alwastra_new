import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from 'src/@theme/theme.module';
import { StorageService } from 'src/@core/services/storage/storage.service';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';
import { DevExtremeModule } from 'devextreme-angular';
import { CoreModule } from 'src/@core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    DevExtremeModule
    ],
  providers: [
    // StorageService,
    InvoiceFormGroupService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}