import { Injectable } from '@angular/core';

import { AngularCsv } from 'angular-csv-files/Angular-csv';
import { nodeName } from 'jquery';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { title } from 'process';
import { Location } from '@angular/common';


import { DcrService } from "./dcr.service";
import { CommonService } from './common.service';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private dcrService: DcrService, private common: CommonService) { }
  loadInvoiceType(category){    
    if(category == 1){
      return this.loadPOInvoiceType();
    }else if (category == 99){
      return this.dcrService.getValidInvoiceType().toPromise()
    }else{
      return this.loadOthersInvoiceType();
    }
  }
  loadAllTypeCategory(){    
    return this.dcrService.getallTypeCategory().toPromise()
  }
  loadTypeCategory(type){   
    return this.dcrService.getTypeCategory(type).toPromise()
  }
  loadPriceType(){   
    return this.dcrService.getPriceType().toPromise()
  }
  loadPOInvoiceType(){
    return  this.dcrService.getInvoiceType([1,2,4,6])
        .toPromise()
  }
  loadOthersInvoiceType(){
    return  this.dcrService.getOthersInvoiceType([1,2,4,6])
        .toPromise()
  }
  loadOutlets(){
    return this.dcrService.loadOutlets().toPromise()
  }
  loadSuppliers(){
    return this.dcrService.getSuppliers().toPromise()
  }
  getOptionGroup(id){
    return this.dcrService.getOptionGroup(id).toPromise()
  }
  loadActiveOptionGroups(){
    return this.dcrService.getValidOptionGroups().toPromise()
  }
  loadAccountYears(){
    return this.dcrService.getAccountYear().toPromise();
  }
  loadPurchase(year,month,invoiceType,search){
    return this.dcrService.getPurchases(year,month,invoiceType,search).toPromise();
  }
  loadPurchaseByCategorySize(year,month,category,search,page,size){
    return this.dcrService.getPurchasesByCategory(year,month,category,search,page,size).toPromise();
  }
  loadPurchaseBySize(year,month,invoiceType,supplier,search,page,size){
    return this.dcrService.getPurchases(year,month,invoiceType,search,supplier,page,size).toPromise();
  }
  loadAllPosOrder(){
    return this.dcrService.getAllPosOrder().toPromise();
  }
  loadGeneralLedger(year,month,invoiceType,page,size){
    return this.dcrService.getAccountList(year,month,invoiceType,page,size).toPromise();
  }
  loadFullAccount(year,month,invoiceType,status,search,page,size){
      return this.dcrService.getFullAccountList(search,year,month,status,page,size).toPromise();
  }
  loadPurchaseById(selectedId){
    try {
      return this.dcrService.getPurchaseById(selectedId).toPromise();
    } catch (error) {
        // this.handleError(error);
    }
  }
  loadPOOrder(date,supplier,page,size){
    return this.dcrService.searchPOrderList(date,supplier,page,size).toPromise();
  }
  loadVoucher(){
    return this.dcrService.loadAllVoucher().toPromise();
  }
  getAllVoucher(page,size){
    return this.dcrService.getAllVoucher(page,size).toPromise();
  }
  getAllAttendance(page,size,staffId){
    return this.dcrService.getAllAttendance(page,size,staffId).toPromise();
  }
  /**
   * 
   * @param Generate Profit & Loss Statement
   * @returns 
   */
  getSalesPerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("sales",year,month).toPromise();
  }
  getCogsPerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("cogs",year,month).toPromise();
  }
  getExpenditurePerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("exp",year,month).toPromise();
  }
  /**
   * 
   * @param Generate Finaicial Position 
   * @returns 
   */  
  getNCAPerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("nca",year,month).toPromise();
  }
  getCAPerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("ca",year,month).toPromise();
  }
  getLBPerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("lb",year,month).toPromise();
  }
  getETPerYear(year, month:any = 0){
    return this.dcrService.getPLBSReport("et",year,month).toPromise();
  }
  // getallActiveStaffs
  calculateHourlyWagesPerMonth(staffId){
    return this.dcrService.calculateHourlyWagesPerMonth(staffId).toPromise();
  }  
  getAllPaySlip(page,size,staffId){
    return this.dcrService.getAllPaySlip(page,size,staffId).toPromise();
  }
  loadAllProductType(type){
    try {
      return this.dcrService.getAllProductTypes(type).toPromise()
    } catch (error) {
        // this.handleError(error);
    }
  }
  loadValidProductType(type){
    try {
      return this.dcrService.getValidProductTypes(type).toPromise()
    } catch (error) {
        // this.handleError(error);
    }
  }
  loadProductType(type){
    try {
      return this.dcrService.getProductTypes(type).toPromise()
    } catch (error) {
        // this.handleError(error);
    }
  }
  revokeGoogleDriveToken(){
    return this.dcrService.revokeGoogleDriveToken().toPromise();
  }
  loadProductImageList(code){
    return this.dcrService.getProductImageList(code).toPromise()
  }
  loadClients(){
    return this.dcrService.getClients().toPromise();
  }
  getPOListing(page,size){
    return this.dcrService.getPOListing(page,size).toPromise();
  }
  loadClientByPage(page,size){
    return this.dcrService.getPaginationClients(page,size).toPromise();
  }
  searchClient(name,contactno){
    return this.dcrService.getClientsbyName(name, contactno)
    .toPromise();;
  }
  searchSupplier(name){
    return this.dcrService.getSuppliersbyName(name)
    .toPromise();;
  }
  loadPaginationProductByType(type,priceType:any="SellingPrice"){
    return this.dcrService.getProductbyType(type,null,null,priceType).toPromise();
  }
  loadPaginationStockProductByType(type,priceType:any="SellingPrice"){
    return this.dcrService.getStockProductbyType(type,null,null,priceType).toPromise();
  }
  loadProducts(category:any = null){
    return this.dcrService.getProducts(category).toPromise();
  }
  loadProductById(id){
    return this.dcrService.getProductbyId(id).toPromise();
  }
  getAllProductbyType(type){
    return this.dcrService.getAllProductbyType(type).toPromise();
  }
  getValidProductByType(type,page,size,priceType:any="SellingPrice"){
    return this.dcrService.getValidProductbyType(type,page,size,priceType).toPromise();
  }
  getProductByType(type,page,size,priceType:any="SellingPrice"){
    return this.dcrService.getProductbyType(type,page,size,priceType).toPromise();
  }
  getStockProductByType(type,page,size,priceType:any="SellingPrice"){
    return this.dcrService.getStockProductbyType(type,page,size,priceType).toPromise();
  }
  getSalesByDates(type,startdate,enddate,page,size){
    return this.dcrService.getSales(type,startdate,enddate,page,size).toPromise();
  }
  getSalesFinalTotalAmount(type,startdate,enddate,page,size){
    return this.dcrService.getSalesFinalTotalAmount(type,startdate,enddate,page,size).toPromise();
  }
  
  loadPolicy(page,size,searchValue:any=null){
    return this.dcrService.loadpolicy(page,size,searchValue).toPromise();
  }
  loadPolicyById(id){
    return this.dcrService.getPolicybyId(id).toPromise();
  }

  loadPolicyType(){
    return this.dcrService.getProductTypes(3).toPromise();
  }

  getBankAccountAmount(){
    return this.dcrService.getBankAccountAmount().toPromise();
  }
  getProductCodeSeq(type){
    return this.dcrService.getProductCodeSeq(type).toPromise();
  }
  saveProductPrice(info){
    return this.dcrService.saveProductPrice(info)
  }
  saveproduct(product, pageMode, category){
    if(pageMode == 'Detail'){
      return this.dcrService.quickUpload(category,product)
    
    }else{
      return this.dcrService.addProduct(category,product,null,false)
    }
  }
  async savePurchase(purchaseOrderForm,Purchase, oldpurchaseItemList, pageMode, location:Location){
    console.log('savePurchase')
    if(this.common.formValidation(purchaseOrderForm)){      
      return
    }
    let purchase = Purchase;
    purchase.totalAmount = parseFloat(purchase.totalAmount).toFixed(2);
    let supplier = Purchase.supplier;
    if(purchase.type.id){
      switch (purchase.type.id)
      { 
        case 1:case 2:case 4:case 3:{
          purchase.supplier = supplier;
          let promise = new Promise((resolve, reject) => {
            if(pageMode == "Add"){
              this.dcrService.savePurchase(purchase,purchase.purchaseItemList)
                .toPromise()
                .then(
                  res => { // Success
                    this.common.createBasicMessage("save successful!!!");
                    location.go(location.path())
                    return true;
                  },
                  msg => { // Error
                    this.common.createModalMessage(msg.error.error, msg.error.message).error()
                    return true;
                  }
                );
            }else{
              this.dcrService.updatePurchase(purchase,purchase.purchaseItemList,oldpurchaseItemList)
                .toPromise()
                .then(
                  res => { // Success
                    this.common.createBasicMessage("save successful!!!");
                    location.go(location.path())
                    return true;
                  },
                  msg => { // Error
                    this.common.createModalMessage(msg.error.error, msg.error.message).error()
                    return true;
                  }
                );
            }
            
          });
          break;
        }
        default:{
          let promise = new Promise((resolve, reject) => {
            this.dcrService.saveAccount(purchase)
              .toPromise()
              .then(
                res => { // Success
                  this.common.createBasicMessage("save successful!!!");
                  location.go(location.path())
                  return true;
                },
                msg => { // Error
                  this.common.createModalMessage(msg.error.error, msg.error.message).error()
                  return true;
                  }
                );
          });
        }        
      }
    }
  }
}


