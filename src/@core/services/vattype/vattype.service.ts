import { Injectable } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { StorageService } from '../storage/storage.service';
import { VATType, VATTypeModel } from 'src/@core/entity/vattype/vattype.model';



@Injectable({
  providedIn: 'root',
})
export class VATTypeService extends VATTypeModel {
    private vattypes  = new BehaviorSubject<Array<VATType>>([]);
    private db;

    constructor(private storage: StorageService){
        super();
        this.db = this.storage.openConnection();
    }

    VATTypes(): Observable<Array<VATType>> {
        return this.vattypes.pipe(share());
    }

    setVATType(vendor)
    {
        this.vattypes.next(vendor);
    }

    updateVATTypeFromDB() 
    {
        this.updateVATTypeList();
    }
    
    async updateVATTypeList() {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT * FROM VATType`;
                let query_parameter = [];

                tx.executeSql(
                  query ,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<VATType>();
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i));
                    }

                    this.setVATType(temp)
                  }
                );
              });
        });
        
      }

    createVATType(value: any) {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO VATType 
                    (
                        VATTypeNo, aName, eName
                    )
                    VALUES( ?, ?, ?);`

                    tx.executeSql(insert_query, 
                        [
                            value.VATTypeNo, value.aName, value.eName
                        ], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateVATTypeList()
              );
                
            });
    }

    createDefaultVATTypes()
    {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = ``

                    tx.executeSql(insert_query, 
                        [], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateVATTypeList()
              );
                
            });
        
    }

}
