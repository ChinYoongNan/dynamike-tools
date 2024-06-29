import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Product } from '../../../../models/Product';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';



//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { DataService } from "../../../../services/data.service";
@Component({
             selector: 'product_dialog',
             templateUrl: './product_dialog.component.html',
           })
export class ProductDialogComponent implements OnInit {

  public message:string;

  constructor(public dialogRef: MatDialogRef<ProductDialogComponent>,
              private dataService:DataService,
              private common: CommonService,
              private cdr: ChangeDetectorRef, 
              @Inject(MAT_DIALOG_DATA) public data: string) {
                this.message = data;
  }

  Product: Product = new Product();
  productCategory = 1;
  selectedItem:any;
  priceList: any;
  PriceTypes: any;
  ngOnInit() {    
    if(this.data){
      // console.log(this.data)
      // this.productCategory = this.data.category;
      this.Product.id = this.data['id']; // +params['id']; (+) converts string 'id' to a number
      // this.productCategory = +params['type']
      if(this.productCategory){      
        let obj = this.dataService.loadTypeCategory(this.productCategory);
        this.loadProduct();
      }else{
        this.productCategory = 1;
      }
    }
  }

  async loadProduct(){
    this.PriceTypes = await this.dataService.loadPriceType();
    // console.log(this.PriceTypes)
    if(!this.Product.id){
      return;
    }
    let data = await this.dataService.loadProductById(this.Product.id)
    if(data && this.PriceTypes){
      this.selectedItem = data;
      this.Product = this.selectedItem[0]
      // console.log(this.Product)
      this.priceList = this.Product.items;
      for(let i = 0; i< this.PriceTypes.length ; i++){
        console.log(this.PriceTypes[i].description)
        let price = this.priceList.filter(e=> e.priceType == this.PriceTypes[i].description)
        if(price.length <=0){
          let priceObj = Object.assign({}, this.priceList[0])
          priceObj.id = null;
          priceObj.priceType = this.PriceTypes[i].description;
          priceObj.productId = this.Product.code;
          priceObj.sellingPrice = 0.00;
          this.priceList.push(priceObj)
        }
      }
      console.log(this.priceList)
      this.cdr.detectChanges();
    }
  }

  save(input){
    console.log(input)
    // this.isAgree = value;
    let data = this.dataService.saveProductPrice(input);
    data.toPromise()
    .then(
      res => { // Success
        this.common.createBasicMessage("save successful!!!");
        // this.isVisible = false;
        // this.reset()
      },
      msg => { // Error
        // this.isVisible = false;
        this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
    // this.dialogRef.close(returnData);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
