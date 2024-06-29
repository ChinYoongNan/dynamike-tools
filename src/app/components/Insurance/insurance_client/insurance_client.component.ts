import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { DataService } from "../../../services/data.service";

import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading";


@Component({
  selector: 'app-insurance_client',
  templateUrl: './insurance_client.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class InsuranceClientComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { 
  }

  pageHeader = {
    Title: "Insurance Client/ 保险 客人",
    SaveButton : {
      function : this.buttonEvent
    },
    PreviousButton : {
      function : this.buttonEventss
    },
    NextButton : {
      function : this.buttonEvents
    }
  }
  buttonEvent(){
    document.getElementById('saveButton').click();
  }
  buttonEvents(){
    document.getElementById('nextButton').click();
  }
  buttonEventss(){
    document.getElementById('previousButton').click();
  }

  insuranceClientGroup: FormGroup;
  ngOnInit(): void {
    this.init();
    // this.insuranceClientGroup = this.formBuilder.group({
    //   insured_name: ['', Validators.required],
    //   plate_no: ['', Validators.required],
    //   ic: ['', Validators.required],
    //   address: ['', Validators.required],
    //   client_id: ['', Validators.required]
    // })
  }

  searchClient(event){
      this.dcrService.getClientsbyName(event.target.value, event.target.value).subscribe(data => {
        // this.ClientLoadSel = false;
        this.Client = data;
        document.getElementById("clients").blur();
        document.getElementById("clients").focus();
      }, error => {
        if (error.error.text != "No Results") {
          this.common.errStatus(error.status, error.error);
        }
      });
  }
  ngAfterContentInit() {
  }

  //upgrade Select data
  LoadSel: boolean = true;

  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"

  @HostListener('window:scroll', ['$event'])
  scrollTop: number = 0;
  onScroll(s) {
  }

  
    insured_id:any;
    company:any;
    insured_name:any;
    plate_no:any;
    ic:any;
    address:any;
    client_id:any;
    keyword:any;
    pdfpassword:any;


  saveInsuranceClient(){
    // if (this.insuranceClientGroup.invalid) {      
    //   Object.values(this.insuranceClientGroup.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    //   return;
    // }
    let client: any ={
      "id":this.client_id
    }
    let insurance_client: any = {
      "name": this.insured_name,
      "plateNo": this.plate_no,
      "ic": this.ic,
      "address": this.address,
      "client": client,
      "keyword": this.keyword,
      "pdfPassword": this.pdfpassword,
    }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveInsuranceClient(insurance_client)
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
  
  ClientLoadSel:boolean = false;
  Client:any;
  init() {
    // this.dcrService.getallClient().subscribe(data => {
    //   this.ClientLoadSel = false;
    //   this.Client = data;
    // }, error => {
    //   if (error.error.text != "No Results") {
    //     this.common.errStatus(error.status, error.error);
    //   }
    // });
  }
  reset(){
    this.insured_id=null;
    this.company=null;
    this.insured_name=null;
    this.plate_no=null;
    this.ic=null;
    this.address=null;
    this.client_id=null;
    this.keyword=null;
    this.pdfpassword=null;
  }
  goToAdd() {
    this.router.navigate(['/ClientAdding']);
  }
  pre(): void {
    this.changeContent(0);
  }

  next(): void {
    this.changeContent(2);
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
}
