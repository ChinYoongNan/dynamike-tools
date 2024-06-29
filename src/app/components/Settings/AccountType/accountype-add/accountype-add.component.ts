import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PageDetailComponent } from "../../../util/pageDetail/pageDetail.component";

@Component({
  selector: 'app-accountype-add',
  templateUrl: './accountype-add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class AccountTypeAddComponent implements OnInit {

  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private route: ActivatedRoute,
    public pageDetailComponent: PageDetailComponent,
    private router: Router,
  ) { 
  }
  
  pageHeader = {
    Title: "Add Account Type",
    SaveButton : {
      function : this.buttonEvent
    }
  }

  
  ngOnInit(): void {
    this.pageDetailComponent.pageDetailData = [
      {
        type: "input",
        label: "Name",
        control: true,
        value: undefined
      },
      {
        type: "input",
        label: "Invalid",
        control: false,
        value: undefined
      }
    ]
  }

  buttonEvent(){
    document.getElementById('saveButton').click();    
  }

  saveAccountType(){    
    this.pageDetailComponent.validate()
  }

  save(data:any = null){ 
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveAccountType(data)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Save successful!!!");            
            this.backAccountTypelisting();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }

  backAccountTypelisting() {
    this.router.navigate(['/Settings'])
  }
}
