import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'invoice',
    loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule)
  }
  ,
  {
    path: 'add-invoice',
    loadChildren: () => import('./invoice/add-invoice/add-invoice.module').then( m => m.AddInvoicePageModule)
  },
  {
    path: 'invoice-create-item',
    loadChildren: () => import('./invoice/add-invoice/invoice-create-item/invoice-create-item.module').then( m => m.InvoiceCreateItemPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
