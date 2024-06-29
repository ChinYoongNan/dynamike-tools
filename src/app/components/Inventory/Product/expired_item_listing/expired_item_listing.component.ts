import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Console } from 'console';
import { Subject, BehaviorSubject } from 'rxjs';
import {PaginationData } from "../../../../models/PaginationData";


@Component({
  selector: 'app-expired_item_listing',
  templateUrl: './expired_item_listing.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ExpiredItemListComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { 
  }
  
  headerData=[  
    {
      header:"Product Code",
      column:'productCode',
      edit: false,
      type: "text"
    }, 
    {
      header:"Product Name",
      column:'productName',
      edit: false,
      type: "text"
    },       
    {
      header:"Quantity / 数量",
      column:"quantity",
      edit: false,
      type: "text"
    },             
    {
      header:"Expired / 过期",
      column:"expired",
      edit: true,
      type: "text"
    }
  ];
  tableSettings = {      
    Action: {                  
      CustomFunction:[
        {
          desc:"Sold Out",
          function: this.checkedButton   
        }
      ],
    },
  }
  id:any;
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  } 
  checkedButton(){
    document.getElementById("checkedButton").click();
  }

  confirmChecked(){
    console.log('confirmChecked');
    var confirmed = JSON.parse(JSON.stringify(this.updateData));

    var selected = this.ItemsList.filter(i => i.id == parseInt(confirmed.id));
    var value = this.ItemsList.indexOf(selected[0]);
    let promise = new Promise((resolve, reject) => {
      this.dcrService.checkedExpiredItemList(this.ItemsList[value])
        .toPromise()
        .then(
          res => { // Success
            // this.ItemsList.splice(value,1);
            // this.common.notifyChild(this.tableData,this.ItemsList);             
            this.nextPage(this.year_index,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  
  tableData : Subject<any> = new Subject<any>();
  ngOnInit(): void {
  }
  

  YearLoadSel: boolean = true;
  month_index:any;
  year_index:any;
  year: any;
  month: any;
  AccountMonthChange(value){
    console.log(value);
    this.month_index = this.common.formatDatePicker(value,'Month')    
    this.year_index= this.common.formatDatePicker(this.year,'Year')
    if(this.year_index){      
      this.YearChange(this.year_index);
    }
  }
  YearChange(value){
    this.year_index= this.common.formatDatePicker(this.year,'Year')
    if(this.month_index){
      this.nextPage(this.year_index,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
    }
  }
  ItemsList:any;
  paginationData: PaginationData
  nextPageSetting(data){
    this.paginationData = data;
    this.nextPage(this.year_index,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
  }
  nextPage(value,page:any=1,size:any=10){
    if(!this.month_index || !this.year_index){
      return
    }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getExpiredListingByPage(value,this.month_index, page,size)
        .toPromise()
        .then(
          data => { // Success
            this.ItemsList = data['content'];  
            this.common.notifyChild(this.tableData,data);            
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    
  }
}
