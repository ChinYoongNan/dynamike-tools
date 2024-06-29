import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef,Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-product_list_selection',
  templateUrl: './product_list_selection.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class ProductListSelectionComponent {
  
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private formBuilder: FormBuilder,
  ) { 
  }
  productForm: FormGroup;
  @Input() notifier_Id: Subject<void>;
  @Input() notifier: Subject<void>;
  @Input() category: Subject<void>;
  
  @Output() seletedData = new EventEmitter();
  @Input() mode: any ;
  headerColumn = ["item#","Product Code / 代号","Quantity / 数量","Unit Cost / 单价","Expired Date / 过期","Delete / 删除"];
  ProductList:any[] = [];
  item_index:any;
  item_code:any ="";
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  item_expired:any;
  item_name:any ="";
  item_id;
  total_amount:any;
  Items:any;
  Products:any;
  productCategory:any;
  ngOnInit(){
    this.productForm = this.formBuilder.group({
      item_quantity: ['', Validators.required],
      item_unit_cost: ['', Validators.required]
    })
    this.init()
  }
  ngOnDestroy() {
    if(this.notifier_Id){
      this.notifier_Id.unsubscribe();
    }
    if(this.notifier){
      this.notifier.unsubscribe();
    }
    if(this.category){
      this.category.unsubscribe();
    }
  }
  init() {   
    console.log('init');   
    if(this.notifier_Id){
      this.notifier_Id.subscribe((data) => 
        this.subscription(data,'Id')
      );  
    }
    if(this.notifier){
      this.notifier.subscribe((data) => 
        this.subscription(data)
      ); 
    }
    if(this.category){
      this.category.subscribe((data) => 
        this.subscriptionCategory(data)
      );
    }
  }
  subscriptionCategory(type){
    switch(type){
      case 1:case 2:case 4:case 3:case 59:{
        document.getElementById("productListSelection").style.display=""
        break;
      }
      default:{        
        document.getElementById("productListSelection").style.display="none"
      }

    }
    this.productCategory = type;
    if(this.productCategory!=6&&this.productCategory!=1){
      this.loadItem(null)
    }
  }
  subscription(e,mode:any = null){
    if(mode == 'Id'){
      // this.loadItem(e)
    }else{
      this.ProductList = e;
    }
  }
  InputChange(value){
    // this.item_index =null;
    // this.item_unit_cost = null;
  }
  ItemChange(value) {
    console.log('ItemChange')
    this.item_id = this.Items[value].id;
    this.item_code = this.Items[value].code;
    this.item_unit_cost = this.Items[value].unitCost;
    this.item_name = this.Items[value].name
  }
  
  getSearchValue(data){
    console.log(data);
    if(data['content']){
      this.Items = data['content'];
    }else{
      this.Items = data;
    }    
    this.item_id = this.Items[0].id;
    this.item_code = this.Items[0].code;
    this.item_unit_cost = this.Items[0].unitCost;
    this.item_name = this.Items[0].name
  }

  loadItem(supplierId){
    let promise = new Promise((resolve, reject) => {
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
  // searchProduct(){
  //   if(this.item_code){
  //     this.dcrService.getProductbyId(this.item_id).subscribe(data => {
  //       this.Products = data;
  //       if(this.Products.length>0){
  //         let Product = this.Products[0];
  //         this.item_code = Product.code;
  //         this.item_unit_cost = Product.unitCost;
  //         this.item_name = Product.name
  //       }else{
  //         this.item_code = null;
  //         this.item_unit_cost = null;
  //         this.item_name = null;
  //         this.common.createModalMessage("Failed","No Product Found").error();
  //       }
        
  //     }, error => {
  //       if (error.error.text != "No Results") {
  //         this.common.errStatus(error.status, error.error);
  //       }
  //     })

  //   }    
  // }
  addItems(product_code,quantity,unit_cost,expired, name, amount){
    amount = parseFloat(unit_cost) * parseInt(quantity);
    let purchase_item: any = {
      // "purchase_id":this.purchase_id,
      "productCode": product_code,
      "quantity": quantity,
      "unitCost": unit_cost,
      "expired": expired,
      "amount": amount,
      "name": name,
    } 
    
    if(product_code){
      this.ProductList.push(purchase_item);
      this.seletedData.emit(this.ProductList);
    }
    
    this.item_index =null;
    this.item_code =null;
    this.item_unit_cost = null;
    this.item_quantity = null;
    this.item_name = null;
    this.item_expired = null    
  }
  
  deleteItem(index){
    this.ProductList.splice(index,1);
    this.seletedData.emit(this.ProductList);
  }
  
}

