import { Sortable } from "./Sortable";
import { Pageable } from "./Pageable";
export class PaginationData {
  content=[];
  empty=false;
  first=true;
  last=true;
  number=0;
  numberOfElements=10;
  pageable = new Pageable();
  size=10;
  sort = new Sortable();
  totalElements=10;
  totalPages=10
}