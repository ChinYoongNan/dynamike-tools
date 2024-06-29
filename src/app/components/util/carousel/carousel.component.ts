import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class CarouselComponent implements OnInit {

  @Output() updatedData = new EventEmitter();
  @Output() nextPage = new EventEmitter();
  @Output() selectedIndex = new EventEmitter();
  @Input() notifier: Subject<void>;
  @Input() tableHeaderData: any ;
  @Input() tableSettings: any ;
  @Input() expandProperty: any ;
  @Input() dataPropertyKeys = [];
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
  ) { 
  }
  effect = 'scrollx';
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  nestedEditCache: { [key: string]: { edit: boolean; data: any } } = {};
  tableData: any ;
  paginationData: any = {
    content: [],
    empty: false,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 10,
    pageable: {offset: 0,
      pageNumber: 0,
      pageSize: 10,
      paged: true,
      sort: {sorted: false, unsorted: true, empty: true},
      empty: true,
      sorted: false,
      unsorted: true,
      unpaged: false},
    size: 10,
    sort: {sorted: false, unsorted: true, empty: true},
    totalElements: 10,
    totalPages: 10
  }
  init() {  
    if(this.notifier){
      this.notifier.subscribe((data) => 
        this.subscription(data)
      );
    }    
  }
  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.notifier){
      this.notifier.unsubscribe();
    }
  }
  subscription(e){
    console.log('notifier')
    if(e['content']){
      this.paginationData = e;
      console.log(e);
      this.tableData = e.content;
    }else{
      this.tableData = e;
      if(this.tableData){
        if(this.dataPropertyKeys.length == 0){
          this.dataPropertyKeys = Object.keys(this.tableData[0]);
        }      
      }
    }
    console.log(this.tableData);
    this.updateEditCache();
    if(this.expandProperty){
      this.updateExpandCache();
      this.updateNestedEditCache(this.expandProperty);
    }
  }
  ngOnInit(): void {
    this.init();
  }
  buttonsEvent(data,buttonFunction){
    this.updatedData.emit(this.editCache[data].data);
    this.selectedIndex.emit(data);
    buttonFunction();
    // this.tableSettings.Action.Status.function() 
  }
  updateStatus(type,data,status){
    this.updatedData.emit(this.editCache[data].data);
    switch(type){
      default:{    
        this.selectedIndex.emit(data);
        this.tableSettings.Status.function() 
      }
    }
  }
  updateValid(type,data,valid){
    this.updatedData.emit(this.editCache[data].data);
    switch(type){
      default:{    
        this.selectedIndex.emit(data);
        this.tableSettings.Valid.function() 
      }
    }
  }
  optionEvent(type,id,child_function){
    this.updatedData.emit(this.editCache[id].data);
    this.selectedIndex.emit(type);    
    child_function(type)  
  }
  buttonEvent(data,child_function){
    this.selectedIndex.emit(data);    
    child_function(data)  
  }
  deleteButton(data){
    this.selectedIndex.emit(data);
    this.tableSettings.Delete.function()     
  }
  viewButton(data){
    this.selectedIndex.emit(data);
    this.tableSettings.Action.View.function()     
  }
  startEdit(id: string,nested:any = null): void {
    if(!nested){
      this.editCache[id].edit = true;
    }else{
      this.nestedEditCache[id].edit = true;
    }
  }

  cancelEdit(id: string,nested:any = null): void {
    if(!nested){
      const index = this.tableData.findIndex(item => item.id === id);
      this.editCache[id] = {
        data: { ...this.tableData[index] },
        edit: false
      };
    }else{
      const index = this.tableData.findIndex(item => item[nested].id === id);
      this.nestedEditCache[id] = {
        data: { ...this.tableData[index] },
        edit: false
      };
    }
  }

  saveEdit(id: string,nested:any = null): void {
    if(nested == null){
      const index = this.tableData.findIndex(item => item.id === id);
      this.updatedData.emit(this.editCache[id].data);
      this.tableSettings.Action.Update.function()
      Object.assign(this.tableData[index], this.editCache[id].data);
      this.editCache[id].edit = false; 
    }else{      
      // const index = this.tableData.findIndex(item => item === searchData);
      let index = 0;
      let selectedIndex = 0;
      this.tableData.forEach(item => {
        item[nested].forEach(nesteditem => {
          if(nesteditem.id === id){            
             Object.assign(nesteditem, this.nestedEditCache[id].data);
             selectedIndex = index;
          }
        });   
        index++;   
      });      
      this.updatedData.emit(this.tableData[selectedIndex]);
      this.tableSettings.Action.Update.function()
      this.nestedEditCache[id].edit = false; 
    }       
  }
  updateEditCache(): void {
    this.editCache = {};
    this.tableData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  getValue(table,value){
    var properties = value!=null? value.split("."): [];
    if(properties.length>1){
      return this.getNestedObject(table, properties);      
    }else{
      return value;
    }
  }
  getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
  }
  
  updateNestedEditCache(nested): void {
    this.tableData.forEach(item => {
      item[nested].forEach(nesteditem => {
        this.nestedEditCache[nesteditem.id] = {
          edit: false,
          data: { ...nesteditem }
        };
      });      
    });
  }
  updateExpandCache(): void {
    this.tableData.forEach(item => {
      if(item[this.expandProperty].length>0){
        item.expand = false
      }else{
        item.expand = true
      }
    });
  }
  formatImage(img: any): any {
    if(img){
      return this.common.formatImage(img);
    }
  }
  ngAfterContentInit() { 
  }

  tableEmpty: boolean = true;  
  NoResultId = "No Data"
  emptyTemplate=false;
  pageChange(value){
    this.paginationData.pageable.pageNumber = value -1;
    this.nextPage.emit(this.paginationData);
  }
  setPopValue(value,id){
    console.log('popValue');
    this.editCache[id]['optionValue'] = value;
  }
  customPopFunction(id,customField){
    this.selectedIndex.emit(customField);
    this.updatedData.emit(this.editCache[id].data);
    
    this.tableSettings.Action.customPopFunction.function() 
  }
  customPopDataFunction(id,popData){
    this.selectedIndex.emit(popData);
    this.updatedData.emit(this.editCache[id].data);
    let functionpop;
    if(popData['optionValue']){
      var selected = this.tableSettings.Action.CustomFunction.filter(i => i.value == popData['optionValue']);
      if(selected.length>0){
        functionpop = selected[0].function;
      }
    }
    if(functionpop){
      this.closePop(id);
      functionpop();
    }
  }
  closePop(id){
    this.editCache[id]['popVisible'] = false;
  }
}
