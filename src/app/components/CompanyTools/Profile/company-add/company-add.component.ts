import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class CompanyAddComponent implements OnInit {

  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 
  }

  DetailForm: FormGroup;
  @Output() returnResult = new EventEmitter();
  pageHeader = {
    Title: "Add Company Detail",
    SaveButton : {
      function : this.buttonEvent
    }
  }

  ngOnInit(): void {
    this.init();
    
    this.DetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      registrationNo: ['', Validators.required],
      telephoneNo: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  Detail : any;
  detail_id:any;
  name : any;
  registrationNo : any;
  telephoneNo:any;
  address:any;
  nullvalue;
  buttonEvent(){
    document.getElementById('saveButton').click();
  }

  saveDetail()
  {  
    if (this.DetailForm.invalid) { 
      Object.values(this.DetailForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
  let compdetail: any = {
    "name": this.name,
    "registrationNo": this.registrationNo,
    "telephoneNo": this.telephoneNo,
    "address": this.address
  } 
  
  let promise = new Promise((resolve, reject) => {
    this.dcrService.saveDetail(compdetail)
      .toPromise()
      .then(
        res => { // Success
          this.common.createBasicMessage("Save successful!!!");            
          this.backdetailpage();
        },
        msg => { // Error
          this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
  });

}

DetailLoadSel: boolean = true;
init() {
  let promise_1 = new Promise((resolve, reject) => {
    this.dcrService.getDetail()
      .toPromise()
      .then(
        data => { // Success
          this.DetailLoadSel = false;
          this.Detail = data;
        },
        msg => { // Error
          this.common.createModalMessage(msg.error.error, msg.error.message).error()
        }
      );
  });
}

DetailChange(value){
  this.detail_id = this.Detail[value].id;
  this.name = this.Detail[value].name;
  this.registrationNo = this.Detail[value].registrationNo;
  this.telephoneNo = this.Detail[value].telephoneNo;
  this.address = this.Detail[value].address;
}

backdetailpage() {
  this.router.navigate(['/Detailpage'])
}







}
