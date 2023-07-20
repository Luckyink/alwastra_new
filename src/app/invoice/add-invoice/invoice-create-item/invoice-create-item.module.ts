import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceCreateItemPageRoutingModule } from './invoice-create-item-routing.module';

import { InvoiceCreateItemPage } from './invoice-create-item.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CoreModule } from 'src/@core/core.module';
import { DevExtremeModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InvoiceCreateItemPageRoutingModule,
    DevExtremeModule,
    HttpClientModule
  ],
  declarations: [InvoiceCreateItemPage]
})
export class InvoiceCreateItemPageModule {}
