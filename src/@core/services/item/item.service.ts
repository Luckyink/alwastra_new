import { Injectable } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { StorageService } from '../storage/storage.service';
import { ItemModel, Item } from 'src/@core/entity/item/item.model';



@Injectable({
  providedIn: 'root',
})
export class ItemService extends ItemModel {
    private items  = new BehaviorSubject<Array<Item>>([]);
    private db;

    constructor(private storage: StorageService){
        super();
        this.db = this.storage.openConnection();
    }

    getItems(): Observable<Array<Item>> {
        return this.items.pipe(share());
    }

    setItem(item)
    {
        this.items.next(item);
    }

    updateItemFromDB() 
    {
        this.updateItemList();
    }
    
    async updateItemList() {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT * FROM [Item]`;
                let query_parameter = [];

                tx.executeSql(
                  query ,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<Item>();
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i));
                    }

                    this.setItem(temp)
                  }
                );
              });
        });
        
    }

    createItem(value: any){
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [Item] 
                    (
                        itemNo, aName, eName, barCode, unitNo_defaultSell, buyPrice, itemCategoryNo, itemClassificationTreeNo, itemDepartmentNo, itemModel
                    )
                    VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                    tx.executeSql(insert_query, 
                        [
                            value.itemNo, value.aName, value.eName,
                            value.barCode, value.unitNo_defaultSell, value.buyPrice,
                            value.itemCategoryNo, value.itemClassificationTreeNo, value.itemDepartmentNo,
                            value.itemModel
                        ], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateItemList()
              );
                
            });
    }

    createDefaultItem()
    {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [Item] 
                    VALUES
                    ('1','خاتم ذهب - خطوبة','New Item - 1','1','1','0.000000','NULL','NULL','NULL','NULL'),
                    ('2','ماسورة 4 بوصة 110 الجودة ا','name of item 2','2','1','61.000000','1','NULL','NULL','ت2'),
                    ('3','ماسوة 6 بوصة بحريني e1','name of item 3','3','6','62.000000','1','NULL','9','N28-3'),
                    ('4','ماسورة 4 بوصة بحرينيg','name of item 4','4','1','63.000000','1','NULL','NULL','N28-4'),
                    ('5','ماورة 6 بوصة بحريني','name of item 5','5','1','64.000000','1','NULL','NULL','N28-5'),
                    ('6','ماسورة 3 بوصة ثقيل الجودة','name of item 6','6','1','65.000000','1','NULL','NULL','N28-6'),
                    ('7','ماس 3 بوصة خ','name of item 7','7','1','66.000000','1','NULL','NULL','N28-7'),
                    ('8','ماسورة ثاثة بوصة رمادي','name of item 8','8','1','67.000000','1','NULL','NULL','N28-8'),
                    ('9','مورة 2 بوصة رمادي','name of item 9 ب','9','1001','68.000000','1','NULL','NULL','N28-9'),
                    ('10','اسورة 2 بوصة ابيض الجودة','name of item 10','123-563','1','69.000000','1','NULL','NULL','N28-10'),
                    ('11','ماسورة 2 بوصة خفيف','name of item 11','p123456','1','70.000000','1','NULL','NULL','N28-11'),
                    ('12','ماسورة 1.5 بوصة رمادي','name of item 12','p123-m123','1','71.000000','1','NULL','NULL','N28-12'),
                    ('13','فص 1589','name of item 13','13','4','72.000000','1','4','6','N28-13'),
                    ('14','yuyu9 f','name of item 14','14','1','6.000000','3','4','6','N28-14'),
                    ('15','ماي كلاود 1588','name of item 15','15','2','6.000000','3','4','6','N28-15')`

                    tx.executeSql(insert_query, 
                        [], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateItemList()
              );
                
            });
        
    }

}
