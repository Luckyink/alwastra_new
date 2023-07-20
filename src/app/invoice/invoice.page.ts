import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs';
import { Building, BuildingModel } from 'src/@core/entity/building/building.model';
import { ClientVendor, ClientVendorModel } from 'src/@core/entity/vendor/vendor.model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit, OnDestroy {
  
  isGridView = false;
  alive = true;

  invoiceFilterFormGroup : FormGroup = new FormGroup({});
  vendors : Array<ClientVendor> = [];
  buildings : Array<Building> = [];

  invoiceFilter = {
      from: new Date(),
      to: new Date(),
      branch: null,
      vendor: null,
      contact: null
  }

  constructor(private fb: FormBuilder, private vendorService: ClientVendorModel, private buildingService : BuildingModel
    ) {}

  ngOnInit() {
    
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

    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    const initialValue: [Date, Date] = [
      new Date(now.getTime() - msInDay * 3),
      new Date(now.getTime() + msInDay * 3),
    ];

    this.invoiceFilterFormGroup = this.fb.group({
      "dateRange": this.fb.control(initialValue),
      "buildingNo": this.fb.control(null),
      "clientVendorNo": this.fb.control(null),
      "contact": this.fb.control(null),
    });

  }

  toggleGridTileView()
  {
    this.isGridView = !this.isGridView;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  get dateRange()
  {
    return this.invoiceFilterFormGroup.get("dateRange")?.value;
  }

  get branch()
  {
    return this.invoiceFilterFormGroup.get("branch")?.value;
  }

  get vendor()
  {
    return this.invoiceFilterFormGroup.get("vendor")?.value;
  }

  get contact()
  {
    return this.invoiceFilterFormGroup.get("contact")?.value;
  }
}
