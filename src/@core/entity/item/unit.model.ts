import { Observable } from "rxjs";

export interface Met_Unit 
{
    unitNo	: number,
    aName	: string,
    eName	: string	
}

export abstract class Met_UnitModel {
    abstract getMetUnits(): Observable<Array<Met_Unit>>;
    abstract createDefaultUnit(): void;
    abstract updateUnitFromDB(): void;
}