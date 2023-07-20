import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicePage } from './invoice.page';
import { DevExtremeModule } from 'devextreme-angular';

const routes: Routes = [
  {
    path: '',
    component: InvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), DevExtremeModule],
  exports: [RouterModule],
})
export class InvoicePageRoutingModule {}
