import { Input, Output,EventEmitter, Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from "../../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Sales } from '../../../models/Sales';


@Component({
  selector: 'app-cashier-dialog',
  templateUrl: './cashier_dialog.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class CashierDialogComponent implements OnInit {
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
    private location: Location
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }

  @Output() returnResult = new EventEmitter();
  @Input() dialogData: Sales ;
  @Input() isModalVisible:any;
  @Input() mode:any;
  sales: Sales = new Sales;
  isVisible = false;

  ngOnDestroy() {
  }

  ngOnInit(): void {  
    this.sales.paymentType ='1';  
  }

  ngAfterContentInit() {
  
  }
  ngOnChanges(){
    if(this.dialogData){
      this.sales = this.dialogData;
    }
    if(this.isModalVisible){
      this.isVisible = this.isModalVisible
    }

  }
  
  cash(){
    this.sales.paymentType ='1';
  }
  ewallet() {
    this.sales.paymentType ='3';
    this.sales.paidAmount = this.sales.finalTotal
    document.getElementById("submitButton").focus(); 
    
  }

  autopopulate() {
    this.sales.paidAmount = this.sales.finalTotal
    if(this.mode){
      document.getElementById("paidAmount").focus();  
    }
    // document.getElementById("paidAmount").focus();  
  }
  creditCard() {
    this.sales.paymentType ='2';
    this.sales.paidAmount = this.sales.finalTotal
  }

  paidMoney(){
    if(!this.sales.paidAmount){
      return;
    }
    let changes = parseFloat(this.sales.paidAmount) - parseFloat(this.sales.finalTotal);
    this.sales.changes = (changes.toFixed(2)).toString();
  }

  modalLoaded(){
    this.sales.paymentType ='1';
    try{
      document.getElementById("paidAmount").focus(); 
    }catch(e){

    }
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  saveSales(print){
    console.log('saveSales');
    this.sales.print = print;
    this.paidMoney();
    if(!this.common.validatefldNumber(this.sales.finalTotal) || !this.common.validatefldNumber(this.sales.paidAmount)){
      document.getElementById("paidAmount").focus();  
    } else {            
      this.isVisible = false;
      this.returnResult.emit(this.sales);
    }
  }

}
