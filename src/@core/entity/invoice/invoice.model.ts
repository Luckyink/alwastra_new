import { Observable } from "rxjs";

export interface InvoiceBuy {
    invoiceNo	: number,
    clientVendorNo	: number,
    aName	: string,
    eName	: string,
    dateG	: Date,
    storeNo	: number,
    isDeleted	: number,
    note	: string,
    subTotal	: number,
    subTotalDiscount	: number,
    subNetTotal	: number,
    subNetTotalPlusTax	: number,
    subCount	: number,
    subQuantity	: number,
    amountPayed01	: number,
    amountPayed02	: number,
    amountPayed03	: number,
    amountLeft	: number,
    amountCalculatedPayed	: number,
    taxRate1_Percentage	: number,
    taxRate1_Total	: number,
    invoiceVATID	: string,
    VATTypeNo	: number,
    VATGroupNo	: number,
    userNumber	: string,
    isPosted	: number,
    invoiceItems	: Array<InvoiceBuyUnit>,
    VendorAraName?: any,
    VendorEngName?: any,
    mainContact1: any
}

export interface InvoiceBuyUnit 
{
    invoiceNo	: number,
    buildingNo	: number,
    itemNo	: number,
    unitNo	: number,
    aName	: string,
    eName	: string,
    quantity	: number,
    price	: number,
    discount	: number,
    discountPercent	: number,
    discountTotal	: number,
    total	: number,
    totalPlusTax	: number,
    isPosted	: number,
    barCode	: string,
    taxRate1_Percentage	: number,
    taxRate1_Total	: number,
    storeNo	: number,
    itemCategoryNo	: number,
    itemClassificationTreeNo	: number,
    itemDepartmentNo	: number,
    itemModel	: string
}

export abstract class InvoiceModel {
    abstract createInvoice(data);
    abstract deleteInvoice(data);
    abstract createInvoiceBuyUnits(data): Observable<any>;
    abstract updateInvoiceListFromDB(page, limit, dateRange, branch, vendor, contact);
    abstract getInvoices(): Observable<Array<InvoiceBuy>>;
    // abstract getInvoiceSellUnits(): Observable<Array<InvoiceBuyUnit>>;
    abstract updateInvoiceSellsUnitListFromDB( invoice, page, limit);
}

