
import { PurchaseItem } from "./PurchaseItem";
import { InvoiceType } from "./InvoiceType";
import { Supplier } from "./Supplier";
export class Purchase {
    id:any=null;
    date:String = new Date().toISOString().split("T")[0];
    particular:String = null;
    invoiceNo:String = null;
    type = new InvoiceType();
    totalAmount = '0.00';
    paid:String = null;
    supplier=new Supplier();
    purchaseItemList = new Array<PurchaseItem>()
    lifeTime = 0;
    depreciation = 0;
    endYear = 0;
    outlet=new Outlet();
}

export class Outlet {
    id=null;
    outlet=null;
};