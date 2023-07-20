import { Observable } from "rxjs";

export interface ClientVendor 
{
    clientVendorNo	: number,
    aName	: string,
    eName	: string,	
    VatID : string
}

export abstract class ClientVendorModel {
    abstract clientVendors(): Observable<Array<ClientVendor>>;
    abstract createDefaultClientVendors() :void
    abstract updateClientVendorFromDB(): void;
}