import { Injectable } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { StorageService } from '../storage/storage.service';
import { ClientVendor, ClientVendorModel } from 'src/@core/entity/vendor/vendor.model';



@Injectable({
  providedIn: 'root',
})
export class ClientVendorService extends ClientVendorModel {
    private vendors  = new BehaviorSubject<Array<ClientVendor>>([]);
    private db;

    constructor(private storage: StorageService){
        super();
        this.db = this.storage.openConnection();
    }

    clientVendors(): Observable<Array<ClientVendor>> {
        return this.vendors.pipe(share());
    }

    setClientVendor(vendor)
    {
        this.vendors.next(vendor);
    }

    updateClientVendorFromDB() 
    {
        this.updateClientVendorList();
    }
    
    async updateClientVendorList() {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT * FROM ClientVendor`;
                let query_parameter = [];

                tx.executeSql(
                  query ,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<ClientVendor>();
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i));
                    }

                    this.setClientVendor(temp)
                  }
                );
              });
        });
        
      }

    createClientVendor(value: any) {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO ClientVendor 
                    (
                        ClientVendorNo, aName, eName, VATID
                    )
                    VALUES( ?, ?, ?, ?);`

                    tx.executeSql(insert_query, 
                        [
                            value.ClientVendorNo, value.aName, value.eName
                        ], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateClientVendorList()
              );
                
            });
    }

    createDefaultClientVendors()
    {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [ClientVendor] 
                    VALUES
                    ('1','عميل آجل','Credit Client','NULL'),
                    ('2','مورد 2','مورد 2','3001234567892'),
                    ('3','مورد3','مورد3','3001234567893'),
                    ('4','4','4','3001234567894'),
                    ('5','5','5','3001234567895');`

                    tx.executeSql(insert_query, 
                        [], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateClientVendorList()
              );
                
            });
        
    }

}
