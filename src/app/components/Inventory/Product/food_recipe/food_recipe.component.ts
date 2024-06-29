import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { DataService } from "../../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading";
import { Location } from '@angular/common';
import { AnyRecordWithTtl, AnySrvRecord } from 'dns';
import { Console } from 'console';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../../../models/Product';

import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-food_recipe',
  templateUrl: './food_recipe.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class FoodRecipeComponent implements OnInit {

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
    private cdr: ChangeDetectorRef, 
    private formBuilder: FormBuilder,
    private dataService:DataService,
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  @Output() closeDrawer = new EventEmitter();
  @Input() receipeId: any ;
  private sub: any;
  pageHeader = {
    Title: "Product 货品",
    SaveButton : {
      function : this.buttonEvent
    }
  }
  buttonEvent(){
    document.getElementById('saveButton').click();
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.sub){
      this.sub.unsubscribe();
    }
  }  
  productForm: FormGroup;
  pageMode ='Detail';
  priceList : Subject<any> = new Subject<any>();
  productCategory = 1;
  getSeletedData(data){
    this.Product.items = data;
  }
  ngOnChanges(){
    this.reset();
    this.ngOnInit();
  }
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      unit_cost: ['', Validators.required],
      selling_price: ['', Validators.required],
      supplier_index: ['', Validators.required]
    })
    if(this.router.url.indexOf('ProductAdd')>0){
      this.pageMode ='Add';
    }
    this.sub = this.route.params.subscribe(params => {
      if(this.receipeId){
        this.Product.id = +this.receipeId; // +params['id']; (+) converts string 'id' to a number
        this.productCategory = 4
        if(this.productCategory){                
          let obj = this.dataService.loadTypeCategory(this.productCategory);
          obj.then(
            data => { // Success
              this.pageHeader.Title = data['description'];            
              this.cdr.detectChanges();
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
          this.loadProduct();
        }else{
          this.productCategory = 1;
        }
      }
    }); 
    this.init();  
  }
  async loadGoolgeDrivePicture(code:any=null){
    var selected = this.ProductTypes.filter(i => i.id == parseInt(this.Product.type));
    console.log(selected);
    var value = this.ProductTypes.indexOf(selected[0]);
    if(this.productCategory != 4){
      this.ProductImage = await this.dataService.loadProductImageList(this.ProductTypes[value].prefix+'0');
    } else {
      this.ProductImage = await this.dataService.loadProductImageList(this.ProductTypes[value].prefix);
    }
  }
  ngAfterContentInit() { 
   
  }

  async productTypeChange(e){
    if(e == null || this.pageMode == 'Detail'){
      return;
    }
    let data = await this.dataService.getProductCodeSeq(this.Product.type);
    if(data){
      this.Product.code = data['seq'];      
      this.loadGoolgeDrivePicture();
    }
  }
  isVisible: boolean = false;
  NoResultId = "No Data"
  
  
  
  isImageSaved: boolean;
  cardImageBase64: string;
  imageFile : File;
  imageError: string;

  removeImage() {
      this.cardImageBase64 = null;
      this.isImageSaved = false;
  }

  setImage(){
    console.log('setImage');
    let imageUrl = '';
    if(this.cardImageBase64!=null && this.cardImageBase64!=undefined){
      imageUrl = this.cardImageBase64.replace("https://drive.google.com/file/d/",'')
      imageUrl = imageUrl.replace("/view?usp=sharing","")
      imageUrl = imageUrl.replace("https://drive.google.com/open?id=",'')
      imageUrl = imageUrl.replace("&authuser=dynamike.trading%40gmail.com&usp=drive_fs",'')
    }
    if(imageUrl != ''){        
      this.cardImageBase64 = imageUrl      
      this.cardImageBase64 = this.common.formatImage(this.cardImageBase64);
      this.isImageSaved = true;
    }
    this.Product.image_url = imageUrl;
  }
  Product: Product = new Product();

  Items : any;
  ProductTypes  : any;
  ProductImage : any;
  Suppliers : any;
  saveProduct(){
    if(this.productCategory == 1){
      if(this.common.formValidation(this.productForm)){
        return;
      }
    }
    this.isVisible = true;
    this.Product.images=this.imageFile;
    this.Product.item.productId = this.Product.code;
    this.Product.items.forEach(item => item.productId = this.Product.code);
    let product = this.Product;
    let data = this.dataService.saveproduct(this.Product,this.pageMode,this.productCategory);
    data.toPromise()
    .then(
      res => { // Success
        this.common.createBasicMessage("save successful!!!");
        this.isVisible = false;
        this.reset();
        this.close();
      },
      msg => { // Error
        this.isVisible = false;
        this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
  }
  
  setPrice(e){
    this.Product.unitCost = parseFloat(this.Product.unitCost).toFixed(2);
    this.Product.item.price_50= this.Product.unitCost * 1.5;
    this.Product.item.price_45= this.Product.unitCost * 1.45;
    this.Product.item.price_40= this.Product.unitCost * 1.4;
    this.Product.item.price_35= this.Product.unitCost * 1.35;
    this.Product.item.price_30= this.Product.unitCost * 1.3;
    this.Product.item.price_25= this.Product.unitCost * 1.25;
    this.Product.item.price_20= this.Product.unitCost * 1.2;
    this.Product.item.price_15= this.Product.unitCost * 1.15;
    this.Product.item.price_10= this.Product.unitCost * 1.1;
    this.Product.item.sellingPrice = (this.Product.unitCost * 1.5).toFixed(2);
  }

  init() {
    this.fetchData();
  }
  private async fetchData(){
    this.ProductTypes = await this.dataService.loadProductType(this.productCategory);
    this.Items = await this.dataService.loadProducts(this.productCategory);
    if(this.Items){
      if(!this.Product.id!=null){
        this.loadProduct();        
      } 
    }    
    this.Suppliers = await this.dataService.loadSuppliers();
  }

  ItemChange(value) {
    this.loadProduct();  
  }
  selectedItem:any;

  async loadProduct(){
    if(!this.Product.id){
      return;
    }
    let data = await this.dataService.loadProductById(this.Product.id)
    if(data){
      // var selected = this.Items.filter(i => i.id == this.Product.id);
      this.selectedItem = data;
      this.Product = this.selectedItem[0]
      if(this.Product.image_url){
        this.isImageSaved =true;
        this.cardImageBase64 = this.common.formatImage(this.Product.image_url);
      }
      // this.loadGoolgeDrivePicture();  
      this.common.notifyChild(this.priceList,this.Product.items);
    }
  }

  reset(){    
    this.isImageSaved =false;
    this.cardImageBase64 = null;
    this.imageFile = null;
    this.Product = new Product();
  }
  close(): void {    
    this.closeDrawer.emit(false);
  }

}
