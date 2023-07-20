import { Component, HostListener, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { takeWhile } from 'rxjs';
import { InvoiceFormGroupService } from 'src/@core/services/invoice/form/invoice-formgroup.service';

export interface ItemInterface 
{
  barCode : any,
  itemNo : any,
  unitNo ?: any,
  unitName ?: any,
  price : any,
  quantity : any,
  discountPercent : any,
  discount : any,
  discountTotal : any,
  taxRate1_Percentage : any,
  taxRate1_Total : any,
  total : any,
  totalPlusTax : any,
  netValue : any,
  aName	: any,
  eName	: any,	
}

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent  implements OnInit {
  // @Input() items: FormArray;
  
  name : String = "";
  alive = true;

  invoiceFormGroup : FormGroup = new FormGroup({});

  screenWidth = 0; 
  rowCount = 1;
  selectedIndex = 0;

  public confirmButtons = [
    {
      text: 'Confirm',
      role: 'info',
      handler: () => {
        this.removeItem();
      },
    },
    {
      text: 'Cancel',
      role: 'cancel'
    },
  ];
  constructor(private router: Router, private _invoiceFormGroup: InvoiceFormGroupService, 
    private toastController: ToastController, private actionSheetCtrl: ActionSheetController) {
    
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
      }
      else
      {
        this.rowCount = 1;
      }
    }    

    ngOnInit() 
    {  
      this.screenWidth = window.innerWidth;
      
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
      }
      else
      {
        this.rowCount = 1;
      }
    } 

    get invoiceItemFormArray()
    {
      let invoiceItems = (this.invoiceFormGroup.controls["invoice_items"] as FormArray).value
     
      let dispalyItemArray : Array<ItemInterface> = [];
      //push header
      dispalyItemArray.push({
        barCode : "BarCode",
        itemNo : "ItemCode",
        unitName : "Unit",
        price : "Price",
        quantity : "Qty",
        discountPercent : "Discount(%)",
        discount : "Discount",
        discountTotal : "DiscountTotal",
        taxRate1_Percentage : "Tax(%)",
        taxRate1_Total : "TaxAmount",
        total : "Total",
        totalPlusTax : "TotalPlusVAT",
        netValue : "Net",
        aName	: "aName",
        eName	: "eName"	
      });
      //push content
      dispalyItemArray.push(...invoiceItems);

      return dispalyItemArray;
    }
    
    get tileHeight()
    {
      let formLength = this.invoiceItemFormArray.length;
      let tileArea = 34 * this.rowCount * (  formLength  + 1 );
      let tileMarginAndBorder = (formLength + 1 ) + 20 * ( formLength + 1 )
      // let extraBottomMargin = 68;
      return tileArea + tileMarginAndBorder ;//+ extraBottomMargin;
    }

    AddItemLink()
    {
      this.router.navigate(['invoice-create-item']);
    }

    removeItem()
    {
      //update invoice subTotal
      let formArray = (this.invoiceFormGroup.controls["invoice_items"] as FormArray);
      let formAtindex = formArray.at(this.selectedIndex);

      let total = formAtindex.get("total")?.value;
      let discount = formAtindex.get("discount")?.value | 0;
      let discountPercent = formAtindex.get("discountPercent")?.value  | 0;
      let netValue = formAtindex.get("netValue")?.value;
      let taxRate1_TotalF = formAtindex.get("taxRate1_Total")?.value  | 0;
      let taxRate1_PercentageF = formAtindex.get("taxRate1_Percentage")?.value  | 0;
      let totalPlusTax = formAtindex.get("totalPlusTax")?.value  | 0;
      
      //update subtotal
      let subTotal = this.invoiceFormGroup.get("subTotal")?.value;
      subTotal = subTotal - total;
      this.invoiceFormGroup.get("subTotal")?.setValue(subTotal);
      
      //update invoice subTotalDiscount
      let subTotalDiscount = this.invoiceFormGroup.get("subTotalDiscount")?.value;
      subTotalDiscount = subTotalDiscount - discount ;
      this.invoiceFormGroup.get("subTotalDiscount")?.setValue(subTotalDiscount);

      //update invoice taxRate1_Percentage
      let taxRate1_Percentage = this.invoiceFormGroup.get("taxRate1_Percentage")?.value;
      taxRate1_Percentage = taxRate1_Percentage - taxRate1_PercentageF ;
      this.invoiceFormGroup.get("taxRate1_Percentage")?.setValue(taxRate1_Percentage);

      //update invoice taxRate1_Total
      let taxRate1_Total = this.invoiceFormGroup.get("taxRate1_Total")?.value;
      taxRate1_Total = taxRate1_Total - taxRate1_TotalF ;
      this.invoiceFormGroup.get("taxRate1_Total")?.setValue(taxRate1_Total);

      //update invoice subNetTotalPlusTax
      let subNetTotalPlusTax = this.invoiceFormGroup.get("subNetTotalPlusTax")?.value;
      subNetTotalPlusTax = subNetTotalPlusTax - netValue ;
      this.invoiceFormGroup.get("subNetTotalPlusTax")?.setValue(subNetTotalPlusTax);

      (this.invoiceFormGroup.controls["invoice_items"] as FormArray).removeAt(this.selectedIndex);

      this._invoiceFormGroup.setInvoiceFormGroup(this.invoiceFormGroup);
    }

    async confirmDeleteItemToast( index) {
      this.selectedIndex = index;
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Are you sure?',
        buttons: this.confirmButtons,
      });
  
      actionSheet.present();

    }


    editItem(index)
    {
      console.log("item edit click")
      this.router.navigate(
        ['invoice-create-item'],
        { queryParams: { itemIndex:  index} }
      );
    }




}
