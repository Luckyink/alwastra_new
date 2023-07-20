import { Observable } from "rxjs";

export interface Item 
{
    itemNo:  number,
    aName	: string,
    eName	: string,
    barCode : string,
    unitNo_defaultSell: string,
    buyPrice: string,
    itemCategoryNo: number,
    itemClassificationTreeNo: number,
    itemDepartmentNo: number,
    itemModel: string	
}

export abstract class ItemModel {
    abstract getItems(): Observable<Array<Item>>;
    abstract createDefaultItem(): void;
    abstract updateItemFromDB(): void;
}
