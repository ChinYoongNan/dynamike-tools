import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
//service
import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
import { CommonService } from "../../../services/common.service";
import { BalanceSheet } from "../../../models/BalanceSheet"

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';


@Component({
  selector: 'app-bs',
  templateUrl: './bs.component.html',
  styleUrls: ['./bs.component.scss']
})
export class BalanceSheetComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  
  isVisible: boolean = false;
  monthString:any;
  yearString:any;
  month:any;
  year:any;
  disabledDate:any;

  balancesheet:BalanceSheet = new BalanceSheet();


  nca :any = [];
  ca :any = [];
  et :any = [];
  lb :any = [];
  ngOnInit(): void {
    this.init();
  }

  ngAfterContentInit() {
    
  }
  reset(){
    this.balancesheet = new BalanceSheet();  
    console.log(this.balancesheet)
    // this.balancesheets = [];
    

    // for(let i =0; i<4;i++){
    //   this.balancesheets.push(
    //     new BalanceSheet()
    //   )     
    // }
    this.nca=[];
    this.ca=[];
    this.et=[];
    this.lb=[];

  }
  async getYearlyReport(year, month:any =0){
    this.nca  = await this.dataService.getNCAPerYear(year, month);
    if(this.nca){
      for(let a of this.nca) {  
        for(let o of a.outlet){
          for(let e of o.accountings) {
            this.balancesheet.accdep += e.amount;
            this.balancesheet.nca += e.netValue;  
          }
        }
      }
    }
    this.ca = await this.dataService.getCAPerYear(year, month);
    if(this.ca){
      // let netsales = 0.0;
      for(let a of this.ca) {     
        for(let o of a.outlet){
          for(let e of o.accountings) {
            switch(a.id){
              case "64":
              case "17":
              {
                this.balancesheet.bank += e.amount;  
                break;
              }
              case "65":
              case "18":
              {
                this.balancesheet.cash += e.amount;  
                break;
              }
              case "66":
              case "21":
              {
                this.balancesheet.coin += e.amount;  
                break;
              }
              case "45":
              case "50":
                case "46":
              {
                this.balancesheet.deposit += e.amount;  
                break;
              }
              case "25":{
                this.balancesheet.stock += e.amount;  
                break;
              }
            } 
          } 
        } 
      }
      console.log(this.balancesheet)
    }
    this.et = await this.dataService.getETPerYear(year, month);
    if(this.et){
      for(let a of this.et) {            
        if(a.outlet){
          for(let o of a.outlet){
            for(let e of o.accountings) {
              switch(e.id){
                case "9":
                {
                  this.balancesheet.equity += e.amount;  
                  break;
                } 
                case "42":
                case "11":
                {
                  this.balancesheet.redrawing += e.amount;  
                  break;
                }            
              } 
            } 
          } 
        }   
        switch(a.id){
          case "30":{
            this.balancesheet.equity_BF += a.amount;  
            break;
          }
          case "9":{
            this.balancesheet.profit += a.amount;  
            break;
          }              
        } 
      }
    }
    this.lb = await this.dataService.getLBPerYear(year, month);
    if(this.lb){
      for(let a of this.lb) {
        this.balancesheet.payble += a.amount;
      }
      console.log(this.lb)
    }
  }
  AccountMonthChange(value){    
    this.monthString= this.common.formatDatePicker(value,'Month')
    this.yearString= this.common.formatDatePicker(!this.year?new Date():this.year,'Year') 
  }
  AccountYearChange(value){
    this.yearString= this.common.formatDatePicker(value,'Year') 
  }
  generateStatement(){
    this.reset();
    this.getYearlyReport(this.yearString, this.monthString)
  }
  init() {
    this.reset();
    let promise = new Promise((resolve, reject) => {
        this.dcrService.getAccountYear()
          .toPromise()
          .then(
            data => { // Success
              let AccountYears:any = data; 
              this.disabledDate= (current: Date): boolean => (
                current < new Date('January 1, ' + AccountYears[AccountYears.length-1]) || current > new Date());
              this.year = new Date('January 1, ' + AccountYears[0]);
              this.yearString= this.common.formatDatePicker(!this.year?new Date():this.year,'Year') 
              this.getYearlyReport(this.yearString);
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
    
      

}
