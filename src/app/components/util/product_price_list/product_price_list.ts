import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef,Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//service
import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
import { CommonService } from "../../../services/common.service";
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product_price_list',
  templateUrl: './product_price_list.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class ProductPriceListComponent {
  
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    private formBuilder: FormBuilder,
  ) { 
  }
  
  public tableData : Subject<any> = new Subject<any>();  
  
  headerData   = [ 
    {
      header:"Price Type",
      column:"priceType",
      edit:false,
      type:null
    },
    {
      header:"Unit Price",
      column:"sellingPrice",
      edit:false,
      type:null
    },
    // {
    //   header:"Packaging Size",
    //   column:"packagingsize",
    //   edit:false,
    //   type:null
    // },
    // {
    //   header:"Net Weight",
    //   column:"netweight",
    //   edit:false,
    //   type:null
    // },
    // {
    //   header:"Dimension",
    //   column:"dimension",
    //   edit:false,
    //   type:null
    // },
  ]
  tableSettings = {        
    // Delete : {
    //   function: this.deleteButton
    // },
    Action : null
  }
  forms: FormGroup;
  @Input() notifier: Subject<void>;
  @Output() seletedData = new EventEmitter();
  @Input() mode: any ;
  nestedHeaderData=[
    {
      header:"Price Type",
      column:"priceType",
      exclusive: "SellingPrice",
      edit:false,
      type:null,
    },
    {
      header:"Selling Price",
      column:"sellingPrice",
      edit: true,
      type: "text"
    },
    {
      header:"Net Weight",
      column:"netweight",
      edit: true,
      type: "text"
    },
    {
      header:"Packaging Size",
      column:"packagingsize",
      edit: true,
      type: "text"
    }
  ] 
  headerColumn = ["Price Type","Selling Price","Net Weight","Unit Cost / 单价","Packaging Size","Action"];
  ListItems:any[] = [];
  PriceType:any;
  Items:any = {
    priceType:null,
    sellingPrice:null,
    packagingsize:null,
    netweight:null,
    dimension:null,
  }
  Products:any;
  ngOnInit(){
    // this.forms = this.formBuilder.group({
    //   item_quantity: ['', Validators.required],
    //   item_unit_cost: ['', Validators.required]
    // })
    this.init()
  }
  ngOnDestroy() {
    if(this.notifier){
      this.notifier.unsubscribe();
    }
  }
  init() {  
    if(this.notifier){
      this.notifier.subscribe((data) => 
        this.subscription(data)
      );   
    }
    this.loadPriceType();
  }
  subscription(e,mode:any = null){
    this.ListItems = e;
    this.common.notifyChild(this.tableData,this.ListItems);
  }
  wholesale:boolean = false;
  PriceTypeChange(value) {
    switch(value){
      case'WholesaleingPrice':{
        this.wholesale = true;
        break;
      }
      default:{
        this.wholesale = false;
      }
    }
  }
  private async loadPriceType(){
    this.PriceType = await this.dataService.loadPriceType();
  }
  addItems(Items){
    let item = JSON.parse(JSON.stringify(Items));
    let selectedIndex = this.ListItems.findIndex(i=>i.priceType == item.priceType);
    if(selectedIndex >= 0){
      let selectedItems = this.ListItems[selectedIndex];
      item.id = selectedItems.id;
      item.product_id = selectedItems.product_id;
      this.deleteItem(selectedIndex);
    }
    this.ListItems.push(item);
    this.common.notifyChild(this.tableData,this.ListItems);
    this.seletedData.emit(this.ListItems);  
    this.reset();
  }
  reset(){
    this.Items = {
      priceType:null,
      sellingPrice:null,
      packagingsize:null,
      netweight:null,
      dimension:null,
    }
  }
  deleteItem(index){
    this.ListItems.splice(index,1);
    this.seletedData.emit(this.ListItems);
  }
 
  setPackage(unitCost){
    // if(parseFloat(this.Items.packagingsize) < 10){
    //   this.Items.sellingPrice = ((parseFloat(unitCost) + 1)* parseFloat(this.Items.packagingsize)).toFixed(2);
    // }else{
    //   this.Items.sellingPrice = ((parseFloat(unitCost) + 0.7)* parseFloat(this.Items.packagingsize)).toFixed(2);
    // }
    // this.Items.netweight = (parseFloat(this.Items.netweight) * parseFloat(this.Items.packagingsize) +0.5).toFixed(2);
  }
}

