import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs';
import { BuildingModel, Store } from 'src/@core/entity/building/building.model';
import { VATType, VATTypeModel } from 'src/@core/entity/vattype/vattype.model';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';
import { VATTypeService } from 'src/@core/services/vattype/vattype.service';

@Component({
  selector: 'app-invoice-other',
  templateUrl: './invoice-other.component.html',
  styleUrls: ['./invoice-other.component.scss'],
})
export class InvoiceOtherComponent  implements OnInit, OnDestroy {
  stores : Array<Store> = [];
  vattypes :  Array<VATType> = [];
  alive = true;

  screenWidth = 0; 
  rowCount = 1;
  labelPosition = "left"
  fieldGroupOneColumnSpan : number;

  invoiceFormGroup : FormGroup = new FormGroup({});

  constructor(private buildingService : BuildingModel, private _invoiceFormGroup: InvoiceFormGroupService,
              private vatTypeService : VATTypeModel
    ) {
    this.fieldGroupOneColumnSpan = 1;

    _invoiceFormGroup.getInvoiceFormGroup()
    .pipe(takeWhile(() => this.alive))
    .subscribe((data) => {
      this.invoiceFormGroup = data;
    }); 

    //buildingService.createDefaultStores();
   }
  
   @HostListener('window:resize', ['$event'])  
    onResize(event : any) {  
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
        this.fieldGroupOneColumnSpan = 1;
        this.labelPosition = "top";

      }
      else
      {
        this.fieldGroupOneColumnSpan = 2;
        this.rowCount = 1;
        this.labelPosition = "left";

      }
    } 

  ngOnInit(): void {
    this.buildingService.updateStoreFromDB();

    this.buildingService.getStores()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.stores = data;
      });

    this.vatTypeService.VATTypes()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.vattypes = data;
      });

      this.screenWidth = window.innerWidth;
      
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
        this.fieldGroupOneColumnSpan = 1;
        this.labelPosition = "top";
      }
      else
      {
        this.fieldGroupOneColumnSpan = 2;
        this.rowCount = 1;
        this.labelPosition = "left";
      }
  }
  
  ngOnDestroy(): void {
    this.alive = false;
  }
}
