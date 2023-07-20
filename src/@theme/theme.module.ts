import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from 'src/@core/module-import-guard';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.layout';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { CoreModule } from 'src/@core/core.module';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';
const DATA_SERVICES = [
];

export const CORE_PROVIDERS = [
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(), 
    RouterModule
    ],
  exports: [
    MainLayoutComponent
  ],
  declarations: [
    MainLayoutComponent
  ],
  providers:[InvoiceFormGroupService]
})
export class ThemeModule {
  constructor(@Optional() @SkipSelf() parentModule: ThemeModule) {
    throwIfAlreadyLoaded(parentModule, 'ThemeModule');
  }

  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...CORE_PROVIDERS,
      ],
    };
  }
}
