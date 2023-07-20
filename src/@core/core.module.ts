import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DevExtremeModule } from 'devextreme-angular';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './services/data.service';
import { InvoiceFormGroupService } from './services/invoice/form/invoice-formgroup.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { InvoiceModel } from './entity/invoice/invoice.model';
import { InvoiceService } from './services/invoice/invoice-buy.service';
import { StorageService } from './services/storage/storage.service';
import { BuildingModel } from './entity/building/building.model';
import { BuildingService } from './services/building/building.service';
import { ItemModel } from './entity/item/item.model';
import { ItemService } from './services/item/item.service';
import { Met_UnitModel } from './entity/item/unit.model';
import { Met_UnitService } from './services/item/unit.service';
import { ClientVendorModel } from './entity/vendor/vendor.model';
import { ClientVendorService } from './services/vendor/vendor.service';
import { VATTypeModel } from './entity/vattype/vattype.model';
import { VATTypeService } from './services/vattype/vattype.service';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const DATA_SERVICES = [
  { provide: InvoiceModel, useClass: InvoiceService },
  { provide: BuildingModel, useClass: BuildingService },
  { provide: ItemModel, useClass: ItemService },
  { provide: ClientVendorModel, useClass: ClientVendorService },
  { provide: Met_UnitModel, useClass: Met_UnitService },
  { provide: VATTypeModel, useClass: VATTypeService },
  DataService,
  SQLite,
  StorageService
];

export const CORE_PROVIDERS = [
  ...DATA_SERVICES
];

const THEME_PROVIDERS = [
];

@NgModule({
  imports: [
    ...BASE_MODULES
  ],
  exports: [
    ...BASE_MODULES
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...CORE_PROVIDERS,
      ],
    };
  }
}
