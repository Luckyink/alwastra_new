import { Injectable } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { StorageService } from '../storage/storage.service';
import { Met_Unit, Met_UnitModel } from 'src/@core/entity/item/unit.model';



@Injectable({
  providedIn: 'root',
})
export class Met_UnitService extends Met_UnitModel {
    private units  = new BehaviorSubject<Array<Met_Unit>>([]);
    private db;

    constructor(private storage: StorageService){
        super();
        this.db = this.storage.openConnection();
    }

    getMetUnits(): Observable<Array<Met_Unit>> {
        return this.units.pipe(share());
    }

    setUnit(unit)
    {
        this.units.next(unit);
    }

    updateUnitFromDB() 
    {
        this.updateUnitList();
    }
    
    async updateUnitList() {
        await this.db.then(data => {
            data.transaction(tx => {
                let query = `SELECT * FROM [Met_Unit]`;
                let query_parameter = [];

                tx.executeSql(
                  query ,
                  query_parameter,
                  async (_, res) => {
                    let temp = new Array<Met_Unit>();
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i));
                    }

                    this.setUnit(temp)
                  }
                );
              });
        });
        
    }

    createUnit(value: any){
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [Met_Unit] 
                    (
                        unitNo, aName, eName
                    )
                    VALUES( ?, ?, ?);`

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
                this.updateUnitList()
              );
                
            });
    }

    createDefaultUnit()
    {
        this.db.then(data => {
            data.transaction(
                tx => {
                    let insert_query = `INSERT INTO [Met_Unit] VALUES
                    ('0','لا شيء','Nothing'),
                    ('1','حبة','Piece'),
                    ('2','كرتون','Box'),
                    ('3','درزن','12 Pcs'),
                    ('4','نص درزن','6 Pcs'),
                    ('5','حزمة','Bundle'),
                    ('6','بار','Bar'),
                    ('7','سم','cm'),
                    ('8','سم2','cm2'),
                    ('9','سم3','cm3'),
                    ('10','قدم','ft'),
                    ('11','جرام','g'),
                    ('12','جالون','Gallon'),
                    ('13','بوصة','in'),
                    ('14','كيلوجرام','kg'),
                    ('15','كم','km'),
                    ('16','ليتر','Liter'),
                    ('17','رطل','lb'),
                    ('18','متر','m'),
                    ('19','متر مربع','m2'),
                    ('20','متر مكعب','m3'),
                    ('21','ملغ','mg'),
                    ('22','ميل','mile'),
                    ('23','مل','ml'),
                    ('24','مم','mm'),
                    ('25','مم2','mm2'),
                    ('26','مم3','mm3'),
                    ('27','أوقية','oz'),
                    ('28','كمية','Quantity'),
                    ('29','قدم مربع','sq. ft'),
                    ('30','بوصة مربع','sq. in.'),
                    ('31','طن','Ton'),
                    ('32','يارد','yd'),
                    ('33','1/2 بوصة','1/2 in'),
                    ('34','1/2 رطل','1/2 lb'),
                    ('35','1/2 بت','1/2 pt'),
                    ('36','1/2 انش مربع','1/2 sq. in'),
                    ('37','1/4 بوصة','1/4 in'),
                    ('38','1/4 رطل','1/4 lb'),
                    ('39','1/4 انش مربع','1/4 sq. in'),
                    ('40','1/8 بوصة','1/8 in'),
                    ('41','1/8 بوصة مربع','1/8 sq. in'),
                    ('42','صحن','Plate'),
                    ('43','صغير S','Small S'),
                    ('44','عادي N','Normal N'),
                    ('45','بوفيه','Puffeih'),
                    ('46','صاج','Saj'),
                    ('47','غرفة','Room'),
                    ('48','نصف','Medium'),
                    ('49','احمر','Red'),
                    ('50','غسيل وكوي','Clean & Press'),
                    ('51','كوي فقط','Press Only'),
                    ('52','غسيل بالبخار','Steam Wash'),
                    ('53','ساعة','Hour'),
                    ('54','يوم','Day'),
                    ('55','وسط','Half'),
                    ('56','كبير','Big'),
                    ('57','ربع','Quarter'),
                    ('58','خدمة','Service'),
                    ('59','طقم','Set'),
                    ('60','ربع كيلو','1/4 Kilo'),
                    ('61','نصف كيلو','1/2 Kilo'),
                    ('62','عرض','Offer'),
                    ('63','جملة','Lump'),
                    ('64','شهر','Month'),
                    ('65','سنة','Year'),
                    ('66','كيس','Bag'),
                    ('67','ربطة','Tie'),
                    ('68','ع 18','C 18'),
                    ('69','ع 21','C 21'),
                    ('70','ع 24','C 24'),
                    ('71','ع 925','C 925'),
                    ('72','طبلية','Tablia'),
                    ('73',' عبوة','Package'),
                    ('74',' علبة','Box'),
                    ('75',' نصف كرتون','Half Carton'),
                    ('76','10كرتون','10 Cartons'),
                    ('77','بالة كاملة','Whole bale'),
                    ('78','بطاقة','Card'),
                    ('79','بكت','cried'),
                    ('80','بلت','Pelt'),
                    ('81','بلوك','Block'),
                    ('82','بيع','Sell'),
                    ('83','تبديل','Change'),
                    ('84','تنكة','Tank'),
                    ('85','جدر','Pan'),
                    ('86','جركل','Jarcle'),
                    ('87','حافظة','Safe'),
                    ('88','حبتين','2 Pcs'),
                    ('89','خشب','Wood'),
                    ('90','درج','Locker'),
                    ('91','ذبيحة','Sacrifice'),
                    ('92','ربع درزن','Quarter dozen'),
                    ('93','ربع ذبيحة','Quarter sacrifice'),
                    ('94','ربع شدة','Quarter bag'),
                    ('95','ربع كرتون','Quarter Carton'),
                    ('96','رول','Roll'),
                    ('97','سطل','Bucket'),
                    ('98','سلة','Basket'),
                    ('99','شدة ','Tie'),
                    ('100','شدة كاملة','full Tie'),
                    ('101','شدة كبيرة','Big Tie'),
                    ('102','شريحة','Slice'),
                    ('103','شنطة','Bag'),
                    ('104','صفيحة','Plate'),
                    ('105','صندوق','Box'),
                    ('106','ضغاط','Pressure'),
                    ('107','طبق كبير','Big plate'),
                    ('108','طبق مزدوج','Double plate'),
                    ('109','ظرف','Envelope'),
                    ('110','عبوة','Can'),
                    ('111','علبة','Box'),
                    ('112','غرشة','Bottle'),
                    ('113','فرشة','Brush'),
                    ('114','فلين','Cork'),
                    ('115','فوطة','Towel'),
                    ('116','قارورة','Flask'),
                    ('117','قالب','Mold'),
                    ('118','قطعة','Piece'),
                    ('119','قمع','Cown'),
                    ('120','كاس','Cup'),
                    ('121','كاملة','Full'),
                    ('122','كرت','Card'),
                    ('123','كرتون صغير','Small Box'),
                    ('124','كرتون كامل','Full Box'),
                    ('125','كرتون كبير','Big Box'),
                    ('126','كرز','Cherry'),
                    ('127','كوب','Glass'),
                    ('128','كيس صغير','Small bag'),
                    ('129','كيس كامل','Full bag'),
                    ('130','كيس كبير','Large bag'),
                    ('131','لفة','Roll'),
                    ('132','مغلف','Envelope'),
                    ('133','مكعب','Cube'),
                    ('134','نص ذبيحة','Carcass half'),
                    ('135','نصف','Half'),
                    ('136','نصف باكيت','Half a packet'),
                    ('137','نصف درزن','Half a dozen'),
                    ('138','نصف ذبيحة','Half sheep'),
                    ('139','نصف شدة','Half Tie'),
                    ('140','نصف كرتون','Half carton'),
                    ('141','نصف كيلو','Half a kilo'),
                    ('142','وزن','Weight'),
                    ('143','وعاء','Pot');`

                    tx.executeSql(insert_query, 
                        [], function(tx, rs) {
                        console.log('INSERT done: ');
                    },function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    });
                },
                null, 
                this.updateUnitList()
              );
                
            });
        
    }

}
