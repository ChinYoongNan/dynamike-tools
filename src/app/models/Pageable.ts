
import { Sortable } from "./Sortable";
export class Pageable {
  offset=0;
    pageNumber=0;
    pageSize=10;
    paged=true;
    sort= new Sortable();
    empty=true;
    sorted=false;
    unsorted=true;
    unpaged=false
}