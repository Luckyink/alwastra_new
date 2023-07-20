import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { takeWhile } from 'rxjs';
import { InvoiceBuy, InvoiceModel } from 'src/@core/entity/invoice/invoice.model';

export interface InvoiceBuyInterface 
{
  invoiceNumber : any,
  invoiceDate : any,
  VendorAraName ?: any,
  VendorEngName ?: any,
  Posted : any,
  Contact : any,
  InvoiceValue : any
}

@Component({
  selector: 'app-invoice-tile',
  templateUrl: './invoice-tile.component.html',
  styleUrls: ['./invoice-tile.component.scss'],
})
export class InvoiceTileComponent  implements OnInit, OnChanges, OnDestroy {
    @Input() dateRange?: any;
    @Input() branch?: any;
    @Input() vendor?: any;
    @Input() contact?: any;

    // tileViewData = [
    //   { "invoiceNumber": "1234", "invoiceDate" : "201",  "VendorAraName" : "Arabic", "VendorEngName" : "Eng", "Posted":"true", "Contact" :"255", "InvoiceValue": "2500USD"},
    //   { "invoiceNumber": "1234", "invoiceDate" : "202",  "VendorAraName" : "Arabic", "VendorEngName" : "Eng", "Posted":"true", "Contact" :"255", "InvoiceValue": "2500USD"},
    //   { "invoiceNumber": "1234", "invoiceDate" : "203",  "VendorAraName" : "Arabic", "VendorEngName" : "Eng", "Posted":"true", "Contact" :"255", "InvoiceValue": "2500USD"}  ];
  
    screenWidth = 0; 
    rowCount = 1;

    alive = true;

    invoices : Array<InvoiceBuy> = [];

    
    constructor(private invoiceService: InvoiceModel) { }

    @HostListener('window:resize', ['$event'])  
    onResize(event : any) {  
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 768)
      {
        this.rowCount = 5;
      }
      else
      {
        this.rowCount = 1;
      }
    }  

    ngOnInit() 
    {  

      this.invoiceService.updateInvoiceListFromDB(0, 25, this.dateRange, this.branch, this.vendor, this.contact);

      this.invoiceService.getInvoices()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        console.log(data);
        this.invoices = data;
      });

      this.screenWidth = window.innerWidth;
      
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 768)
      {
        this.rowCount = 5;
      }
      else
      {
        this.rowCount = 1;
      }
    } 
    
    get tileHeight()
    {
      let tileArea = 34*this.rowCount*this.invoices.length;
      let tileMarginAndBorder = this.invoices.length + 20 * this.invoices.length
      return tileArea + tileMarginAndBorder;// + extraBottomMargin;
    }

    ngOnChanges(changes: SimpleChanges): void {
      const dateRange: SimpleChange = changes.dateRange;
      const branch: SimpleChange = changes.branch;
      const vendor: SimpleChange = changes.vendor;
      const contact: SimpleChange = changes.contact;

      if(typeof(dateRange.currentValue) !== 'undefined') {
        this.dateRange = dateRange.currentValue;
      }

      if(typeof(branch.currentValue) !== 'undefined') {
        this.branch = branch.currentValue;
      }

      if(typeof(vendor.currentValue) !== 'undefined') {
        this.vendor = vendor.currentValue;
      }

      if(typeof(contact.currentValue) !== 'undefined') {
        this.contact = contact.currentValue;
      }

      this.invoiceService.updateInvoiceListFromDB(0, 25, this.dateRange, this.branch, this.vendor, this.contact);
      
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
