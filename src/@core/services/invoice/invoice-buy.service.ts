import { Injectable } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { InvoiceBuy, InvoiceModel, InvoiceBuyUnit } from 'src/@core/entity/invoice/invoice.model';
import { StorageService } from '../storage/storage.service';



@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends InvoiceModel {
    private invoices  = new BehaviorSubject<Array<InvoiceBuy>>([]);
    private InvoiceBuyUnits = new BehaviorSubject<Array<InvoiceBuyUnit>>([]);
    private db;

    constructor(private storage: StorageService){
        super();
        this.db = this.storage.openConnection();
    }

    getInvoices(): Observable<Array<InvoiceBuy>> {
        return this.invoices.pipe(share());
    }

    setInvoices(invoice_db)
    {
        this.invoices.next(invoice_db);
    }

    setInvoiceBuyUnits(invoice_sell_units_db)
    {
        this.InvoiceBuyUnits.next(invoice_sell_units_db);
    }

    getInvoiceBuyUnits(): Observable<Array<InvoiceBuyUnit>> {
        return this.InvoiceBuyUnits.pipe(share());
    }

    updateInvoiceListFromDB(page = 0, limit = 25, dateRange, branch, vendor, contact) 
    {
        this.updateInvoiceList(page, limit, dateRange, branch, vendor, contact);
    }
    
    async updateInvoiceList(page, limit, dateRange, branch, vendor, contact) {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT InvoiceBuy.*, ClientVendor.eName as VendorEngName, ClientVendor.aName as VendorAraName   FROM InvoiceBuy JOIN ClientVendor ON ( InvoiceBuy.clientVendorNo = ClientVendor.clientVendorNo) `;
                // let query_parameter = [moment(dateRange[0]).format('YYYY-MM-DD'), moment(dateRange[1]).format('YYYY-MM-DD')];
                let query_parameter : any[] = [];
                // add date range filter
                query += ` WHERE 1=1 `; // disable range for now ` WHERE dateG BETWEEN ? AND ? `;
                
                

                if(branch != null)
                {
                    query += ` AND buildingNo = ? `;
                    query_parameter = [...query_parameter, branch];
                }

                if(vendor != null)
                {
                    query += ` AND clientVendorNo = ? `;
                    query_parameter = [...query_parameter, vendor];
                }

                if(contact != null)
                {
                    query += ` AND mainContact1 LIKE ? `;
                    query_parameter = [...query_parameter, '%' +contact+ '%'];
                }

                query_parameter = [...query_parameter, limit, page];
                

                tx.executeSql(
                  query + ` LIMIT ? OFFSET ?`,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<InvoiceBuy>();
                    
                    for (let i = 0; i < res.rows.length; i++) {

                        //get invoice sell unit
                        await tx.executeSql(
                            `SELECT * FROM InvoiceBuyUnit WHERE invoiceNo = ?`,
                            [res.rows.item(i).invoiceNo],
                            (_, invoiceSellRes) => {
                                let temp_sel = new Array<InvoiceBuyUnit>();
                                
                                for (let j = 0; j < invoiceSellRes.rows.length; j++) {
                                    temp_sel.push(invoiceSellRes.rows.item(i));
                                }

                                res.rows.item(i)["invoiceItems"] = temp_sel;

                            });


                        temp.push(res.rows.item(i));
                    }

                    this.setInvoices(temp)
                  },function(tx, error) {
                    console.log('SELECT error: ' + error.message);
                }
                );
              });
        });
        
      }

    createInvoice(value: any) {
        console.log(`--------------------------------------------------------`);
        console.log(value);
        console.log(`--------------------------------------------------------`);
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO InvoiceBuy 
                    (
                        invoiceNo, clientVendorNo, aName, eName,
                        dateG, storeNo , note, subTotal, 
                        subTotalDiscount, subNetTotal, subNetTotalPlusTax, subCount, 
                        subQuantity, amountPayed01, amountPayed02, amountPayed03,
                        amountLeft, amountCalculatedPayed, taxRate1_Percentage, taxRate1_Total,
                        invoiceVATID, VATTypeNo, VATGroupNo, userNumber, isPosted, mainContact1, buildingNo
                    )
                    VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                    tx.executeSql(insert_query, 
                        [
                            value.invoiceNo, value.clientVendorNo, value.aName, value.eName,
                            value.dateG, value.storeNo, value.note, value.subTotal, 
                            value.subTotalDiscount, value.subNetTotal, value.subNetTotalPlusTax,
                            value.subCount, value.subQuantity, value.amountPayed01, value.amountPayed02,
                            value.amountPayed03, value.amountLeft, value.amountCalculatedPayed, value.taxRate1_Percentage,
                            value.taxRate1_Total, value.invoiceVATID, 1, 1, 1, 
                            value.isPosted, value.mainContact1, value.buildingNo
                        ], function(tx, rs) 
                        {
                            //insert invoice items
                            for (let j = 0; j < value.invoice_items.length; j++) {
                                let invoice_item = value.invoice_items[j];
                                //
                                let item_insert_query = `INSERT INTO InvoiceBuyUnit 
                                    (
                                        invoiceNo, buildingNo, itemNo, unitNo, aName, eName,
                                        quantity, price , discount, discountPercent, discountTotal,
                                        total, totalPlusTax, isPosted, barCode, taxRate1_Percentage, 
                                        taxRate1_Total, storeNo, itemCategoryNo, itemClassificationTreeNo, 
                                        itemDepartmentNo, itemModel
                                    )
                                    VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
                                    
                                    tx.executeSql(item_insert_query, 
                                        [
                                            value.invoiceNo, value.buildingNo, invoice_item.itemNo, invoice_item.unitNo,
                                            invoice_item.aName, invoice_item.eName, invoice_item.quantity, invoice_item.price,
                                            invoice_item.discount, invoice_item.discountPercent, invoice_item.discountTotal, invoice_item.total,
                                            invoice_item.totalPlusTax, invoice_item.isPosted, invoice_item.barCode, invoice_item.taxRate1_Percentage,
                                            invoice_item.taxRate1_Total, value.storeNo, invoice_item.itemCategoryNo, invoice_item.itemClassificationTreeNo,
                                            invoice_item.itemDepartmentNo, value.itemModel
                                        ], function(tx, rs) 
                                        {
                                            console.log('INSERT Item done: ');
                                        }, function(tx, error) 
                                        {
                                            console.log('INSERT Item error: ' + error.message);
                                        });

                            }

                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateInvoiceList(0,25, null, null, null, null)
              );
                
            });

            

    }

    deleteInvoice(value: any) {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `DELETE FROM InvoiceBuy WHERE  invoiceNo = ?`

                    tx.executeSql(insert_query, 
                        [
                            value
                        ], function(tx, rs) {
                        console.log('DELETE done: ');
                    },function(tx, error) {
                        console.log('DELETE error: ' + error.message);
                    });
                },
                null, 
                this.updateInvoiceList(0,25, null, null, null, null)
              );
                
            });

            

    }

    updateInvoiceBuyUnitListFromDB(invoice, page = 0, limit = 25) 
    {
        let db = this.storage.openConnection();
        db.then(data => {
                    data.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM InvoiceBuyUnit WHERE invoiceNo = ?', [invoice, limit, page], function(tx, rs) {
                        // this.setInvoices(rs);
                    },function(tx, error) {
                        console.log('SELECT error: ' + error.message);
                    });
                });
            });
    }

    createInvoiceBuyUnits(value: any): Observable<any> {
        return observableOf(null);
    }

    updateInvoiceSellsUnitListFromDB(invoice: any, page: any, limit: any) {
        return observableOf(null);
    }

}
