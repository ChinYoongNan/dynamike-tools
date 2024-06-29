import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading";
import { Location } from '@angular/common';
import { AnySrvRecord } from 'dns';
import { Console } from 'console';

@Component({
  selector: 'app-insurance_policy',
  templateUrl: './insurance_policy.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class InsurancePolicyComponent implements OnInit {

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
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  pageHeader = {
    Title: "Insurance Policy",
    SaveButton : {
      function : this.buttonEvent
    },
    PreviousButton : {
      function : this.buttonEventss
    }
  }
  buttonEvent(){
    document.getElementById('saveButton').click();
  }
  buttonEventss(){
    document.getElementById('previousButton').click();
  }
  policyGroup: FormGroup;

  id: number;
  private sub: any;
  ngOnInit(): void {
    this.init();
    this.policyGroup = this.formBuilder.group({
      insuranceClient_index: ['', Validators.required],
      product_type: ['', Validators.required],
      policy_no: ['', Validators.required],
      insured_object: ['', Validators.required],
      insured_date: ['', Validators.required],
      renewal_date: ['', Validators.required],
      content_value: ['', Validators.required],
      company_index: ['', Validators.required],
      plan_covered: ['', Validators.required]
    })
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // +params['id']; (+) converts string 'id' to a number     
    }); 
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  ngAfterContentInit() {
    
  }

  getValue(data){    
    this.loadInsuranceClient(data.body.id);
    this.handleCancel();
  }
  calculator(e){
    this.stamp_duty = 10.0;
    if(this.gst == null && this.premium !=null){
      this.gst = parseFloat(this.premium) * 0.06;
    }
    if(this.commission != null){
      this.net_amount = parseFloat(this.premium) + parseFloat(this.gst) + parseFloat(this.stamp_duty) - parseFloat(this.commission);
    }else{
      this.net_amount = parseFloat(this.premium) + parseFloat(this.gst) + parseFloat(this.stamp_duty);
    }
    if(this.service_charges == null){
      this.service_charges = 0.0;
    }
    if(this.road_tax == null){
      this.road_tax = 0.0;
    }
    if(this.postage == null){
      this.postage = 0.0;
    }
    if(this.other == null){
      this.other = 0.0;
    }
    this.finalAmount = parseFloat(this.premium) + parseFloat(this.gst) + parseFloat(this.stamp_duty) + parseFloat(this.service_charges) + parseFloat(this.road_tax) + parseFloat(this.postage) + parseFloat(this.other);
  }
  dateChange(e){
    var renewal = new Date(this.insured_date)
    renewal.setFullYear(renewal.getFullYear() + 1);
    renewal.setDate(renewal.getDate() - 1);
    this.renewal_date = (moment(renewal)).format('YYYY-MM-DD');
    this.year = (moment(new Date())).format('YYYY');
    this.month = (moment(new Date())).format('MM');
  }
  InsuranceClient: any;
  InsuranceClientLoadSel = true;
  insuranceClient_index: any;
  loadInsuranceClient(selectedId){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getInsuranceClient()
        .toPromise()
        .then(
          data => { // Success
            this.InsuranceClient = data;
            this.InsuranceClientLoadSel = false;
            console.log(this.InsuranceClient);
            if(selectedId != null){
              var selected = this.InsuranceClient.filter(i => i.id == selectedId);
              this.insuranceClient_index = this.InsuranceClient.indexOf(selected[0]);
              this.InsuranceClientChange(this.insuranceClient_index);
            }
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }

  InsuranceClientChange(selectedId){
    // this.insurance_id = this.InsuranceClient[selectedId].id;
  }

    product_type:any;
    dateRange:any;
    company_index: any;
    insured_object: any;
    renewal_date: any;
    road_tax: any;
    postage: any;
    policy_no:any;
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
    content_value:any;
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
    wind_screen:any;
    e_hailing:any;
    insurance_id:any;
    finalAmount: any;

  savePolicy(){    
    if (this.policyGroup.invalid) {      
      Object.values(this.policyGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    let policy: any = {
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
      "insuranceId": this.insurance_id
    } 
    let promise = new Promise((resolve, reject) => {
      this.dcrService.savePolicy(policy)
        .toPromise()
        .then(
          data => { // Success
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }

  reset(){
    this.policy_no=null;
    this.insured_date=null;
    this.year=null;
    this.month=null;
    this.plan_covered=null;
    this.refer_no=null;
    this.premium=null;
    this.commission=null;
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
    this.wind_screen=null;
    this.e_hailing=null;
    this.insurance_id=null;
    this.product_type=null;
  }
  renews: 0;
  Policies: any;
  Companies: any;
  CompanyLoadSel: boolean = true;
  ProductTypeLoadSel:boolean = false;
  ProductTypes:any;
  PlanType:any;
  current: any;
  init() {
    this.current = 0;
    this.dcrService.getProvider().subscribe(data => {
      this.CompanyLoadSel = false;
      this.Companies = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    });
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
    this.dcrService.getProductTypes(4)
      .toPromise()
      .then(
        data => { // Success
          this.PlanType = data; 
        },
        msg => { // Error
          this.common.createModalMessage(msg.error.error, msg.error.message).error()
        }
      );
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getPolicy()
        .toPromise()
        .then(
          data => { // Success
            this.Policies = data;     
            for (var i = 0; i < this.Policies.length; i++) {
              if (this.Policies[i].id == this.id) {
                this.renewal_date = this.Policies[i].renewalDate;
                this.premium = this.Policies[i].premium;
                this.insured_object = this.Policies[i].insured_object;
                this.commission = this.Policies[i].commission;
                this.road_tax = this.Policies[i].roadTax;
                this.service_charges = this.Policies[i].serviceCharges;
                this.refer_no = this.Policies[i].referNo;
                this.net_amount = this.Policies[i].netAmount;
                this.finalAmount = this.Policies[i].finalAmount;
                for (var j = 0; j < this.Companies.length; j++) {
                  if (this.Companies[j].id == this.Policies[i].company) {
                    this.company_index = this.Companies[j].id;
                  }
                }
              }
            }
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    this.loadInsuranceClient(null);
    this.insured_date = new Date().toISOString().split("T")[0];
    this.dateChange(null);
  }
  isVisible: boolean = false;
  isModalVisible = false;
  addInsuranceClient(){
    this.isModalVisible = true;
  }
  handleCancel(){
    this.isModalVisible = false;
  }
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  pre(): void {
    this.changeContent(1);
  }

  changeContent(cur): void {
    switch (cur) {
      case 0: {
        this.router.navigate(['/ClientAdding', cur]);
        break;
      }
      case 1: {
        this.router.navigate(['/InsuranceClient', cur]);
        break;
      }
      case 2: {
        this.router.navigate(['/InsurancePolicy', cur]);
        break;
      }
      default: {
        this.router.navigate(['/InsuranceListing']);
      }
    }
  }
  insurancePolicyInfo:any;
  generateQuotation() {
    this.insurancePolicyInfo = {
      "policyNo":this.policy_no,
      "contentValue": this.content_value,
      "insuredDate": this.insured_date,
      "premium": this.premium,
      "commission": this.commission,
      "stampDuty": this.stamp_duty,
      "serviceCharges": this.service_charges,
      "roadtax": this.road_tax,
      "others": this.other,
      "windScreen": this.wind_screen,
      "eHailing": this.e_hailing,
    }
      
    this.dcrService.exportReceiptPDF(this.insurancePolicyInfo,'quotation',"Quotation")
  }
}
