import { Supplier } from "./Supplier";
import { Item } from "./Item";
export class Product {
  id = null;
  name=null;
  type=null;
  stock="0";
  unitCost=null;
  weight=null;
  dimension=null;
  totalStock="0.00";
  description=null;
  images=null;
  image_url=null;
  barCode=null;
  code=null;
  supplier =new Supplier();
  item =new Item();        
  items = new Array<Item>()
}