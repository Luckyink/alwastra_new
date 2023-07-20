import { Observable } from "rxjs";

export interface VATType 
{
    clientVendorNo	: number,
    aName	: string,
    eName	: string,	
    VatID : string
}

export abstract class VATTypeModel {
    abstract VATTypes(): Observable<Array<VATType>>;
    abstract createDefaultVATTypes() :void
    abstract updateVATTypeFromDB(): void;
}