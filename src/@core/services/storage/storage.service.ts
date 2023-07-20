import { Injectable } from '@angular/core';

// import { Storage } from '@ionic/storage-angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn:'root'
})
export class StorageService {
  constructor(private storage: SQLite) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    await this.storage.create({
      name: 'wastra.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [InvoiceBuy](
                [buildingNo] [decimal](28, 0) NOT NULL,
                [invoiceNo] [bigint] NOT NULL,
                [clientVendorNo] [decimal](21, 0) NULL,
                [userNumber] [nvarchar](20) NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                [dateG] [date] NOT NULL,
                [storeNo] [decimal](28, 0) NOT NULL,
                [isDeleted] [bit] NULL,
                [note] [TEXT] NULL,
                [subTotal] [decimal](18, 6) NULL,
                [subTotalDiscount] [decimal](18, 6) NULL,
                [subNetTotal] [decimal](18, 6) NULL,
                [subNetTotalPlusTax] [decimal](18, 6) NULL,
                [subCount] [int] NULL,
                [subQuantity] [decimal](18, 6) NULL,
                [amountPayed01] [decimal](18, 6) NULL,
                [amountPayed02] [decimal](18, 6) NULL,
                [amountPayed03] [decimal](18, 6) NULL,
                [amountLeft] [decimal](18, 6) NULL,
                [amountCalculatedPayed] [decimal](18, 6) NULL,
                [taxRate1_Percentage] [decimal](12, 7) NULL,
                [taxRate1_Total] [decimal](18, 6) NULL,
                [invoiceVATID] [nvarchar](50) NULL,
                [VATTypeNo] [smallint] NULL,
                [VATGroupNo] [smallint] NULL,
                [isPosted] [bit] NULL,
                [mainContact1] [nvarchar](50) NULL,
                [row_timestamp] [timestamp] NULL,
              PRIMARY KEY 
              (
                [buildingNo] ASC,
                [invoiceNo] ASC
              )
              )`, [])
              .then(() => console.log('InvoiceBuy Table Created SQL'))
          .catch(e => console.log(e));
          
          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [InvoiceBuyUnit](
                [invoiceNo] [bigint] NOT NULL,
                [buildingNo] [decimal](28, 0) NOT NULL,
                [itemNo] [decimal](28, 0) NOT NULL,
                [unitNo] [smallint] NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                [quantity] [decimal](18, 6) NOT NULL,
                [price] [decimal](18, 6) NOT NULL,
                [discount] [decimal](18, 6) NULL,
                [discountPercent] [decimal](12, 7) NULL,
                [discountTotal] [decimal](18, 6) NULL,
                [total] [decimal](18, 6) NULL,
                [totalPlusTax] [decimal](18, 6) NULL,
                [isPosted] [bit] NULL,
                [barCode] [nvarchar](24) NULL,
                [taxRate1_Percentage] [decimal](12, 7) NULL,
                [taxRate1_Total] [decimal](18, 6) NULL,
                [storeNo] [decimal](28, 0) NULL,
                [itemCategoryNo] [decimal](27, 0) NULL,
                [itemClassificationTreeNo] [decimal](27, 0) NULL,
                [itemDepartmentNo] [decimal](27, 0) NULL,
                [itemModel] [nvarchar](60) NULL,
                [row_timestamp] [timestamp] NULL,
               PRIMARY KEY
              (
                [invoiceNo] ASC,
                [buildingNo] ASC,
                [itemNo] ASC
              )
              )`, [])
              .then(() => console.log('InvoiceBuyUnit Table Created SQL'))
          .catch(e => console.log(e));
          
          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [Building](
                [buildingNo] [decimal](28, 0) NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
               PRIMARY KEY
              (
                [buildingNo] ASC
              )
              );
              `, [])
              .then(() => console.log('Building Table Created SQL'))
          .catch(e => console.log(e));

          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [Item](
                [itemNo] [bigint] NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                [itemClassificationTreeNo] [bigint] NULL,
                [itemCategoryNo] [bigint] NULL,
                [barCode] [nvarchar](250) NULL,
                [buyPrice] [decimal](28, 0) NULL,
                [unitNo_defaultSell] [bigint] NULL,
                [itemDepartmentNo] [bigint] NULL,
                [itemModel] [nvarchar](250) NULL,
                PRIMARY KEY
              (
                [itemNo] ASC
              )
              )`, [])
              .then(() => console.log('item Table Created SQL'))
          .catch(e => console.log(e));

          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [Met_Unit](
                [unitNo] [bigint] NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                PRIMARY KEY
                (
                  [unitNo] ASC
                )
              )`, [])
              .then(() => console.log('units Table Created SQL'))
          .catch(e => console.log(e));
          
          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [ClientVendor](
                [clientVendorNo] [bigint] NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                [VATID] [bigint] NULL,
                PRIMARY KEY
                (
                  [clientVendorNo] ASC
                )
              )`, [])
              .then(() => console.log('client vendor Table Created SQL'))
          .catch(e => console.log(e));


          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [Store](
                [storeNo] [bigint] NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                PRIMARY KEY
                (
                  [storeNo] ASC
                )
              )`, [])
              .then(() => console.log('storeNo Table Created SQL'))
          .catch(e => console.log(e));

          db.executeSql(`
              CREATE TABLE IF NOT EXISTS [VATType](
                [VATTypeNo] [bigint] NOT NULL,
                [aName] [nvarchar](250) NOT NULL,
                [eName] [nvarchar](250) NULL,
                PRIMARY KEY
                (
                  [VATTypeNo] ASC
                )
              )`, [])
              .then(() => console.log('VATType Table Created SQL'))
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e));


  }

  openConnection()
  {
    return this.storage.create({
      name: 'wastra.db',
      location: 'default'
    });
  }

}