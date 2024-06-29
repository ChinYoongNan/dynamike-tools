import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PageDetailComponent } from "../../../util/pageDetail/pageDetail.component";

@Component({
  selector: 'app-invoicetype-add',
  templateUrl: './invoicetype-add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class InvoiceTypeAddComponent implements OnInit {

  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private route: ActivatedRoute,
    public pageDetailComponent: PageDetailComponent,
    private router: Router,
  ) { 
  }
  
  pageHeader = {
    Title: "Add Invoice Type",
    SaveButton : {
      function : this.buttonEvent
    }
  }

  
  ngOnInit(): void {
    this.pageDetailComponent.pageDetailData = [
      {
        type: "input",
        label: "Description",
        control: true,
        value: undefined
      },
      {
        type: "input",
        label: "Operator",
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

  saveInvoiceType(){    
    this.pageDetailComponent.validate()
  }

  save(data:any = null){ 
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveInvoiceType(data)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Save successful!!!");            
            this.backInvoiceTypelisting();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }

  backInvoiceTypelisting() {
    this.router.navigate(['/Settings'])
  }
}
