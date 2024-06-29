import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";

import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"

@Component({
    selector: 'app-clientadding',
    templateUrl: './clientadding.component.html',
    styleUrls: ['../../../../styles/themes.component.scss']
  })

export class ClientAddingComponent implements OnInit {

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
  }
  pageHeader = {
    Title: "Add Client 加顾客",
    SaveButton : {
      function : this.buttonEvent
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

  clientForm: FormGroup;
  ngOnInit(): void {
    this.clientForm = this.formBuilder.group({
      client_name: ['', Validators.required],
      client_address: ['', Validators.required],
      client_contact: ['', Validators.required],
      // client_shippingAddress: ['', Validators.required]
    })
  }

  ngAfterContentInit() {
    
  }
  client_name:any;
  client_contact:any;
  client_address:any;
  client_shippingAddress:any;

  reset(){
      this.client_name=null;
      this.client_contact=null;
      this.client_address=null;
      this.client_shippingAddress=null;       
  }

  
  saveClient(){
    if(this.common.formValidation(this.clientForm)){
      return;
    }
      let client: any = {
        "name": this.client_name,
        "contactNo": this.client_contact,
        "billingAddress": this.client_address,
        "shippingAddress": this.client_shippingAddress
      } 
      
      let promise = new Promise((resolve, reject) => {
        this.dcrService.saveClient(client)
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

  next(): void {
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
}