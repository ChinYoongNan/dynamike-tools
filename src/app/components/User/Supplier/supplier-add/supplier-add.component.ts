import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PageDetailComponent } from "../../../util/pageDetail/pageDetail.component";

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class SupplierAddComponent implements OnInit {

  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    public pageDetailComponent: PageDetailComponent,
  ) { 
  }
  
  pageHeader = {
    Title: "Add Supplier 加供应商",
    SaveButton : {
      function : this.buttonEvent
    }
  }
  id: number;
  private sub: any;


  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
  pageMode ='Detail';
  ngOnInit(): void {
    if(this.router.url.indexOf('ProductAdd')>0){
      this.pageMode ='Add';
    }
    
    this.init();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // +params['id']; (+) converts string 'id' to a number
      if(!isNaN(this.id)){
        this.loadSupplier(this.id);
      }
    }); 
    this.pageDetailComponent.pageDetailData = [
      {
        type: "input",
        label: "name",
        column: 'supplier_name',
        control: true,
        value: undefined
      },
      {
        type: "input",
        label: "companyId",
        column: 'ssm',
        control: true,
        value: undefined
      }
    ]
  }

  Suppliers : any;
  Items : any;
  ssm : any;
  supplier_index :any;
  supplier_id:any;
  supplier_name:any;
  nullvalue;
  buttonEvent(){
    document.getElementById('saveButton').click();
  }
  saveSupplier(){  
    // let supplier: any = {
    //   "contactNo": this.nullvalue,
    //   "address": this.nullvalue,
    //   "email": this.nullvalue,
    //   "website": this.nullvalue,
    //   "name": this.supplier_name,
    //   "companyId": this.ssm
    // } 
    this.pageDetailComponent.validate()
  }

  save(data:any = null){ 
    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveSupplier(data)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Save successful!!!");            
            this.backsupplierlisting();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }

  SupplierLoadSel: boolean = true;
  ProductLoadSel: boolean = true;
  init() {
    let promise_1 = new Promise((resolve, reject) => {
      this.dcrService.getSuppliers()
        .toPromise()
        .then(
          data => { // Success
            this.SupplierLoadSel = false;
            this.Suppliers = data;
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }

  // SupplierChange(value){
  //   this.supplier_id = this.Suppliers[value].id;
  //   this.ssm = this.Suppliers[value].companyId;
  //   this.supplier_name = this.Suppliers[value].name;

  //   // let promise = new Promise((resolve, reject) => {
  //   //   this.dcrService.getProductbySupplier(this.supplier_id)
  //   //     .toPromise()
  //   //     .then(
  //   //       data => { // Success
  //   //         this.ProductLoadSel = false;
  //   //         this.Items = data;
  //   //       },
  //   //       msg => { // Error
  //   //         this.common.createModalMessage(msg.error.error, msg.error.message).error()
  //   //       }
  //   //     );
  //   // });
  // }

  backsupplierlisting() {
    this.router.navigate(['/SupplierListing'])
  }
  loadSupplier(id) {
    let d = new Date();
    this.dcrService.getPurchaseById(id).subscribe(data => {
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
    
  }

}
