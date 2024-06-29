import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef,Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-product_search_engine',
  templateUrl: './product_search_engine.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class ProductSearchEngineComponent implements OnInit {
  
  @Input() pagination: Subject<void>;
  @Input() itemCode: Subject<void>;
  @Input() type;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  @Output() searchResult = new EventEmitter();
  constructor(
    private dcrService: DcrService,
    private common: CommonService
  ) { 
  }

  ngOnInit(): void {
    this.init();
  }

  
  init() {  
    if(this.pagination){
      this.pagination.subscribe((data) => 
        this.subscription(data)
      );
    }  
    if(this.itemCode){
      this.itemCode.subscribe((data) => 
        this.inputSearchItemCode(data)
      );
    }   
    this.loadItem();
  }

  Items:any;
  async loadItem(supplierId:any=null){    
    let promise = await new Promise((resolve, reject) => {
      // this.dcrService.getProductbySupplier(supplierId)
      this.dcrService.getAllOtherProduct()
      // this.dcrService.getProductbySupplier(this.supplier_id)
        .toPromise()
        .then(
          data => { // Success
            this.Items = data;
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  ItemChange(value) {
    this.inputSearchItemCode(this.Items[value].code);
  }
  inputSearchItemCode(data){
    this.item_code = data
    this.searchProduct();

  }
  subscription(e){
    if(e['content']){
      this.paginationData = e;
      this.searchProduct(null,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
    }
  }
  
  isS6 = true;
  switchToCafePO(){
    this.isS6 = !this.isS6;
  }
  @Input() mode: any ;
  Product: any;
  isVisible: boolean = false;
  item_code:any;
  item_index:any
  searchProduct(event:any=null,page:any = 0,size:any = 10, searchCount :any = 0){
    if(event!=null){
      this.item_code = event.target.value
    }
    this.isVisible = true;
    switch(this.mode){
        case 'Product':{
          if(this.item_code){
            let promise = new Promise((resolve, reject) => {
              this.dcrService.getProductbyCode(this.item_code, false)
                .toPromise()
                .then(
                  data => { // Success
                    this.isVisible = false;
                    this.Product = data;
                    if(this.Product.length>0){
                      if(searchCount == 1 && this.item_code == this.Product[0].barCode){
                        this.item_code = this.Product[0].code;
                        searchCount ++;
                        this.mode = 'ProductDetail' ;
                        this.searchProduct(null,page,size, searchCount);
                      }
                      this.searchResult.emit(this.Product);   
                    }else{
                      this.common.createModalMessage("Failed","No Product Found").error();
                    }
                    // this.footer=true;
                  },
                  msg => { // Error
                    this.common.createModalMessage(msg.error.error, msg.error.message).error()
                  }
                );
            });
      
          }else{
            let promise = new Promise((resolve, reject) => {
              this.dcrService.getProduct()
                .toPromise()
                .then(
                  data => { // Success
                    this.isVisible = false;
                    this.Product = data;
                    if(this.Product.length>0){
                      this.searchResult.emit(this.Product);
                    }else{
                      this.common.createModalMessage("Failed","No Product Found").error();
                    }                    
                    // this.footer=true;
                  },
                  msg => { // Error
                    this.common.createModalMessage(msg.error.error, msg.error.message).error()
                  }
                );
            });
          }
          break;
        }
        case 'ProductDetail':{
          if(this.item_code){
            this.dcrService.getExpiredCheck(this.item_code,page,size).subscribe(data => {
              this.isVisible = false;
              // this.Product = data['content'];
              // if(this.Product.length>0){
              if(data['content'].length>0){
                this.searchResult.emit(data);
              }else{
                if(searchCount == 0){
                  searchCount ++;
                  this.mode = 'Product';
                  this.searchProduct(null,page,size, searchCount);
                  this.mode = 'ProductDetail';
                }else {
                  this.common.createModalMessage("Failed","No Product Found").error();
                }
              }
              // this.footer=true;        
            }, error => {
              if (error.error.text != "No Results") {
                this.common.errStatus(error.status, error.error);
              }
            })
      
          }   
          break;
        }
        case 'SearchProduct':{
          if(this.item_code){
            let promise = new Promise((resolve, reject) => {
              this.dcrService.getProductbyCode(this.item_code, false)
                .toPromise()
                .then(
                  data => { // Success
                    this.isVisible = false;
                    this.Product = data;
                    if(this.Product.length>0){
                      if(searchCount == 1 && this.item_code == this.Product[0].barCode){
                        this.item_code = this.Product[0].code;
                        searchCount ++;
                        this.mode = 'ProductDetail' ;
                        this.searchProduct(null,page,size, searchCount);
                      }
                      if(this.Product.length <=1){               
                        this.open(this.Product[0].id,this.Product[0].code)                        
                      }
                      // this.searchResult.emit(this.Product);          
                    }else{
                      this.common.createModalMessage("Failed","No Product Found").error();
                    }
                    // this.footer=true;
                  },
                  msg => { // Error
                    this.common.createModalMessage(msg.error.error, msg.error.message).error()
                  }
                );
            });
      
          }
          // else{
          //   let promise = new Promise((resolve, reject) => {
          //     this.dcrService.getProduct()
          //       .toPromise()
          //       .then(
          //         data => { // Success
          //           this.isVisible = false;
          //           this.Product = data;
          //           if(this.Product.length>0){
          //             // this.searchResult.emit(this.Product);
          //             this.open(this.Product[0].id,this.Product[0].code)
          //           }else{
          //             this.common.createModalMessage("Failed","No Product Found").error();
          //           }                    
          //           // this.footer=true;
          //         },
          //         msg => { // Error
          //           this.common.createModalMessage(msg.error.error, msg.error.message).error()
          //         }
          //       );
          //   });
          // }
        }
    }                    
  }

  ProductChange(code){
    var selected = this.Product.filter(i => i.code == code);
    var value = this.Product.indexOf(selected[0]);
    this.item_code = this.Product[value].code;
    this.searchResult.emit([this.Product[value]]);
  }

  paginationData:any;
  nextPageSetting(data){
    this.paginationData = data;
    this.searchProduct(null,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
  }

  product_id:any;
  visible = false;
  get title(): string {
    return `Product`;
  }
  
  closeDrawer(data){  
    this.visible = data;
  }
  open(id:any = null, code: any = null): void {
    this.product_id = id;
    // if(this.productCategory == 4){
      this.visible = true;
      // document.getElementById("drawerFoodRecipe").click();
    // } else {
    //   this.router.navigate([`ProductListing/${this.productCategory}/${code}`]);
    // }
  }

  close(): void {
    this.visible = false;
  }
  
}

