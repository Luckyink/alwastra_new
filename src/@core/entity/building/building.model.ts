import { Observable } from "rxjs";

export interface Building 
{
    buildingNo	: number,
    aName	: string,
    eName	: string	
}

export interface Store 
{
    storeNo	: number,
    aName	: string,
    eName	: string	
}

export abstract class BuildingModel {
    abstract getBuildings(): Observable<Array<Building>>;
    abstract createDefaultBuildings() :void;
    abstract updateBuildingFromDB(): void;

    //store
    abstract getStores(): Observable<Array<Store>>;
    abstract createDefaultStores() :void;
    abstract updateStoreFromDB(): void;
}