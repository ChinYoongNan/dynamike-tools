import { Component, OnInit, Input, ViewChild, TemplateRef, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
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
import { AnyTxtRecord } from 'dns';
import { Console } from 'console';
import { Subject, BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';

import { PageHeaderSection } from '../../../../models/PageHeaderSection';
import { AddButtonFunction } from '../../../../models/AddButtonFunction';

@Component({
  selector: 'app-food_menu_category',
  templateUrl: './food_menu_category.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class FoodMenuCategoryComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();  
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    public dynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef, 
    private dataService: DataService,
  ) { 
  }  
  pageHeader = new PageHeaderSection() ;
  ProductTypes: any;
  product_id: any;
  private sub: any;
  productCategory: any =4;
  ngOnInit(): void {       
    this.pageHeader.AddButton = null;
    
    this.sub = this.route.params.subscribe(params => {
      this.productCategory = +params['type'];
      if(this.productCategory){
        let obj = this.dataService.loadTypeCategory(this.productCategory);
        obj.then(
          data => { // Success
            this.pageHeader.Title = data['description'];
            this.cdr.detectChanges();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
      }else{
        this.productCategory = 1;
      }
    }); 
    this.fetchData(this.productCategory);
  }
  init() {
    this.fetchData(this.productCategory);
  }
  private async fetchData(productCategory:any =null){
    let listProductCategory = [...productCategory];
    if(productCategory == 4){
      listProductCategory.push(6);
    }
    this.ProductTypes = await this.dataService.loadAllProductType(listProductCategory);
    if(this.ProductTypes){
      for(let i = 0; i< this.ProductTypes.length ; i ++){
        this.fetchProduct(i,this.ProductTypes[i].id);
      }
    }
  }
  private async fetchProduct(index,type){
    let data = await this.dataService.getProductByType(this.ProductTypes[index].id,0,99);        
    if(data){
        this.ProductTypes[index].product = data['content'];
    }
  }
  visible = false;
  get title(): string {
    return `<i nz-icon nzType="user"></i>Recipe`;
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

  paginationData : Subject<any> = new Subject<any>();
  itemCode = new Subject<Object>();
  getSearchValue(data){
    if(data){
      this.open(data[0].id)
    }
  }

}
