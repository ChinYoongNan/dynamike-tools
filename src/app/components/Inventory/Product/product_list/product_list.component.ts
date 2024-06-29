import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DataService } from "../../../../services/data.service";
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { CommonDynamikeService } from "../../../../services/common.dynamike.service";

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
  selector: 'app-product_list',
  templateUrl: './product_list.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ProductListComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();
  categoryTabNav : Subject<any> = new Subject<any>();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private commonDynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef, 
    private dataService: DataService
  ) { 
  }
  
  pageHeader = new PageHeaderSection() ;
  normalConfig(){
    let buttonfunction = new AddButtonFunction();
    buttonfunction.routerLink = "/ProductAdd/1";
    buttonfunction.queryParams = {debug: true};
    this.pageHeader.AddButton = buttonfunction;
    
    let obj = this.dataService.loadTypeCategory(1);
    obj.then(
      data => { // Success
        this.pageHeader.Title = data['description'];
        this.cdr.detectChanges();
      },
      msg => { // Error
        this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
  }

  sub:any;
  categoryType:any;
  ngOnInit(): void {  
    this.normalConfig()
  }

  getSearchValue(data){
    if(data['content']){
      this.Purchases = data['content'];
    }else{
      this.Purchases = data;
    }    
    if(this.Purchases[0].product){
      this.Product = this.Purchases[0].product;
    }else{
      this.Product = this.Purchases[0];
    }
    this.common.notifyChild(this.tableData,data);
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

  itemCode = new Subject<Object>();
  Items;
  ItemChange(value){
    this.common.notifyChild(this.itemCode,value)
  }
  loadItem(category){
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
        this.pageHeader.AddButton.routerLink ="/ProductAdd/" + this.categoryType   
        console.log(this.categoryType);    
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
        switch(this.categoryType){
          case 2:{
            this.loadItem(this.categoryType);
            break;
          }case 5:{
            this.loadItem(this.categoryType);
            break;
          }
          case 4:{
            // this.loadItem();
            break;
          }
          default:{
          }
        }
        this.common.notifyChild(this.categoryTabNav,this.categoryType);
      } 
      if(params['code']){
        this.common.notifyChild(this.itemCode,params['code'])
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
