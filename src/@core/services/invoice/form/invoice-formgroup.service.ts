import { Injectable, NgZone } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Injectable()
export class InvoiceFormGroupService {
    private invoiceFormGroup  = new BehaviorSubject<FormGroup>(new FormGroup({}));
    public invoiceFormGroup$ = this.invoiceFormGroup.asObservable();

    private productsSubject = new BehaviorSubject<any>(null);
    public products$ = this.productsSubject.asObservable();

    //field to track user save invoice
    private saveInvoice = new BehaviorSubject<number>(0);

    constructor(private fb: FormBuilder, private ngZone: NgZone){
        let now : Date  = new Date();
        let id = now.getTime().toString();
        let formGroup = this.fb.group({
            "invoiceNo": this.fb.control('WASTRA/'+now.getFullYear()+ '/'+ now.getMonth()+ '/'+ now.getDay()+ '/'+id.slice(-6),[Validators.minLength(3)]),
            "clientVendorNo": this.fb.control(null),
            "buildingNo": this.fb.control(null),
            "eName": this.fb.control(null,[Validators.required]),
            "aName": this.fb.control(null,[Validators.required]),
            "dateG": this.fb.control(new Date(), [Validators.required]),
            "storeNo": this.fb.control(null),
            "billNo": this.fb.control(null),
            "note": this.fb.control(null),
            "subTotal": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "subTotalDiscount": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "subNetTotal": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "subNetTotalPlusTax": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "subCount": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "subQuantity": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "amountPayed01": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "amountPayed02": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "amountPayed03": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "amountLeft": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "amountCalculatedPayed": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "taxRate1_Percentage": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "taxRate1_Total": this.fb.control(0,[Validators.required, Validators.min(0)]),
            "invoiceVATID": this.fb.control(null),
            "VATTypeNo": this.fb.control(1),
            "VATGroupNo": this.fb.control(1),
            "userNumber": this.fb.control(1),
            "tel": this.fb.control(null),
            "invoice_items": this.fb.array([])
          });

        this.invoiceFormGroup.next(formGroup);
    }


    getInvoiceFormGroup(): Observable<FormGroup> {
        return this.invoiceFormGroup$.pipe(share());
    }

    setInvoiceFormGroup(invoice_db:FormGroup)
    {
        this.invoiceFormGroup.next(invoice_db);
    }

    getSaveInvoice(): Observable<number> {
        return this.saveInvoice.asObservable();
    }

    setSaveInvoice()
    {
        this.saveInvoice.next(new Date().getTime());
    }

    subtractYears(date :Date, years : number) 
    {
        const dateCopy = new Date(date);
      
        dateCopy.setFullYear(date.getFullYear() - years);
      
        return dateCopy;
    }
}
