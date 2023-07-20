import { Component, ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Event as NavigationEvent, Router } from '@angular/router';
import { filter, takeWhile } from 'rxjs/operators';
import { LoadingController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';

@Component({
  selector: 'app-main-layout',
  styleUrls: ['./main-layout.layout.scss'],
  templateUrl: './main-layout.layout.html',
})
export class MainLayoutComponent {
  
  showBackButton : boolean;
  showMenuButton : boolean;
  showSaveButton : boolean;
  showMarkButton : boolean;

  routeName = "Home";

  constructor(private menuController : MenuController, private elementRef: ElementRef,public router: Router, private location: Location, private _invoiceFormGroup: InvoiceFormGroupService,) {
    this.showBackButton = false;
    this.showMenuButton = true;
    this.showSaveButton = false;
    this.showMarkButton = false;

    router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe(event => {
      // "event" here is now of type "NavigationEnd"
      this.showBackButton = false;
          this.showMenuButton = true;
          this.showSaveButton = false;
          this.showMarkButton = false;

          console.log(event.url)
          
          switch(event.url)
          {
            
            case "/invoice" : 
              this.routeName = "Purchase Invoice"
            break;
            case "/add-invoice":
              this.routeName = "Purchase Invoice"
              this.showBackButton = true;
              this.showMenuButton = false;
              this.showSaveButton = true;
            break;
            case "/invoice-create-item":
              this.routeName = "Item Data"
              this.showBackButton = true;
              this.showMenuButton = false;
              this.showMarkButton = true;
            break;
          }
    });
    
  }

  goBack()
  {
    this.location.back();
  }

  saveInvoice()
  {
    this._invoiceFormGroup.setSaveInvoice();
  }
  
}
