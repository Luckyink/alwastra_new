import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceCreateItemPage } from './invoice-create-item.page';
import { CoreModule } from 'src/@core/core.module';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';
import { DevExtremeModule } from 'devextreme-angular';

const routes: Routes = [
  {
    path: '',
    component: InvoiceCreateItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), DevExtremeModule],
  exports: [RouterModule]})
export class InvoiceCreateItemPageRoutingModule {}
