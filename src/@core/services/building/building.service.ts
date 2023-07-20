import { Injectable } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { StorageService } from '../storage/storage.service';
import { Building, BuildingModel, Store } from 'src/@core/entity/building/building.model';



@Injectable({
  providedIn: 'root',
})
export class BuildingService extends BuildingModel {
    private buildings  = new BehaviorSubject<Array<Building>>([]);
    private stores  = new BehaviorSubject<Array<Store>>([]);
    private db;

    constructor(private storage: StorageService){
        super();
        this.db = this.storage.openConnection();
    }

    getBuildings(): Observable<Array<Building>> {
        return this.buildings.pipe(share());
    }

    setBuilding(build)
    {
        this.buildings.next(build);
    }

    updateBuildingFromDB() 
    {
        this.updateBuildingList();
    }
    
    async updateBuildingList() {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT * FROM Building`;
                let query_parameter = [];

                tx.executeSql(
                  query ,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<Building>();
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i));
                    }

                    this.setBuilding(temp)
                  }
                );
              });
        });
        
      }

    createBuilding(value: any) {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO Building 
                    (
                        buildingNo, aName, eName
                    )
                    VALUES( ?, ?, ?);`

                    tx.executeSql(insert_query, 
                        [
                            value.buildingNo, value.aName, value.eName
                        ], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateBuildingList()
              );
                
            });
    }

    createDefaultBuildings()
    {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [Building] Values
                    ('0','مباني المؤسسة','Company Branches'),
                    ('1','فرع رئيسي','Main Branch'),
                    ('2','فرع 2','Branch 2'),
                    ('3','فرع 3','Branch 3'),
                    ('4','فرع 4','Branch 4'),
                    ('5','Branch 3','Branch 5');`

                    tx.executeSql(insert_query, 
                        [], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateBuildingList()
              );
                
            });
        
    }


    //store
    getStores(): Observable<Array<Store>> {
        return this.stores.pipe(share());
    }

    setStore(build)
    {
        this.stores.next(build);
    }

    updateStoreFromDB() 
    {
        this.updateStoreList();
    }
    
    async updateStoreList() {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT * FROM Store`;
                let query_parameter = [];

                tx.executeSql(
                  query ,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<Store>();
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i));
                    }

                    this.setStore(temp)
                  }
                );
              });
        });
        
      }

    createStore(value: any) {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO Store 
                    (
                        storeNo, aName, eName
                    )
                    VALUES( ?, ?, ?);`

                    tx.executeSql(insert_query, 
                        [
                            value.storeNo, value.aName, value.eName
                        ], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateStoreList()
              );
                
            });
    }

    createDefaultStores()
    {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [Store] Values
                    ('0','مباني المؤسسة','Company Stores'),
                    ('1','فرع رئيسي','Main Store'),
                    ('2','فرع 2','Store 2'),
                    ('3','فرع 3','Store 3'),
                    ('4','فرع 4','Store 4'),
                    ('5','Store 3','Store 5');`

                    tx.executeSql(insert_query, 
                        [], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateStoreList()
              );
                
            });
        
    }

}
