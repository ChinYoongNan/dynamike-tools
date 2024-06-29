import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from "../../../services/common.dynamike.service";
import { DataService } from "../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Console } from 'console';
import { Subject, BehaviorSubject } from 'rxjs';


import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-purchaselisting',
  templateUrl: './purchaselisting.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class PurchaseListComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  @Input() GLCategory;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    public dynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private nzContextMenuService: NzContextMenuService,
    private dataService: DataService,
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  
  public tableData : Subject<any> = new Subject<any>();  
  pageHeader = {
    Title: "进账记录 General Ledger",
    AddButton : {
      routerLink: "/PurchaseAdd"
      // queryParams: {debug: true}
    }
  }

  nestedHeaderData=[
    {
      header:"Product Code",
      column:"productCode",
      edit: true,
      type: "text"
    },
    {
      header:"Product Name",
      column:"productName",
      edit: true,
      type: "text"
    },
    {
      header:"Quantity",
      column:"quantity",
      edit: true,
      type: "text"
    },
    {
      header:"Unit Cost",
      column:"unitCost",
      edit: true,
      type: "text"
    },
    {
      header:"Expired Date",
      column:"expired",
      edit:false,
      type:null,
    }
  ]
    
  headerData=[
    {
      header:"Date / 日期",
      column:"date",
      edit:false,
      type:null
    },
    {
      header:"Suppiler / 供应商",
      column:"supplier",
      nestedColumn:"name",
      edit: false,
      type: "text"
    },
    {
      header:"Particular / 内容",
      column:"particular",
      edit: true,
      type: "number"
    },
    {
      header:"Invoice No / 单号码",
      column:"invoiceNo",
      edit: true,
      type: "text"
    },
    {
      header:"Type / 单类",
      column:"type",
      nestedColumn:"description",
      edit: false,
      type: "textarea"
    },
    {
      header:"Amount / 总额",
      column:"totalAmount",
      conditionColumn: "balanceAmount",
      edit: true,
      type: "text"
    },
    {
      header:"Paid / 已付",
      column:"paid",
      edit: true,
      status: true,
      type: "text"
    }
  ];
  InvoiceType:any;
  invoice_type:any;
  Suppliers : any;  
  AccountYears: any;
  year_index: any;
  monthfield:any;
  month_index:any;
  bankAmount:any = 0.0;
  expandProperty="purchaseItemList";
  tableSettings = {
    Delete : {
      function: this.deleteButton
    },
    Action: {
      Update:{        
        function: this.updateButton        
      },
      Buttons:null,
      View:{        
        function: this.viewButton        
      }      
    },
    nested :{
      tableHeaderData :this.nestedHeaderData,
      // Delete : {
      //   function: this.deleteButton
      // },
      // Action: {
      //   Update:{        
      //     function: this.updateButton        
      //   }
      // }
    }
  }
  
  item_id;

  nullvalue = {value:null,label:"All"};
  

  //upgrade Select data
  ProductLoadSel: boolean = true;
  SupplierLoadSel: boolean = true;
  InvoiceLoadSel: boolean = true;
  headerColumn = ["Item#","Product Code / 代号","Quantity / 数量","Unit Cost / 单价","Expired Date / 过期","Delete / 删除"];
  purchase_items: any = { "purchase_item": []};

  txtSearch :any;
  Items : any;
  invoicetype_index:any;
  invoicetype_id:any;
  invoicetype:any;
  ssm:any;
  supplier_index :any;
  supplier_id:any;
  supplier_name:any;
  purchase_date = new Date().toISOString().split("T")[0];
  invoice_no : any = "";
  particular= "";
  type= "";
  total_amount = "";
  purchase_id:any;
  paid:any;
  Products:any;
  isVisible: boolean = false;
  NoResultId = "No Data"
  All = 0;
  tableEmpty: boolean = true;
  Purchases :any;
  status_index:any;
  statusType = [{'id':1,'description':'已还数 Completed'},{'id':0,'description':'没还数 InCompleted'}]
  ngOnInit(): void {
    this.init();    
  }

  ngAfterContentInit() {
  }
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
  viewButton(){
    document.getElementById("viewButton").click()
  }
  bankButton(){
    document.getElementById("bankButton").click()
  }
  cashButton(){
    document.getElementById("cashButton").click()
  }
  
  goToDetails() {    
    switch(this.productCategory){
      // case 2:{    
      //   this.router.navigate(['/Account', this.id,2]);
      //   break;
      // }
      case 3:{  
        this.router.navigate(['/Purchase', this.dynamike.id,1]);
        break;
      }
      default:{
        this.router.navigate(['/Purchase', this.dynamike.id,0]);

      }
    }
  }
  
  deletePurchase(value:any = null){    
    // if(value == null){
    //   console.log(this.Purchases.findIndex(item => item.id === this.dynamike.id));
    //   var selected = this.Purchases.filter(i => i.id == parseInt(this.dynamike.id));
    //   value = this.Purchases.indexOf(selected[0]);
    // }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deletePurchase(this.dynamike.id)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("delete successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  updateStatus(){ 
    let paymentMode = null;
    let paidamount = null
    if(this.dynamike.id){
      if(this.dynamike.id['data']){
        paymentMode = this.dynamike.id['optionValue']
        paidamount = this.dynamike.id['customfile']
      }else{
        paymentMode = this.dynamike.id;
      }
    }
    this.dynamike.id = this.dynamike.updateData.id;
    if(this.Purchases.content){
      var selected = this.Purchases.content.filter(i => i.id == parseInt(this.dynamike.id));
      var value = this.Purchases.content.indexOf(selected[0]);
      if(this.Purchases.content[value].paid){
        this.unpaidPurchase(value,this.Purchases.content[value]);
      }else{
        this.paidPurchase(value,this.Purchases.content[value],paymentMode,paidamount);
      }      
    }else{
      var selected = this.Purchases.filter(i => i.id == parseInt(this.dynamike.id));
      var value = this.Purchases.indexOf(selected[0]);
      if(this.Purchases[value].paid){
        this.unpaidPurchase(value,this.Purchases[value]);
      }else{
        this.paidPurchase(value,this.Purchases[value],paymentMode,paidamount);
      }    
    }  
  }

  
  updatePaidStatus(paymentMode){ 
    console.log('updatePaidStatus');
    let paidamount = null
    this.dynamike.id = this.dynamike.updateData.id;
    if(this.Purchases.content){
      var selected = this.Purchases.content.filter(i => i.id == parseInt(this.dynamike.id));
      var value = this.Purchases.content.indexOf(selected[0]);      
      paidamount = this.Purchases.content[value].totalAmount;
      if(this.Purchases.content[value].paid){
        this.unpaidPurchase(value,this.Purchases.content[value]);
      }else{
        this.paidPurchase(value,this.Purchases.content[value],paymentMode,paidamount);
      }      
    }else{
      var selected = this.Purchases.filter(i => i.id == parseInt(this.dynamike.id));
      var value = this.Purchases.indexOf(selected[0]);      
      paidamount = this.Purchases[value].totalAmount;
      if(this.Purchases[value].paid){
        this.unpaidPurchase(value,this.Purchases[value]);
      }else{
        this.paidPurchase(value,this.Purchases[value],paymentMode,paidamount);
      }    
    }  
  }
  
  paidPurchase(value,obj,paymentMode,paidamount){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.paidPurchaseByMode(obj,paymentMode,paidamount)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");
            obj.paid=true 
            obj.paidDate=res['body']['paidDate'];
            obj.bankAmount=res['body']['bankAmount'];
            this.loadPage(false);
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }

  unpaidPurchase(value,obj){
    console.log('unpaidPurchase');
    let promise = new Promise((resolve, reject) => {
      this.dcrService.unpaidPurchase(obj)
        .toPromise()
        .then(
          res => { // Success
            console.log(res);
            this.common.createBasicMessage("save successful!!!");
            obj.paid=false      
            obj.paidDate=null; 
            obj.bankAmount=null;    
            this.loadPage(false);
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  updatePurchase(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.updatePurchase(this.dynamike.updateData,[],[])
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  AccountMonthChange(month){
    this.month_index = this.common.formatDatePicker(month,'Month')
    if(this.year_index){      
      this.AccountYearChange(this.year_index);
    }
  }
  SupplierChange_Listing(type){
    this.supplier_id = type;
    this.AccountYearChange(this.year_index);
  }
  InvoiceTypeChange_Listing(type){
    this.invoice_type = type;
    this.AccountYearChange(this.year_index);
  }
  AccountYearChange(year){
    this.dynamike.resetPagnitaionData();
    this.nextPage(this.dynamike.paginationData);
  }
  async nextPage(paginationData,that:any = this){
    let page = paginationData.pageable.pageNumber
    let size = paginationData.pageable.pageSize
    console.log(that.productCategory)
    switch(that.productCategory){
      case 3:{
        let data = await that.dataService.loadFullAccount(that.common.fldIntValue(that.year_index),that.common.fldIntValue(that.month_index),that.common.fldIntValue(that.invoice_type),that.status_index,that.common.fldValue(that.txtSearch),page,size);
        if(data){
          that.Purchases = data;
          that.common.notifyChild(that.tableData,data);
        }
        break;
      }
      case 4:{
        let data = await that.dataService.loadPurchaseByCategorySize(that.common.fldIntValue(that.year_index),that.common.fldIntValue(that.month_index),that.common.fldIntValue(that.invoice_type),that.common.fldValue(that.txtSearch),page,size);
        if(data){
          that.Purchases = data;
          that.common.notifyChild(that.tableData,data);
        }
      }
      default:{
        let data = await that.dataService.loadPurchaseBySize(that.common.fldIntValue(that.year_index),that.common.fldIntValue(that.month_index),that.common.fldIntValue(that.invoice_type),that.common.fldIntValue(that.supplier_id),that.common.fldValue(that.txtSearch),page,size);
        if(data){
          that.Purchases = data;
          that.common.notifyChild(that.tableData,data);
        }
      }
    }
  }
  private async fetchData(category){
    this.InvoiceType = await this.dataService.loadInvoiceType(category);
    this.Suppliers = await this.dataService.loadSuppliers();
    this.AccountYears = await this.dataService.loadAccountYears();
    if(this.AccountYears){
      this.year_index = this.AccountYears[0];  
      switch(this.productCategory){
        case 3:{
          this.pageHeader.Title = "账簿记录 Account";
          this.pageHeader.AddButton.routerLink = "/PurchaseAdd";
          this.loadPage(true);
          break;
        }
        default:{
          this.pageHeader.Title = "进账记录 General Ledger";
          this.pageHeader.AddButton.routerLink = "/PurchaseAdd";
        }
      }
    }
  }
  sub$:any;
  category:any;
  productCategory:any;
  init() {    
    this.sub$ = this.route.params.subscribe(params => {
      if(!this.category){
        if(params['category']){
          this.productCategory = +params['category']; // +params['id']; (+) converts string 'id' to a number
        }
      }else{
        this.productCategory = this.category;
      }
      if(this.productCategory ==3){
        this.headerData=[
          {
            header:"Date / 日期",
            column:"date",
            edit:false,
            type:null
          },
          {
            header:"Suppiler / 供应商",
            column:"supplier",
            nestedColumn:"name",
            edit: false,
            type: "text"
          },
          {
            header:"Particular / 内容",
            column:"particular",
            edit: true,
            type: "number"
          },
          {
            header:"Invoice No / 单号码",
            column:"invoiceNo",
            edit: true,
            type: "text"
          },
          {
            header:"Type / 单类",
            column:"type",
            nestedColumn:"description",
            edit: false,
            type: "textarea"
          },
          {
            header:"Amount / 总额",
            column:"totalAmount",
            conditionColumn: "balanceAmount",
            edit: true,
            type: "text"
          },
          {
            header:"Paid / 已付",
            column:"paid",
            edit: true,
            status: true,
            type: "text"
          },
          {
            header:"Paid Date/ 已付",
            column:"paidDate",
            edit: false,
            type: "text"
          },
          {
            header:"Balance",
            column:"bankAmount",
            edit: false,
            type: "text"
          }
        ];
        this.expandProperty=null;
        this.tableSettings = {
          Delete : null,
          Action: {
            Update:{        
              function: this.updateButton        
            },
            Buttons:[
              {        
                function: this.bankButton,
                icon: 'bank'
              },              
              {        
                function: this.cashButton,
                icon: 'dollar'
              }
            ],   
            View:{        
              function: this.viewButton        
            }
          },
          nested :null
        }
      }else{
        this.headerData=[
          {
            header:"Date / 日期",
            column:"date",
            edit:false,
            type:null
          },
          {
            header:"Suppiler / 供应商",
            column:"supplier",
            nestedColumn:"name",
            edit: false,
            type: "text"
          },
          {
            header:"Particular / 内容",
            column:"particular",
            edit: true,
            type: "number"
          },
          {
            header:"Invoice No / 单号码",
            column:"invoiceNo",
            edit: true,
            type: "text"
          },
          {
            header:"Type / 单类",
            column:"type",
            nestedColumn:"description",
            edit: false,
            type: "textarea"
          },
          {
            header:"Amount / 总额",
            column:"totalAmount",
            conditionColumn: "balanceAmount",
            edit: true,
            type: "text"
          }
        ];
        this.expandProperty="purchaseItemList";
        this.tableSettings = {
          Delete : {
            function: this.deleteButton
          },        
          Action: {
            Update:{        
              function: this.updateButton        
            },
            Buttons:null,  
            View:{        
              function: this.viewButton        
            }
          },
          nested :{
            tableHeaderData :this.nestedHeaderData

          }
        }

      }    
      console.log('GLCategory')
      if(this.GLCategory){
        this.productCategory = this.GLCategory;
        this.refresh();
      }    
      if(this.productCategory != 3){
        this.fetchData(99);

      }else{
        this.fetchData(this.productCategory);
      }
      
    });  
  }
  
  async loadPage(refresh){
    let result = await this.dataService.getBankAccountAmount();
    this.bankAmount = result['bank'];
    document.getElementById("total").innerHTML = "Bank Account Amount : RM "+ this.bankAmount;
    this.status_index = 0;
    if(refresh){
      this.refresh();
    }
  }
  
  ngOnDestroy() {    
    this.sub$.next(true);
    this.sub$.complete();
  }
  refresh() : void {
    this.AccountYearChange(this.year_index);
  }

  isModalVisible = false;

  PurchaseItems:any;  
  OldPurchaseItems:any;
  // showModal(value): void {
  //   this.isModalVisible = true;
  //   this.dcrService.getPurchaseItems(this.Purchases[value].id).subscribe(data => {
  //     this.purchase_id = this.Purchases[value].id;
  //     this.PurchaseItems = data;     
  //     this.OldPurchaseItems=JSON.parse(JSON.stringify(data));
  //     console.log(this.Purchases[value]);
  //     this.loadProduct(this.Purchases[value].supplier.id);
  //     document.getElementsByClassName("ant-modal")[0].setAttribute("style","width:100%");  
  //   }, error => {
  //     if (error.error.text != "No Results") {
  //       this.common.errStatus(error.status, error.error);
  //     }
  //   })
  // }
  
  // loadProduct(value){
    // let promise = new Promise((resolve, reject) => {
    //   this.dcrService.getProductbySupplier(value)
    //     .toPromise()
    //     .then(
    //       data => { // Success
    //         this.ProductLoadSel = false;
    //         this.Items = data;
    //       },
    //       msg => { // Error
    //         this.common.createModalMessage(msg.error.error, msg.error.message).error()
    //       }
    //     );
    // });
  // }
  selectedPurchase_index:any;
  EditModal(value): void {
    this.selectedPurchase_index =value;
    document.getElementById("editModel").style.display = "";
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isModalVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isModalVisible = false;
    this.reset();
    document.getElementById("editModel").style.display = "none";
  }


  item_index:any;
  item_code:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  item_expired:any;
  addItems(product_code,quantity,unit_cost,expired, name){
    // ,amount
    let purchase_item: any = {
      "purchaseId":this.purchase_id,
      "productCode": product_code,
      "quantity": quantity,
      "unitCost": unit_cost,
      "expired": expired,
      "name": name,
      // "amount": amount
    } 
    if(product_code){
      this.PurchaseItems.push(purchase_item);
    }
    
    
    this.item_index =null;
    this.item_code =null;
    this.item_unit_cost = null;
    this.item_quantity = null;
    this.item_name = null;
    this.item_expired = null
    
  }


  amountChange(value){
    this.total_amount = parseFloat(this.total_amount).toFixed(2);
  }
  deleteItem(index){
    this.PurchaseItems.splice(index,1);
  }
  reset(){
    this.invoicetype_index=null;
    this.invoicetype_id=null;
    this.invoicetype=null;
    this.purchase_date = new Date().toISOString().split("T")[0];
    this.invoice_no  = "";
    this.particular= "";
    this.type= "";
    this.total_amount = "";
    this.invoicetype_index=null;
    this.invoicetype_id=null;
    this.invoicetype=null;
    this.ssm=null;
    this.supplier_index=null;
    this.supplier_id=null;
    this.supplier_name=null;
    this.purchase_items = { "purchase_item": [],"old_purchase_item":[]};
  }
 
  InputChange(value){
    this.item_index =null;
    this.item_unit_cost = null;
  }

  ItemChange(value) {
    this.item_id = this.Items[value].id;
    this.item_code = this.Items[value].code;
    // this.searchProduct();
  }
  // searchProduct(){
  //   if(this.item_code){
  //     this.dcrService.getProductbyId(this.item_id).subscribe(data => {
  //       this.Products = data;
  //       if(this.Products.length>0){
  //         let Product = this.Products[0];
  //         console.log(Product);
  //         this.item_code = Product.code;
  //         this.item_unit_cost = Product.unitCost;
  //         this.item_name = Product.name;
  //       }else{
  //         this.item_code = null;
  //         this.item_unit_cost = null;
  //         this.common.createModalMessage("Failed","No Product Found").error();
  //       }
        
  //     }, error => {
  //       if (error.error.text != "No Results") {
  //         this.common.errStatus(error.status, error.error);
  //       }
  //     })

  //   }    
  // }

  
  

  updatePurchaseItem(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.updatePurchaseItem(this.PurchaseItems,this.OldPurchaseItems)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    this.isModalVisible = false;
  }



  activatedNode?: NzTreeNode;
  nodes = [
    {
      title: 'purchase id ',
      key: '100',
      // author: 'NG ZORRO',
      expanded: true,
      children: [
        { title: 'K0077 - 1 ', key: '1000', author: 'NG ZORRO', isLeaf: true },
        { title: 'K0078 - 2', key: '1001', author: 'NG ZORRO', isLeaf: true }
      ]
    },
    {
      title: 'parent 1',
      key: '101',
      // author: 'NG ZORRO',
      children: [
        { title: 'leaf 1-0', key: '1010', author: 'NG ZORRO', isLeaf: true },
        { title: 'leaf 1-1', key: '1011', author: 'NG ZORRO', isLeaf: true }
      ]
    }
  ];

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    console.log(data);
    this.activatedNode = data.node!;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  selectDropdown(): void {
    // do something
  }

}
