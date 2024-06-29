import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { DataService } from "../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Console } from 'console';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { NzYearPickerComponent } from 'ng-zorro-antd';
import { Purchase } from '../../../models/Purchase';
import { PageHeaderSection } from '../../../models/PageHeaderSection';


@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class PurchaseComponent implements OnInit {
  
  @Input() viewId: Subject<void>;
  @Input() viewMode: Subject<void>;
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private cdr: ChangeDetectorRef, 
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }

  purchaseOrderForm: FormGroup
  accountOrderForm: FormGroup
  supplier_id : Subject<any> = new Subject<any>();
  productCategory : Subject<any> = new Subject<any>();
  purchase_Items : Subject<any> = new Subject<any>();

  id: number;
  private sub: any;
  pageHeader = new PageHeaderSection() ;


  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
  
  pageMode ='Detail';
  subscription(e){
  }
  ngOnInit(): void {
    this.pageHeader.AddButton = null;
    if(+this.viewMode==1){
      this.accountConfig()
    }else{
      this.normalConfig()
    }
    
    if(+this.viewId||!isNaN(+this.viewId)){
      this.loadPurchase(this.viewId);
    } else {
      this.Purchase.type.id =1;
    } 
    if(this.router.url.indexOf('Add')>0){
      this.pageMode ='Add';
    }    
    this.purchaseOrderForm = this.formBuilder.group({
      purchase_date: [new Date().toISOString().split("T")[0], Validators.required],
      invoicetype_index: ['', Validators.required],
      invoice_no: ['', Validators.required],
      total_amount: ['', Validators.required],
      total_stockvalue: [],
      billTo: [],
      paidAmount: [],
      lifeTime: [],
      endYear: [],
      depreciation: [],
      outlet: [],
      supplier_index: ['', Validators.required]
    })    
    this.accountOrderForm = this.formBuilder.group({
      purchase_date: [new Date().toISOString().split("T")[0], Validators.required],
      invoicetype_index: ['', Validators.required],
      invoice_no: [],
      paidAmount: [],
      outlet: [],
      total_amount: ['', Validators.required],
    })
    this.init();
    // this.sub = this.route.params.subscribe(params => {
    //   this.id = +params['id']; // +params['id']; (+) converts string 'id' to a number
    //   if(this.id||!isNaN(this.id)){
    //     this.loadPurchase(this.id);
    //   } else {
    //     this.Purchase.type.id =1;
    //   }    
    // }); 

  }
  StaffLoadSel: boolean = true;
  staff_list:any;
  staff: any;
  billTo: any = '';
  loadStaff(){
    this.dcrService.getallActiveStaffs().subscribe(data => {
      this.StaffLoadSel = false;
      this.staff_list = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }  
  selectedBillTo(index){
    // if(index == null){
    // } else {      
    //   this.Purchase.particular = this.Purchase.particular==null?'':this.Purchase.particular + "[Bill To: " + index + "]"; 
    // } 
    // console.log(this.Purchase.particular)
  }
  buttonEvent(){
    document.getElementById('saveButton').click();
  }
  private async fetchData(category){
    this.InvoiceType = await this.dataService.loadInvoiceType(category);
    if(this.InvoiceType && this.Purchase.type){
      this.InvoiceTypeChange(this.Purchase.type.id);
    }
    this.Suppliers = await this.dataService.loadSuppliers();
    this.loadStaff();
  }
  totalStockValue = 0.0;
  getSeletedData(data){
    this.Purchase.purchaseItemList = data;
    this.totalStockValue = 0.0;
    for(let i =0; i < this.Purchase.purchaseItemList.length; i++){
      this.totalStockValue += parseFloat(this.Purchase.purchaseItemList[i].amount)
    }
    if(!this.Purchase.totalAmount|| this.Purchase.totalAmount==undefined || this.Purchase.totalAmount==null || parseFloat(this.Purchase.totalAmount) == 0.0){
      this.Purchase.totalAmount = this.totalStockValue.toFixed(2)
    }
  }

  ngAfterContentInit() {
  }

  getValue(data){    
    if(data.body.id != null){
      this.SupplierChange(data.body.id);
      
    }
    this.handleCancel();
  }
  isVisible: boolean = false;
  NoResultId = "No Data"
  // outletType : any = [
  //   {
  //     "id":"1",
  //     "description":"S6",
  //   },
  //   {
  //     "id":"2",
  //     "description":"14G",
  //   },
  //   {
  //     "id":"3",
  //     "description":"IT",
  //   },
  //   {
  //     "id":"4",
  //     "description":"Insurance",
  //   },
  // ];
  InvoiceType : any;
  Suppliers : any;
  reset(){
    this.Purchase = new Purchase();
    this.common.notifyChild(this.purchase_Items,this.Purchase.purchaseItemList)
  }
  amountChange(value){
    this.Purchase.totalAmount = parseFloat(this.Purchase.totalAmount).toFixed(2);
  }
  init() {
    // this.fetchData(1);
    this.fetchData(99);    
    this.reset();
  }
  Purchase: Purchase = new Purchase();
  oldpurchaseItemList:any[];
  async loadPurchase(selectedId) {
    if(selectedId ==undefined||isNaN(selectedId)){
      return;
    }
    let data = await this.dataService.loadPurchaseById(selectedId);
    if(data){
      this.Purchase = JSON.parse(JSON.stringify(data));
      this.oldpurchaseItemList = JSON.parse(JSON.stringify(this.Purchase.purchaseItemList));
      this.common.notifyChild(this.productCategory,this.Purchase.type.id)
      this.common.notifyChild(this.purchase_Items,this.Purchase.purchaseItemList)
      
      this.cdr.detectChanges();
    }
  }
  showSupplier = true;
  showLifeTime = false;
  ProductLoadSel: boolean = true;
  InvoiceTypeChange(value){
    if(value != undefined){  
    var selected = this.InvoiceType.filter(i => i.id == parseInt(value));
    if(selected.length > 0){
      if(selected[0].supplier != '1'){
        this.showSupplier = false;
      }else{
        if(selected[0].operator === '-'){
          this.showSupplier = true;
        } else {
          this.showSupplier = false;
        }
      }
      switch(selected[0].id){
        case 4:case 34:{
          this.showLifeTime = true;
          break;
        }
        default: {
          this.showLifeTime = false;
        }
      }
    }else{
      this.showSupplier = false;
    }
    this.common.notifyChild(this.productCategory,value)  
    //   if(this.Purchase.type.id=='1' || 
    //     this.Purchase.type.id=='2' || 
    //     this.Purchase.type.id=='3' ||
    //     this.Purchase.type.id=='4' || 
    //     this.Purchase.type.id=='6'){
    //       this.ProductLoadSel = true;
    //   }else{
    //     this.ProductLoadSel = false;
    //   }
    }    
  }
  getOutlet(outlet: string) {
    this.purchaseOrderForm.controls.outlet.setValue(outlet);
    this.accountOrderForm.controls.outlet.setValue(outlet);
    this.Purchase.outlet.id = outlet;
    console.log();
  }
  
  SupplierChange(value){
    if(value != undefined){      
      this.common.notifyChild(this.supplier_id,value)  
    }
  }
  async savePurchase(){
    if(!this.Purchase.invoiceNo){
      var date_string = this.Purchase.date.toString();
      this.Purchase.invoiceNo = moment(new Date(date_string)).format('YYYYMMDD')
      this.purchaseOrderForm.controls['invoice_no'].setValue(this.Purchase.invoiceNo);
    }
    if(this.Purchase.particular == null || !this.Purchase.particular.includes("[Bill To:")){
      if(this.billTo!=null && this.billTo !=''){
        this.Purchase.particular = this.Purchase.particular==null? '' + "[Bill To: " + this.billTo + "]" : this.Purchase.particular + "[Bill To: " + this.billTo + "]"; 
      }
    }    
    if(!this.Purchase.supplier.id){
      this.Purchase.supplier.id = 46;
    }
    this.isVisible = true;
    console.log('showSupplier')
    console.log(this.showSupplier)
    if(this.showSupplier){
      if(!this.showLifeTime){
        this.purchaseOrderForm.controls['lifeTime'].setValue(0);
      }
      this.dataService.savePurchase(this.purchaseOrderForm,this.Purchase,this.oldpurchaseItemList,this.pageMode,this.location)    
      this.Purchase.invoiceNo = null;
      this.Purchase.particular = null;
    }else{
      if(!this.showLifeTime){
        this.purchaseOrderForm.controls['lifeTime'].setValue(0);
      }
      this.dataService.savePurchase(this.accountOrderForm,this.Purchase,this.oldpurchaseItemList,this.pageMode,this.location) 
      this.Purchase.invoiceNo = null;
      this.Purchase.particular = null;
    }    
    this.isVisible = false;    
  }

  depreciationCalculator(e){
    var date_string = this.Purchase.date.toString();
    let lifeTime = parseInt(this.Purchase.lifeTime.toString());
    let year = moment(new Date(date_string)).format('YYYY');
    this.Purchase.endYear = parseInt(year)+(lifeTime-1);
    let depreciation = parseFloat(this.Purchase.totalAmount) * (1/lifeTime);
    this.Purchase.depreciation = depreciation;
  }

  
  isModalVisible = false;
  addSupplier(){
    this.isModalVisible = true;
  }
  handleCancel(){
    this.isModalVisible = false;
  }

  normalConfig(){
    this.pageHeader.Title = "Purchase Order 进货单";
    this.pageHeader.SaveButton = {
      function : this.buttonEvent,
      name: null
    };
  }
  accountConfig(){
    this.pageHeader.Title = "Account 进账单";
    this.pageHeader.SaveButton = {
      function : this.buttonEvent,
      name: null
    };
    this.pageHeader.CustomButton = [
      {
        function : this.undobuttonEvent,
        name: 'Undo'
      },
      {
        function : this.bankbuttonEvent,
        name: 'Bank 银行过数'
      },
      {
        function : this.cashbuttonEvent,
        name: 'Cash 现金过数'
      }
    ] 
  }

  undobuttonEvent(){
    document.getElementById('undoButton').click();
  }

  
  bankbuttonEvent(){
    document.getElementById('bankButton').click();
  }

  
  cashbuttonEvent(){
    document.getElementById('cashButton').click();
  }

  
  paidAmount: any;
  updateStatus(paymentMode){
    let paidamount = null;
    if(this.paidAmount != this.Purchase.totalAmount){
      paidamount = this.paidAmount;
    }
    if(this.Purchase.paid){
      this.unpaidPurchase(paymentMode,this.Purchase);
    }else{
      this.paidPurchase(paymentMode,this.Purchase,paymentMode,paidamount);
    }    
      
  }
  
  paidPurchase(value,obj,paymentMode,paidamount){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.paidPurchaseByMode(obj,paymentMode,paidamount)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");            
            this.router.navigateByUrl('/PurchaseList/3')
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  unpaidPurchase(value,obj){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.unpaidPurchase(obj)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!"); 
            this.common.backPreviousPage();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  setPaidAmount(){
    this.paidAmount = this.Purchase.totalAmount;
  }
  
}
