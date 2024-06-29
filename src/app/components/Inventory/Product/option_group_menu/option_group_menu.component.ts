import { Input, Output,EventEmitter, Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { CommonDynamikeService } from "../../../../services/common.dynamike.service";
import { DataService } from "../../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subject, BehaviorSubject } from 'rxjs';

import { PageHeaderSection } from '../../../../models/PageHeaderSection';
import { AddButtonFunction } from '../../../../models/AddButtonFunction';

@Component({
  selector: 'app-option-group-menu',
  templateUrl: './option_group_menu.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class OptionGroupMenuComponent implements OnInit {
  searchValue:any;
  tableData : Subject<any> = new Subject<any>();
  categoryTabNav : Subject<any> = new Subject<any>();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    private commonDynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef, 
  ) { 
  }
  allChecked = false;
  indeterminate = true;
  selectOption = [];
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(value,code:any,items:any[],name,unitPrice): void {
    if(value){
      console.log(items);
      let sellingPrice = 0.0;
      if(items && items.length > 0){
        let item = items.filter(e => e.priceType === this.pType)[0]
        console.log(item)
        sellingPrice = item['sellingPrice']
        console.log(item['sellingPrice'])
      }
      this.selectOption.push({
        code: code,
        name:name,
        remark:'',
        sellingPrice:sellingPrice,
        unitPrice:unitPrice,
      });
    }else{      
      var selected_provider = this.selectOption.findIndex(i => i.code == code);
      this.selectOption.splice(selected_provider,1);
    }
    this.returnResult.emit(this.selectOption);
  }
  @Output() returnResult = new EventEmitter();
  @Input() productVariation: any;
  @Input() mode: any ;
  @Input() priceType:any;
  pType:any="SellingPrice";
  modeView:any;
  menuViewType = 'menu';
  pageHeader = new PageHeaderSection() ;
  normalConfig(){
    let buttonfunction = new AddButtonFunction();
    buttonfunction.routerLink = "/ProductAdd/1";
    buttonfunction.queryParams = {debug: true};      
    let obj = this.dataService.loadTypeCategory(1);
    obj.then(
      data => { // Success
        // this.pageHeader.Title = data['description'];            
        this.pageHeader.Title = "Option Group";            
        this.cdr.detectChanges();
      },
      msg => { // Error
        this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
    this.pageHeader.AddButton = buttonfunction;
  }

  sub:any;
  categoryType:any;
  ngOnInit(): void {  
    this.selectOption = [];
    // console.log(this.productVariation)
    // this.normalConfig()
    // this.fetchData(4);
  }
  ngOnChanges(){
    this.selectOption = [];
    this.pType = this.priceType;
    this.modeView = this.mode
    console.log(this.productVariation)
  }

  getSearchValue(data){
    this.searchValue=data;
    this.returnResult.emit(data);
  }
  Product = {
    code:'',
    name:'',
    stock:0,
    totalStock:0.0
  }
  Purchases:any=[];
  init(){
  }

  ProductTypes: any;
  private async fetchData(productCategory:any =null){
    if(productCategory == null){
      productCategory =1;
    }
    this.ProductTypes = await this.dataService.loadProductType(productCategory);
  }
  itemCode = new Subject<Object>();
  Items;
  ItemChange(value){
    this.common.notifyChild(this.itemCode,value)
  }
  loadItem(){
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
  ngAfterContentInit() {  
    this.sub = this.route.params.subscribe(params => {
      if(params['type']){
        this.categoryType = +params['type']     
        
        let obj = this.dataService.loadTypeCategory(this.categoryType);
        obj.then(
          data => { // Success
            this.pageHeader.Title = data['description'];
            this.cdr.detectChanges();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
        this.pageHeader.AddButton.routerLink ="/ProductAdd/" + this.categoryType   
        switch(this.categoryType){
          case 2:{
            this.loadItem();
            break;
          }
        }
        this.common.notifyChild(this.categoryTabNav,this.categoryType);
      }      
    }); 
  }
  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  paginationData : Subject<any> = new Subject<any>();
  returnTabPaginationData(e){
    this.common.notifyChild(this.paginationData,e);
  }

}
