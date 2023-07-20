import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInvoicePageRoutingModule } from './add-invoice-routing.module';

import { AddInvoicePage } from './add-invoice.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CoreModule } from 'src/@core/core.module';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { DevExtremeModule } from 'devextreme-angular';
import { InvoiceOtherComponent } from './invoice-other/invoice-other.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddInvoicePageRoutingModule,
    DevExtremeModule,
    HttpClientModule
  ],
  declarations: [AddInvoicePage, InvoiceItemComponent, InvoiceOtherComponent]
})
export class AddInvoicePageModule {}
