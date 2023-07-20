import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { observeOn, pairwise, startWith, takeWhile } from 'rxjs';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';
import { Location } from '@angular/common';
import { ItemModel, Item } from 'src/@core/entity/item/item.model';
import { Met_Unit, Met_UnitModel } from 'src/@core/entity/item/unit.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-create-item',
  templateUrl: './invoice-create-item.page.html',
  styleUrls: ['./invoice-create-item.page.scss'],
})
export class InvoiceCreateItemPage implements OnInit, OnDestroy {
  invoiceFormGroup : FormGroup = new FormGroup({}); // general invoice formgroup
  formGroup : FormGroup = new FormGroup({}); // item form group

  items : Array<Item> = [];
  selectedItem : any = null;
  updateIndex = null;

  units : Array<Met_Unit> = [];

  screenWidth = 0; 
  rowCount = 1;
  labelPosition = "left"
  fieldGroupOneColumnSpan : number;
  alive = true;

  operationMode = 'create'; // controlle mode if edit or create

  public toastButtons = [
    {
      text: 'Done',
      role: 'info',
      handler: () => {
        console.log("info");
        this.goBack();
      },
    },
    {
      text: 'Add More',
      role: 'cancel',
      handler: () => {
        console.log("dismiss");
        this.formGroup.reset();
      },
    },
  ];

  constructor(
              private _invoiceFormGroup: InvoiceFormGroupService, private fb: FormBuilder, 
              private metUnitService : Met_UnitModel, private alertController: AlertController,
              private route: Router, private itemSerice: ItemModel, 
              private toastController: ToastController, private activeRoute: ActivatedRoute
    ) { 
      this.fieldGroupOneColumnSpan = 1;
      this.updateIndex = null;

      //initialize item form group
      this.formGroup = this.fb.group({
        invoiceNo	: [null],
        buildingNo	: [null],
        barCode : [null],
        itemNo : [null, Validators.required],
        unitNo : [null, Validators.required],
        unitName : [null],
        price : [null, [Validators.required, Validators.min(0)]],
        quantity : [null, [Validators.required, Validators.min(0)]],
        discountPercent : [null, [ Validators.min(0), Validators.max(100)]],
        discount : [null, [ Validators.min(0)]],
        discountTotal : [null, [ Validators.min(0)]],
        taxRate1_Percentage : [null, [Validators.min(0), Validators.max(100)]],
        taxRate1_Total : [null, [ Validators.min(0)]],
        total : [null, [Validators.required, Validators.min(0)]],
        totalPlusTax : [null, [Validators.required, Validators.min(0)]],
        netValue : [null, [Validators.required, Validators.min(0)]],
        aName	: [null, [Validators.required, Validators.minLength(3)]],
        eName	: [null, [Validators.required, Validators.minLength(3)]],
        isPosted : [null, [Validators.min(0), Validators.max(1)]],
        storeNo	: [null],
        itemCategoryNo	: [null],
        itemClassificationTreeNo	: [null],
        itemDepartmentNo	: [null],
        itemModel	: [null]
      });


      
      //add changes listerners
      this.formGroup?.get('price')?.valueChanges.subscribe(value => {
        var price = value || 0;
        var quantity = this.formGroup.get('quantity')?.value || 0;
        
        this.formGroup.get('total')?.setValue( price * quantity);

      });

      this.formGroup?.get('quantity')?.valueChanges.subscribe(value => {
        var quantity = value || 0;
        var price = this.formGroup?.get('price')?.value || 0;

        this.formGroup?.get('total')?.setValue( price * quantity);

      });

      this.formGroup?.get('discount')?.valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any])  => {
        

        let total = this.formGroup.get('total')?.value;

        let percent = (next * 100)/total | 0;

        let vat_value = this.formGroup?.get('taxRate1_Total')?.value;

        this.formGroup?.get('discountPercent')?.setValue(percent );

        this.formGroup?.get('netValue')?.setValue((total-next)  + vat_value);

        //update invoice subTotalDiscount
        let subTotalDiscount = this.invoiceFormGroup.get("subTotalDiscount")?.value;
        subTotalDiscount = subTotalDiscount + (next - prev|0);

        this.invoiceFormGroup.get("subTotalDiscount")?.setValue(subTotalDiscount);
      });

      //looping effect disable this
      // this.formGroup?.get('discountPercent')?.valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any])  => {
        
      //   let total = this.formGroup.get('total')?.value;

      //   let discount = (next / 100)*total | 0;

      // });

      this.formGroup?.get('total')?.valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {

        let vat_percent = this.formGroup?.get('taxRate1_Percentage')?.value | 0;
        
        var vat_value = (next * vat_percent) / 100;

        let discount = this.formGroup?.get('discount')?.value | 0;

        let discountRercent = (discount * 100)/next | 0;
        
        this.formGroup?.get('discountPercent')?.setValue(discountRercent );

        this.formGroup?.get('taxRate1_Total')?.setValue(vat_value);

        this.formGroup?.get('totalPlusTax')?.setValue(next + vat_value);

        this.formGroup?.get('netValue')?.setValue((next-discount)  + vat_value);

        //update invoice subTotal
        let subTotal = this.invoiceFormGroup.get("subTotal")?.value;
        subTotal = subTotal + (next - prev|0);

        this.invoiceFormGroup.get("subTotal")?.setValue(subTotal);

      });

      this.formGroup?.get('taxRate1_Percentage')?.valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {
        
        var vat_percent = next;

        var total =  this.formGroup?.get('total')?.value | 0;
        
        var vat_value =  (vat_percent / 100) * total;

        let discount = this.formGroup?.get('discount')?.value | 0;

        this.formGroup?.get('taxRate1_Total')?.setValue(vat_value);

        this.formGroup?.get('totalPlusTax')?.setValue(total + vat_value);

        this.formGroup?.get('netValue')?.setValue((total-discount)  + vat_value);

        //update invoice 
        let taxRate1_Percentage = this.invoiceFormGroup.get("taxRate1_Percentage")?.value;
        taxRate1_Percentage = taxRate1_Percentage + (next - prev|0);

        this.invoiceFormGroup.get("taxRate1_Percentage")?.setValue(taxRate1_Percentage);
        
      });

      this.formGroup?.get('taxRate1_Total')?.valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {
        //update invoice taxRate1_Total
        let taxRate1_Total = this.invoiceFormGroup.get("taxRate1_Total")?.value;
        taxRate1_Total = taxRate1_Total + (next - prev|0);

        this.invoiceFormGroup.get("taxRate1_Total")?.setValue(taxRate1_Total);
      });


      this.formGroup?.get('netValue')?.valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {
        //update invoice subNetTotalPlusTax
        let subNetTotalPlusTax = this.invoiceFormGroup.get("subNetTotalPlusTax")?.value | 0;
        subNetTotalPlusTax = subNetTotalPlusTax + (next - prev|0);
        this.invoiceFormGroup.get("subNetTotalPlusTax")?.setValue(subNetTotalPlusTax);
      });

  }

  @HostListener('window:resize', ['$event'])  
    onResize(event : any) {  
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
        this.fieldGroupOneColumnSpan = 2;
        this.labelPosition = "top";

      }
      else
      {
        this.fieldGroupOneColumnSpan = 1;
        this.rowCount = 1;
        this.labelPosition = "left";
      }
    }  

    ngOnInit() 
    {  
      //set invoice formgroup from service
      this._invoiceFormGroup.getInvoiceFormGroup()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.invoiceFormGroup = data;

        //chief update mode or create mode
        this.activeRoute.queryParams
        .subscribe(params => {
          
            if(params.itemIndex != undefined)
            {
              let index = params.itemIndex;
              this.updateIndex = params.itemIndex;

              console.log("edit");
             
              this.operationMode = 'edit';

              //
              let formArray = (this.invoiceFormGroup.controls["invoice_items"] as FormArray);

              this.formGroup.get("itemNo")?.setValue(formArray.at(index).get("itemNo")?.value);
              this.formGroup.get("unitNo")?.setValue(formArray.at(index).get("unitNo")?.value);
              this.formGroup.get("aName")?.setValue(formArray.at(index).get("aName")?.value);
              this.formGroup.get("eName")?.setValue(formArray.at(index).get("eName")?.value);
              this.formGroup.get("quantity")?.setValue(formArray.at(index).get("quantity")?.value);
              this.formGroup.get("price")?.setValue(formArray.at(index).get("price")?.value);
              this.formGroup.get("discountPercent")?.setValue(formArray.at(index).get("discountPercent")?.value);
              this.formGroup.get("taxRate1_Percentage")?.setValue(formArray.at(index).get("taxRate1_Percentage")?.value);
              this.formGroup.get("barCode")?.setValue(formArray.at(index).get("barCode")?.value);
              this.formGroup.get("itemCategoryNo")?.setValue(formArray.at(index).get("itemCategoryNo")?.value);
              this.formGroup.get("itemClassificationTreeNo")?.setValue(formArray.at(index).get("itemClassificationTreeNo")?.value);
              this.formGroup.get("itemDepartmentNo")?.setValue(formArray.at(index).get("itemDepartmentNo")?.value);
              this.formGroup.get("itemModel")?.setValue(formArray.at(index).get("itemModel")?.value);


              //
            }
          }
        );
      });

      //initialize dropdowns
      this.itemSerice.updateItemFromDB();
      this.metUnitService.updateUnitFromDB();

      this.itemSerice.getItems().pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.items = data;
      });

      this.metUnitService.getMetUnits().pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.units = data;
      });

  
      this.screenWidth = window.innerWidth;
      
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
        this.fieldGroupOneColumnSpan = 2;
        this.labelPosition = "top";

      }
      else
      {
        this.fieldGroupOneColumnSpan = 1;
        this.rowCount = 1;
        this.labelPosition = "left";
      }
    } 

    ngOnDestroy(): void {
      this.alive = false;
    }

    addInvoiceItem()
    {
      let message = '';
      
      if(this.formGroup.valid)
      {
        //check if is update operation or create
        if(this.operationMode != 'edit')
        {
          (this.invoiceFormGroup.controls["invoice_items"] as FormArray).push(this.formGroup);
          message = 'Item Added!'
        }
        else
        {
          if(this.updateIndex != null)
          {
            (this.invoiceFormGroup.controls["invoice_items"] as FormArray).at(this.updateIndex).patchValue(this.formGroup.value);
            message = 'Item Updated!'
          }
        }

        this._invoiceFormGroup.setInvoiceFormGroup(this.invoiceFormGroup);
        
        this.successToast(message)

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

    async successToast(message : string) {
      const toast = await this.toastController.create({
        message: message,
        position: 'middle',
        cssClass: 'toast-success',
        buttons : this.toastButtons
      });
  
      await toast.present();
    }

    

    goBack()
    {
      this.route.navigate(['add-invoice']);
    }

    itemSelectionChanged(event:any)
    {
      console.log(event);
      
      this.selectedItem = this.items.find(o => o.itemNo === event.value);

      //set item specific data on the form
      this.formGroup.get("unitNo")?.setValue(this.selectedItem.unitNo_defaultSell);
      this.formGroup.get("aName")?.setValue(this.selectedItem.aName);
      this.formGroup.get("eName")?.setValue(this.selectedItem.eName);
      this.formGroup.get("price")?.setValue(this.selectedItem.buyPrice);
      this.formGroup.get("barCode")?.setValue(this.selectedItem.barCode);
      this.formGroup.get("itemCategoryNo")?.setValue(this.selectedItem.itemCategoryNo);
      this.formGroup.get("itemClassificationTreeNo")?.setValue(this.selectedItem.itemClassificationTreeNo);
      this.formGroup.get("itemDepartmentNo")?.setValue(this.selectedItem.itemDepartmentNo);
      this.formGroup.get("itemModel")?.setValue(this.selectedItem.itemModel);


    }

    unitSelectionChanged(event:any)
    {
      let selectedUnit = this.units.find(o => o.unitNo === event.value);

      //set item specific data on the form
      this.formGroup.get("unitName")?.setValue(selectedUnit?.eName);
    }

}
