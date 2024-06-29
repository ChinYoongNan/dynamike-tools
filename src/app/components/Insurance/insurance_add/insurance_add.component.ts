import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { DataService } from "../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading";
import { Location } from '@angular/common';
import { AnySrvRecord } from 'dns';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PageHeaderSection } from '../../../models/PageHeaderSection';


@Component({
  selector: 'app-insurance_add',
  templateUrl: './insurance_add.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class InsuranceAddComponent implements OnInit {
  
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
    private dataService:DataService
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }

  pageHeader = new PageHeaderSection();
  buttonEvent(){
    document.getElementById('receipt').click();
  }
  policyGroup: FormGroup;

  id: number;
  private sub: any;
  ngOnInit(): void {
    this.init();
    this.policyGroup = this.formBuilder.group({
      insuranceClient_index: ['', Validators.required],
      product_index: ['', Validators.required],
      policy_no: ['', Validators.required],
      insured_object: ['', Validators.required],
      insured_date: ['', Validators.required],
      renewal_date: ['', Validators.required],
      content_value: ['', Validators.required],
    })    
    this.sub = this.route.params.subscribe(params => {
      this.insurancePolicyInfo.id = +params['id'];
        this.loadPolicy();
    }); 
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  ngAfterContentInit() {
    
  }

  calculator(e){
    if(!this.rate){
      document.getElementById("type").focus();
      return; 
    }
    if(!this.insurancePolicyInfo.premium || this.insurancePolicyInfo.premium ==null){
      return;
    }
    this.insurancePolicyInfo.stampDuty = 10.0;
    this.insurancePolicyInfo.gst = parseFloat(this.insurancePolicyInfo.premium) * 0.08;
   
    var per = parseFloat(this.rate) /100;
      
    this.insurancePolicyInfo.commission = parseFloat(this.insurancePolicyInfo.premium) * per;
    if(this.insurancePolicyInfo.gst == null){
      this.insurancePolicyInfo.gst = 0.0;
    }
    if(this.insurancePolicyInfo.serviceCharges == null){
      this.insurancePolicyInfo.serviceCharges = 0.0;
    }
    if(this.insurancePolicyInfo.roadtax == null){
      this.insurancePolicyInfo.roadtax = 0.0;
    }
    if(this.insurancePolicyInfo.postage == null){
      this.insurancePolicyInfo.postage = 0.0;
    }
    if(this.insurancePolicyInfo.others == null){
      this.insurancePolicyInfo.others = 0.0;
    }
    
    if(this.insurancePolicyInfo.discount == null){
      this.insurancePolicyInfo.discount = 0.0;
    }

    if(this.insurancePolicyInfo.commission == null){       
      this.insurancePolicyInfo.commission = 0.0      
    }
   
    this.insurancePolicyInfo.netAmount = parseFloat(this.insurancePolicyInfo.premium) + parseFloat(this.insurancePolicyInfo.gst) + parseFloat(this.insurancePolicyInfo.stampDuty) - parseFloat(this.insurancePolicyInfo.commission);
    
    this.insurancePolicyInfo.finalAmount = parseFloat(this.insurancePolicyInfo.premium) + parseFloat(this.insurancePolicyInfo.gst) + parseFloat(this.insurancePolicyInfo.stampDuty) + parseFloat(this.insurancePolicyInfo.serviceCharges) + parseFloat(this.insurancePolicyInfo.roadtax) + parseFloat(this.insurancePolicyInfo.postage) + parseFloat(this.insurancePolicyInfo.others);
    this.insurancePolicyInfo.finalAmount = parseFloat(this.insurancePolicyInfo.finalAmount) -parseFloat(this.insurancePolicyInfo.discount);
    
    this.tofixed2();
  }
  tofixed2(){        
    this.insurancePolicyInfo.premium =  parseFloat(this.insurancePolicyInfo.premium).toFixed(2);
    this.insurancePolicyInfo.gst =  parseFloat(this.insurancePolicyInfo.gst).toFixed(2);
    this.insurancePolicyInfo.serviceCharges =  parseFloat(this.insurancePolicyInfo.serviceCharges).toFixed(2);
    this.insurancePolicyInfo.roadtax =  parseFloat(this.insurancePolicyInfo.roadtax).toFixed(2);
    this.insurancePolicyInfo.postage =  parseFloat(this.insurancePolicyInfo.postage).toFixed(2);
    this.insurancePolicyInfo.others =  parseFloat(this.insurancePolicyInfo.others).toFixed(2);
    this.insurancePolicyInfo.commission =  parseFloat(this.insurancePolicyInfo.commission).toFixed(2);
    this.insurancePolicyInfo.netAmount =  parseFloat(this.insurancePolicyInfo.netAmount).toFixed(2);
    this.insurancePolicyInfo.finalAmount =  parseFloat(this.insurancePolicyInfo.finalAmount).toFixed(2);
  }
  dateChange(e){
    var renewal = new Date(this.insured_date)
    renewal.setFullYear(renewal.getFullYear() + 1);
    renewal.setDate(renewal.getDate() - 1);
    this.renewal_date = (moment(renewal)).format('YYYY-MM-DD');
    this.insurancePolicyInfo.renewalDate = this.renewal_date;
    this.year = (moment(new Date())).format('YYYY');
    this.month = (moment(new Date())).format('MM');
  }
  InsuranceClient: any;
  InsuranceClientLoadSel = true;
  insuranceClient_index: any;

  product_index:any;
  product_type:any;
  dateRange:any;
  company_index: any;
  insured_object: any;
  renewal_date: any;
  road_tax: any;
  postage: any;
  policy_no:any;
  discount:any=0.0;
  insured_date:any;
  year:any;
  month:any;
  plan_covered:any;
  refer_no:any;
  premium:any;
  commission:any;
  gst:any;
  stamp_duty:any;
  net_amount:any;
  service_charges:any;
  other:any;
  risk:any;
  building_basic_rate:any;
  content_value:any=0.0;
  content_basic_rate:any;
  contruction_class:any;
  rate_status:any;
  occupied_as:any;
  piam_code:any;
  fire_lighting_rate:any;
  riot_strike_damage:any;
  year_in_make:any;
  engine:any;
  chasis:any;
  make_body:any;
  type_of_body:any;
  cc:any;
  wind_screen:any = 0.0;
  e_hailing:any = 0.0;
  staff_code:any;
  splitRoadTax:any;
  finalAmount: any;

    
  Client: any;
  client_index:any;
  client_name:any;
  client_contact:any;
  client_address:any;
  client_email:any;
  client_shippingAddress:any;
  insured_id:any;
  company:any;
  insured_name:any;
  plate_no:any;
  ic:any;
  address:any;
  client_id:any;
  keyword:any;
  pdfpassword:any;
  reset(){
    this.discount=null;
    this.policy_no=null;
    this.insured_date=null;
    this.year=null;
    this.month=null;
    this.plan_covered=null;
    this.refer_no=null;
    this.premium=null;
    this.commission=0.0;
    this.gst=null;
    this.stamp_duty=null;
    this.net_amount=null;
    this.service_charges=null;
    this.other=null;
    this.risk=null;
    this.building_basic_rate=null;
    this.content_value=null;
    this.content_basic_rate=null;
    this.contruction_class=null;
    this.rate_status=null;
    this.occupied_as=null;
    this.piam_code=null;
    this.fire_lighting_rate=null;
    this.riot_strike_damage=null;
    this.year_in_make=null;
    this.engine=null;
    this.chasis=null;
    this.make_body=null;
    this.type_of_body=null;
    this.cc=null;
    this.wind_screen=0.0;
    this.e_hailing=0.0;
    this.staff_code=null;
    this.splitRoadTax = null;
    this.product_type=null;

    this.Client = null;
    this.client_index = null;
    this.client_name = null;
    this.client_contact = null;
    this.client_address = null;
    this.client_email = null;
    this.client_shippingAddress = null;
    this.insured_id = null;
    this.plate_no = null;
    this.company = null;
    this.insured_name = null;
    this.ic = null;
    this.address = null;
    this.client_id = null;
    this.keyword = null;
    this.pdfpassword = null;
    this.insurancePolicyInfo = {
      id: null,
      "insuredObject":this.insured_object,
      "roadtax": this.road_tax,
      "postage": this.postage,
      "renewalDate":this.renewal_date,
      // "remark": this.remark,
      "type": this.product_type,
      "company": this.company_index,
      "policyNo":this.policy_no,
      "insuredDate": this.insured_date,
      "year": this.year,
      "month": this.month,
      "planCovered": this.plan_covered,
      "referNo": this.refer_no,
      "premium": this.premium,
      "commission": this.commission,
      "gst": this.gst,
      "stampDuty": this.stamp_duty,
      "netAmount": this.net_amount,
      "serviceCharges": this.service_charges,
      "others": this.other,
      "finalAmount":this.finalAmount,
      "risk": this.risk,
      "buildingBasicRate": this.building_basic_rate,
      "contentValue": this.content_value,
      "contentBasicRate": this.content_basic_rate,
      "contructionClass": this.contruction_class,
      "rateStatus": this.rate_status,
      "occupiedAs": this.occupied_as,
      "piamCode": this.piam_code,
      "fireLightingRate": this.fire_lighting_rate,
      "riotStrikeDamage": this.riot_strike_damage,
      "yearInMake": this.year_in_make,
      "engine": this.engine,
      "chasis": this.chasis,
      "makeBody": this.make_body,
      "typeOfBody": this.type_of_body,
      "cc": this.cc,
      "windScreen": this.wind_screen,
      "eHailing": this.e_hailing,
      "staffCode": this.staff_code,      
      "discount": this.discount,    
      "splitRoadTaxPayment": this.splitRoadTax
    } 
  }
  renews: 0;
  Policies: any;
  Companies: any;
  CompanyLoadSel: boolean = true;
  ProductTypeLoadSel:boolean = false;
  ProductTypes:any;
  PlanType:any;
  init() {
    this.pageHeader.AddButton = null;
    this.pageHeader.Title = "Insurance Policy";
    this.pageHeader.SaveButton.function = this.buttonEvent;
    this.company_index=5;
    this.dcrService.getProductTypes(3)
      .toPromise()
      .then(
        data => { // Success
          this.ProductTypeLoadSel = false;
          this.ProductTypes = data; 
        },
        msg => { // Error
          this.common.createModalMessage(msg.error.error, msg.error.message).error()
        }
      );
    this.insured_date = new Date().toISOString().split("T")[0];
    this.insurancePolicyInfo.insuredDate = this.insured_date;
    this.dateChange(null);
    this.loadStaff();
  }
  rate:any=0;
  TypeChange(value){
    this.product_type = this.ProductTypes[value].id;
    this.insurancePolicyInfo.type = this.product_type;
       
    var selected = this.ProductTypes.filter(i => i.id == parseInt(this.insurancePolicyInfo.type));
    var value = this.ProductTypes.indexOf(selected[0]);
    this.rate = selected[0].prefix;
    this.calculator(null);
  }
  async loadPolicy(){
    if(!this.insurancePolicyInfo.id){
      return;
    }
    let data = await this.dataService.loadPolicyById(this.insurancePolicyInfo.id)
    if(data){
      this.insurancePolicyInfo = JSON.parse(JSON.stringify(data));      
      try{
        var selected = this.ProductTypes.filter(i => i.id == parseInt(this.insurancePolicyInfo.type));
        var value = this.ProductTypes.indexOf(selected[0]);
        this.product_index= value; 
      } catch(e){
        
      }
      try{
        var selected = this.staff_list.filter(i => i.code == parseInt(this.insurancePolicyInfo.staffCode));
        var value = this.staff_list.indexOf(selected[0]);
        this.staff = value; 
      } catch(e){
        
      }
      
      try{
        var selected = this.staff_list.filter(i => i.name == parseInt(this.insurancePolicyInfo.splitRoadTaxPayment));
        var value = this.staff_list.indexOf(selected[0]);
        this.splitRoadTax = value; 
      } catch(e){
        
      }
      this.plate_no = this.insurancePolicyInfo.insuredObject;  
      // this.ic=this.Client[0].ic;
    }
  }

  isVisible: boolean = false;
  isModalVisible = false;
  searchClient(event){
    this.dcrService.getInsuranceClientsbyName(event.target.value, event.target.value).subscribe(data => {
      // this.ClientLoadSel = false;
      this.Client = data;
      if(this.Client.length<1){
        this.ic =event.target.value;
      }else{
        this.ic=this.Client[0].ic;
        this.plate_no=this.Client[0].platNo;
        this.client_name=this.Client[0].name;
        this.keyword=this.Client[0].keyword;
      }
      document.getElementById("clients").blur();
      document.getElementById("clients").focus();
    }, error => {
      if (error.error.text != "No Results") {
        this.ic =event;
        this.common.errStatus(error.status, error.error);
      }
    });
  }
  StaffLoadSel: boolean = true;
  staff_list:any;
  staff: any;
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
  selectedStaff(index){
    if(index == null){
      this.staff_code = null;
    } else {
      this.staff_code = this.staff_list[index].code; 
    }
  }
  selectedStaffForRoadTax(index){
    if(index == null){
      this.splitRoadTax = null;
    } else {
      this.splitRoadTax = this.staff_list[index].name; 
    } 
  }
  savePolicy(){
    this.insured_object=this.plate_no;   
    this.insurancePolicyInfo.staffCode=this.staff_code;
    this.insurancePolicyInfo.insuredObject = this.insured_object;
    this.insurancePolicyInfo.splitRoadTaxPayment = this.splitRoadTax;
    this.insurancePolicyInfo.type = this.product_type
    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.savePolicy(this.insurancePolicyInfo)
        .toPromise()
        .then(
          res => { // Success
            this.reset();      
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  insurancePolicyInfo = {
    id: null,
    insuredObject:null,
    roadtax: null,
    postage: null,
    renewalDate:null,
    // remark: null,
    type: null,
    company: null,
    policyNo:null,
    insuredDate: null,
    year: null,
    month: null,
    planCovered: null,
    referNo: null,
    premium: null,
    commission: null,
    gst: null,
    stampDuty: null,
    netAmount: null,
    serviceCharges: null,
    others: null,
    finalAmount:null,
    risk: null,
    buildingBasicRate: null,
    contentValue:null,
    contentBasicRate: null,
    contructionClass:null,
    rateStatus:null,
    occupiedAs: null,
    piamCode:null,
    fireLightingRate: null,
    riotStrikeDamage: null,
    yearInMake: null,
    engine: null,
    chasis: null,
    makeBody: null,
    typeOfBody: null,
    cc: null,
    windScreen: null,
    eHailing:null,
    staffCode: null,      
    discount: null,
    splitRoadTaxPayment: null
  } 
  generateQuotation() {
    this.savePolicy();
  }
}
