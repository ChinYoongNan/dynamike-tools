import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { differenceInCalendarDays, setHours } from 'date-fns';
//service
import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
import { CommonService } from "../../../services/common.service";
import { IncomeStatement } from "../../../models/IncomeStatement"

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';


@Component({
  selector: 'app-pl',
  templateUrl: './pl.component.html',
  styleUrls: ['./pl.component.scss']
})
export class IncomeStatementComponent implements OnInit {
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
    private location: Location,
    private cdr: ChangeDetectorRef, 
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  outlets:any;
  isVisible: boolean = false;
  monthString:any;
  yearString:any;
  month:any;
  year:any;
  disabledDate:any;
  sales :any = [];
  expenditure :any = [];
  expenses :any = [];
  promotion :any = [];
  upkeep :any = [];
  utilities :any = [];
  workingcontribution :any = [];
  cogs :any = [];
  incomeStatement: IncomeStatement = new IncomeStatement();  
  incomeStatements: IncomeStatement[] = [];
  timeDefaultValue = setHours(new Date(), 0);
  ngOnInit(): void {
    this.init();
    
  }

  ngAfterContentInit() {
    
  }
  reset(){
    this.incomeStatement = new IncomeStatement();  
    this.incomeStatements = [];
    
    for(let i =0; i<this.outlets.length;i++){
      this.incomeStatements.push(
        new IncomeStatement()
      )     
    }
    this.sales=[];
    this.expenditure=[];
    this.expenses=[];
    this.promotion=[];
    this.upkeep=[];
    this.utilities=[];
    this.workingcontribution=[];
    this.cogs=[];

  }
  async getYearlyReport(year, month:any =0){
    this.sales = await this.dataService.getSalesPerYear(year, month);
    if(this.sales){
      let netsales = 0.0;
      console.log(this.sales)
      for(let a of this.sales) {        
        for(let e of a.accountings) {
          netsales +=e.amount;
          for(let o of e.outlet){
            if(o.accounting!=null){
              if(!isNaN(o.accounting.amount)){
                this.incomeStatements[o.id-1].sales += o.accounting.amount;
              }
            }
          }
        }
      }
      this.incomeStatement.sales = netsales;
    }
    this.expenditure = await this.dataService.getExpenditurePerYear(year, month);
    if(this.expenditure){
      let expenses = 0.0;
      for(let a of this.expenditure) {
        switch(a.id){
            case '6':
            case '7':
            case '8':
            case '9':
            {
              this.expenses.push(a)
              break;
            }
            case '10':{ 
              this.promotion.push(a);
              break;
            }
            case '11':{  
              this.upkeep.push(a)
              break;
            }
            case '12':{   
              this.utilities.push(a)
              break;
            }
            case '13':{ 
              this.workingcontribution.push(a)
              break;
            }
        }
        for(let e of a.accountings) {
          switch(a.id){
            case '6':
            case '7':
            case '8':
            case '9':
            {
              expenses+=e.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['expenses'] +=o.accounting.amount;
                }
              }
              break;
            }
            case '10':{            
              this.incomeStatement.promotion =a.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['promotion'] +=o.accounting.amount;
                }
              }
              break;
            }
            case '11':{            
              this.incomeStatement.upkeep =a.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['upkeep'] +=o.accounting.amount;
                }
              }
              break;
            }
            case '12':{            
              this.incomeStatement.utilities =a.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['utilities'] +=o.accounting.amount;
                }
              }
              break;
            }
            case '13':{            
              this.incomeStatement.workContribution =a.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['workContribution'] +=o.accounting.amount;
                }
              }
              break;
            }
          }
        }
      }
      this.incomeStatement.expenses = expenses; 
    }
    this.cogs = await this.dataService.getCogsPerYear(year, month);
    if(this.cogs){
      for(let a of this.cogs) {
        for(let e of a.accountings){
          console.log('cogs')
          switch(e.id){
            case '1':
            case '3':
            {
              this.incomeStatement.purchases +=e.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['purchases'] +=o.accounting.amount;
                }
              }
              break;
            }
            case '23':{            
              this.incomeStatement.opening =e.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['opening'] +=o.accounting.amount;
                }
              }
              break;
            }
            case '25':{            
              this.incomeStatement.closing =a.amount;
              for(let o of e.outlet){
                if(o.accounting!=null){
                  this.incomeStatements[o.id-1]['closing'] +=o.accounting.amount;
                }
              }
              break;
            }
          }
        }
      }
    }
  }
  AccountMonthChange(value){    
    this.monthString= this.common.formatDatePicker(value,'Month')
    this.yearString= this.common.formatDatePicker(!this.year?new Date():this.year,'Year') 
    // this.reset();
    // this.getYearlyReport(this.yearString, this.monthString)
  }
  AccountYearChange(value){
    this.yearString= this.common.formatDatePicker(value,'Year') 
    // this.reset();

  }
  generateStatement(){
    this.reset();
    this.getYearlyReport(this.yearString, isNaN(this.monthString)?0:this.monthString)
  }
  async init() {
    this.outlets = await this.dataService.loadOutlets();
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
