import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoicePageRoutingModule } from './invoice-routing.module';

import { InvoicePage } from './invoice.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from 'src/@core/core.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InvoiceGridComponent } from './invoice-grid/invoice-grid.component';
import { InvoiceTileComponent } from './invoice-tile/invoice-tile.component';
import { DevExtremeModule } from 'devextreme-angular';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');
}

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InvoicePageRoutingModule,
    DevExtremeModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [InvoicePage, InvoiceGridComponent, InvoiceTileComponent]
})
export class InvoicePageModule {}
