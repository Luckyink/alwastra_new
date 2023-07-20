import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription, takeWhile } from 'rxjs';
import { Building, BuildingModel } from 'src/@core/entity/building/building.model';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ClientVendor, ClientVendorModel } from 'src/@core/entity/vendor/vendor.model';
import { InvoiceModel } from 'src/@core/entity/invoice/invoice.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.page.html',
  styleUrls: ['./add-invoice.page.scss'],
})
export class AddInvoicePage implements OnInit, OnDestroy {
  segment: string;
  alive = true;
  screenWidth = 0; 
  rowCount = 1;
  labelPosition = "left"
  fieldGroupOneColumnSpan : number;

  invoiceFormGroup : FormGroup = new FormGroup({});
  buildings : Array<Building> = [];
  vendors : Array<ClientVendor> = [];
  position: number = 0;

  
  constructor(private _invoiceFormGroup: InvoiceFormGroupService, private buildingService : BuildingModel, private toastController: ToastController,
    private route: Router, private vendorService: ClientVendorModel, private invoiceService: InvoiceModel
    ) { 
    this.segment = 'items';
    this.fieldGroupOneColumnSpan = 1;

    _invoiceFormGroup.getInvoiceFormGroup()
    .pipe(takeWhile(() => this.alive))
    .subscribe((data) => {
      this.invoiceFormGroup = data;
    }); 
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

    ngOnInit() 
    {  
      
      this.buildingService.updateBuildingFromDB();
      
      this.vendorService.updateClientVendorFromDB();

      this.buildingService.getBuildings()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.buildings = data;
      });

      this.vendorService.clientVendors()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.vendors = data;
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

    postButtonOptions: any = {
      text: 'Post',
      useSubmitBehavior: false,
    };

    newInvoiceButtonOptions: any = {
      text: 'New Invoice',
      useSubmitBehavior: false,
    };

    goBack()
    {
      this.route.navigate(['invoice']);
    }

    saveInvoice()
    {
      //
      let message = '';
      
      if(this.invoiceFormGroup.valid)
      {
        this.invoiceService.createInvoice(this.invoiceFormGroup.value);
      }
      else
      {
        this.validationToast('Please fill all required info!');
      }
    }

    async validationToast(message : string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 1500,
        position: 'middle',
        cssClass: 'toast-error'
      });
  
      await toast.present();
    }

}
