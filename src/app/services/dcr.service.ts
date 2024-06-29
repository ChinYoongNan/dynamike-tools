import { throwError as observableThrowError, from as observableFrom, of as observableOf, combineLatest as observableCombineLatest, forkJoin as observableForkJoin, Observable } from 'rxjs';

import { catchError, map, mergeMap, tap, delay, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentsService } from "./environment.service";
import { HttpRequest, HttpEvent } from '@angular/common/http';
import 'rxjs/Rx'

// util

import * as _ from 'lodash';

declare var device_download_plugins; 
declare var isbrowser;
@Injectable()
export class DcrService {

  baseUrl: string;

  constructor(

    private http: HttpClient,
    private environmentsService: EnvironmentsService) {
    // this.baseUrl = window.location.hostname.indexOf('localhost')>-1?'/apidata':`${this.environmentsService.config.simServiceUrl}`;
    this.baseUrl = `${this.environmentsService.config.simServiceUrl}`;
    // this.baseUrl = `${this.environmentsService.config.agentUrl}`;

  }

  // header = { "headers": { "X-Auth-Key": "N31mVcQkL?Q]GSe[Tve0Wl8b[i2_vU:ClohDvU7Ex;GCu4=hxa=q>3B<aMEZRwmT"} };
  header = { "headers": { "X-Auth-Key": "N31mVcQkL?Q]GSe[Tve0Wl8b[i2_vU:ClohDvU7Ex;GCu4=hxa=q>3B<aMEZRwmT"}, "set-cookie" :"samesite=none" };
 
  public saveTransaction(params,listdata): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('list_data', JSON.stringify(listdata));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/transaction`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public updatePurchaseItem(listdata,old_list_data): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('list_data', JSON.stringify(listdata));
    formData.append('old_list_data', JSON.stringify(old_list_data));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/purchaseItems`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public updateTransactionItem(listdata,old_list_data): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('list_data', JSON.stringify(listdata));
    formData.append('old_list_data', JSON.stringify(old_list_data));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/transactionItems`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public updateTransaction(params,listdata,old_list_data): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('list_data', JSON.stringify(listdata));
    formData.append('old_list_data', JSON.stringify(old_list_data));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/transaction`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deletePurchase(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/purchase/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  
  public updateTotalByReceiptNo(total,receiptNo): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('total', JSON.stringify(total));
    formData.append('receiptNo', JSON.stringify(receiptNo));
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/adjustTotalAmount`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
    
  }

  public cancelOrderItem(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/cancelOrderItem/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteSupplier(id): Observable<HttpEvent<any>> {
    console.log(id);
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('id', JSON.stringify(id));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/suppliers/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteDetail(id): Observable<HttpEvent<any>> {
    console.log(id);
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('id', JSON.stringify(id));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/details/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }


  public deleteSales(id): Observable<HttpEvent<any>> {
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('id', JSON.stringify(id));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/sales/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public loadIntoLedger(id): Observable<HttpEvent<any>> {
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('id', JSON.stringify(id));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
      console.log('loadIntoLeger')
    const req = new HttpRequest('POST', `${url}/loadIntoLedger/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteAccountType(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    //const formData: FormData = new FormData();
    //formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/accounttypes/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteInvoiceType(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    //const formData: FormData = new FormData();
    //formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/invoicetypes/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteOptionGroup(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/optiongroup/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public deleteProductType(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/producttypes/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteProduct(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    //const formData: FormData = new FormData();
    //formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/products/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deletePolicy(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    //const formData: FormData = new FormData();
    //formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/policy/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteProvider(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    //const formData: FormData = new FormData();
    //formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/providers/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteTransaction(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/transaction/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteInsuranceClient(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    //const formData: FormData = new FormData();
    //formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/insuranceclients/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteClient(id): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/client/${id}`, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public saveAccount(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // formData.append('list_data', JSON.stringify(listdata));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/account`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public paidPurchase(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/paidpurchase`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public paidPurchaseByMode(params,paymentMode,paidamount): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('paymentMode', paymentMode);
    if(paidamount){
      formData.append('paidamount', paidamount);
    }
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/paidpurchase`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public unpaidPurchase(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/unpaidpurchase`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public splitExpired(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // formData.append('list_data', JSON.stringify(listdata));
    // formData.append('old_list_data', JSON.stringify(oldList));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/splitExpired`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public updateExpired(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // formData.append('list_data', JSON.stringify(listdata));
    // formData.append('old_list_data', JSON.stringify(oldList));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/updateExpired`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public updatePurchase(params,listdata,oldList): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('list_data', JSON.stringify(listdata));
    formData.append('old_list_data', JSON.stringify(oldList));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/purchase`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public savePurchase(params,listdata): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('list_data', JSON.stringify(listdata));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/purchase`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  
  public getExpiredItemDate(year,month){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/stockcheckdate?`;
    if(month){
        url +=`month=${month}&year=${year}`;
    }else{
      url +=`year=${year}`;
    }
    
    return this.http.get(url, header);
    
  }
  public getStockCheckDate(year,month){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/stockcheckdate?`;
    if(month){
        url +=`month=${month}&year=${year}`;
    }else{
      url +=`year=${year}`;
    }
    
    return this.http.get(url, header);
    
  }

  public getStockCheckListing(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // header = { "headers": {
    //   'Content-Type': 'application/json'
    //   }};
    const req = new HttpRequest('GET', `${url}/stockchecklist?date=${params}`,header);

    return this.http.request(req);
  }
  public getPOrderListing(params,page,size): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/porderlist?date=${params}`;
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    const req = new HttpRequest('GET', `${url}`,header);

    return this.http.request(req);
  }
  
  public runCheckStock(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // header = { "headers": {
    //   'Content-Type': 'application/json'
    //   }};
    const req = new HttpRequest('GET', `${url}/runcheckStock?date=${params}`,header);

    return this.http.request(req);
  }

  public stockCheck(params): Observable<HttpEvent<any>> {
    var header = {};
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/stockcheck`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deleteStockCheck(params): Observable<HttpEvent<any>> {
    var header = {};
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/stockcheck`, formData,  {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public searchPOrderList(date,supplier,page,size): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/porder?date=${date}&supplier=${supplier}`;
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    const req = new HttpRequest('GET', `${url}`,header);
    return this.http.request(req);
  }

  public createPOrderList(params): Observable<HttpEvent<any>> {
    var header = {};
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/porderlist`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public deletePOrderList(params): Observable<HttpEvent<any>> {
    var header = {};
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('DELETE', `${url}/porderlist`, formData,  {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public saveStaff(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/staff`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public saveSales(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // formData.append('list_data', JSON.stringify(list_data));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/sales`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public quickSaveInsuranceClient(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/quickAddinsuranceClient`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public saveClient(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/client`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public saveInsuranceClient(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/insuranceclient`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public saveProvider(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/providers`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public saveSupplier(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/supplier`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public clockInOut(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/clockInOut`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public saveDetail(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/detail`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public getInsuranceClient(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/insuranceclients`, header);
  }
  public savePolicy(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/policy`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public generatePolicy(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    console.log(params);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/policy/generate`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public getPolicybyId(code){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(code){
      return this.http.get(url + `/getpolicy?id=${code}`, header);
    }    
  }

  public quickUploadProductStock(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/quickUpdateStockCheck`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public quickUpdateOtherProduct(params,update=true): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('update', JSON.stringify(update));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/quickUpdateOtherProduct`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public quickUpload(category,params,update=true): Observable<HttpEvent<any>> {
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    formData.append('update', JSON.stringify(update));
    formData.append('category', category);
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('PUT', `${url}/quickUpdateProduct`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public uploadLazadaTransaction(file: File): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/lazadaTransaction`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public uploadLazada(file: File): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/lazada`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public patchShopeeOrderWithTrx(file: File): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/patchShopeeOrderWithTrx`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public uploadShopee(file: File): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/shopee`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public uploadVMTransaction(file: File): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/vmTransaction`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  // to be delete
  public uploadOtherProduct(params,file: File,update=true): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('group_data', JSON.stringify(params));
    formData.append('update', JSON.stringify(update));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/otherProducts`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  
  public changeProductCode(productId, newCode, oldCode){
  // public changeProductCode(oldCode, newCode){
   
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('id', productId);
    formData.append('oldCode', oldCode);
    formData.append('newCode', newCode);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/changeProductCode`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public addProduct(category,params,file: File,update=true): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('group_data', JSON.stringify(params));
    formData.append('update', JSON.stringify(update));
    formData.append('category', category);
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/products`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public getClient(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/clients`, header);
  }
  
  public getallActiveStaffs(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allactivestaffs`, header);
  }

  public getallStaffs(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allstaffs`, header);
  }

  public getallClient(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allclients`, header);
  }

  public getSummaryMonthlyReport(year){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/summaryMonthlyreport?years=${year}`, header);
  }
  public getMonthlyReport(year){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/monthlyreport?years=${year}`, header);
  }
  // public getGLReport(year){
  //   var header = {};
  //   var url = `${this.environmentsService.config.posServiceUrl}`;
  //   return this.http.get(url + `/glreport?years=${year}`, header);
  // }
  public getCashFlowReport(year){
    console.log(year);
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/cashflowReport?years=${year}`, header);
  }
  public getCapitalReport(year){
    console.log(year);
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/capitalReport?years=${year}`, header);
  }
  public searchPOrder(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/porderbyid?id=${id}`;
    return this.http.get(url, header);

  }
  public getPOListing(page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/porderlisting`;
    if(page){
      url+= `?page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  public getPaginationClients(page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/clients`;
    if(page){
      url+= `?page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  public getClients(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allclients`, header);
  }
  public loadOutlets(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/outlets`, header);
  }
  public loadSupplier(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/suppliers`, header);
  }
  public getSupplier(page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}` + `/supplier?`;
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }

  public getDetail(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/details`, header);
  }

  public getSales(type,startdate,enddate,page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/sales?type=${type}&start_date=${startdate}&end_date=${enddate}`;    
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  
  public getBankAccountAmount(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/bankAmount`; 
    return this.http.get(url, header);
  }
  public getSalesFinalTotalAmount(type,startdate,enddate,page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/salesfinaltotalamount?type=${type}&start_date=${startdate}&end_date=${enddate}`;    
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }

  
  
  public loadpolicy(page,size,searchValue:any=null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/loadpolicy?`;
    if(page){
      url+= `page=${page}&size=${size}`;
      if(searchValue){
        url+= `&search=${searchValue}`;
      }
    }else{
      if(searchValue){
        url+= `search=${searchValue}`;
      }
    }
    return this.http.get(url, header);
  }
  public getPolicy(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/policy`, header);
  }
  public getTransactionYear(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/transactionYears`, header);
  }
  public getAccountYear(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/accountYears`, header);
  }
  public getExpenditureReport(year){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/expenditureReport?years=${year}`, header);
  }
  public getProvider(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/providers`, header);
  }

  public getInsuranceClientsbyName(name, contact){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(name){
      return this.http.get(url + `/insuranceclientsbyname?name=${name}&contact=${contact}`, header);
    }
  }

  public getClientsbyName(name, contact){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(name){
      return this.http.get(url + `/clientbyname?name=${name}&contact=${contact}`, header);
    }
  }

  public getProductbyCode(code, cashier:boolean =false, priceType:any="SellingPrice"){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(code){
      if(cashier){
        return this.http.get(url + `/productByCode?id=${code}&cashier=true&priceType=${priceType}`, header);

      }else{
        return this.http.get(url + `/productByCode?id=${code}&priceType=${priceType}`, header);
      }
    }    
  }

  public getProductbyId(code, priceType:any="SellingPrice"){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(code){
      return this.http.get(url + `/productById?id=${code}&priceType=${priceType}`, header);
    }    
  }

  public getallTypeCategory(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`; 
    url += `/alltypeCategory`
    return this.http.get(url, header);  
  }

  public getTypeCategory(type:any=null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;  
    return this.http.get(url + `/typeCategory?type=${type}`, header);  
  }

  public getPriceType(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;    
    return this.http.get(url + `/pricetypes`, header);  
  }

  public getOrderByTableNo(tableNo){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(tableNo){
      return this.http.get(url + `/activeposorder?tableNo=${tableNo}`, header);
    }    
  }

  public getPaidOrderByTableNo(tableNo){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(tableNo){
      return this.http.get(url + `/posorder?tableNo=${tableNo}`, header);
    }    
  }

  public getProductbySupplier(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(id){
      return this.http.get(url + `/productBySupplier?id=${id}`, header);
    }else{
      return this.http.get(url + `/productBySupplier`, header);
    } 
  }
  public getAllOtherProduct(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/otherproducts`;
    return this.http.get(url, header);
  }
  public getProductByCategory(type){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/productByCategory?category=${type}`;
    return this.http.get(url, header);
  }
  public getAllProductbyType(type){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/allproductByType?type=${type}`;
    return this.http.get(url, header);
  }
  public getStockProductbyType(type,page,size,priceType){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/stockProductByType?type=${type}&priceType=${priceType}`;
    if(size){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  public getValidProductbyType(type,page,size,priceType){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/validProductByType?type=${type}&priceType=${priceType}`;
    if(size){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  public getProductbyType(type,page,size,priceType){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}/productByType?type=${type}&priceType=${priceType}`;
    if(size){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  // to be delete
  public getInventory(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/inventory`, header);
  }
  public getProducts(category:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(category ==null){
      return this.http.get(url + `/products`, header);
    }
    return this.http.get(url + `/products?category=${category}`, header);
  }
  public getProduct(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/productitems`, header);
  }
  public getPaymentByOrderId(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/paymentbyid?id=${id}`, header);
  }
  public getOrderItems(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/orderItems?id=${id}`, header);
  }  
  public getPurchaseById(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/purchasebyid?id=${id}`, header);
  }
  public getPurchaseItems(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/purchaseItems?id=${id}`, header);
  }
  
  public getAllInvoiceType(params){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allinvoicetypes`, header);
  }
  public getOthersInvoiceType(params){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/otherinvoicetypes?types=${params}`, header);
  }
  
  public getPLBSReport(params, year, month:any =0){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/yearlycategoryreport?type=${params}&years=${year}&month=${month}`, header);
  }
  public getInvoiceTypeByCategory(params){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/invoicetypeByCategory?category=${params}`, header);
  }
  public getInvoiceType(params){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/invoicetypes?types=${params}`, header);
  }

  public getValidInvoiceType(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allvalidinvoicetypes`, header);
  }

  public getAccountTypes(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allaccounttypes`, header);
  }

  public getInvoiceTypes(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/allinvoicetypes`, header);
  }
  public loadAllVoucher(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/voucher`; 
    return this.http.get(url, header);
  }
  public getAllVoucher(page, size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/vouchers`;  
    if(size){
      url+= `?page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }
  public getAllAttendance(page, size, staffId){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/attendance`;  
    if(size){
      url+= `?page=${page}&size=${size}`;
    }
    if(staffId){
      url+= `&code=${staffId}`;
    }
    return this.http.get(url, header);
  }
  public calculateCommissionPerMonth(staffId){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/calCommission`;  
    if(staffId){
      url+= `?code=${staffId}`;
    }
    return this.http.get(url, header);
  }

  public calculateHourlyWagesPerMonth(staffId){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/calHoursWages`;  
    if(staffId){
      url+= `?code=${staffId}`;
    }
    return this.http.get(url, header);
  }

  public getAllPaySlip(page, size, staffId){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`+ `/payslip`;  
    if(size){
      url+= `?page=${page}&size=${size}`;
    }
    if(staffId){
      url+= `&code=${staffId}`;
    }
    return this.http.get(url, header);
  }

  public getSuppliers(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/suppliers`, header);
  }
  public getSuppliersbyName(name){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(name){
      return this.http.get(url + `/supplierbyname?name=${name}`, header);
    }
  }
  
  public getAllProductTypes(type:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(type != null){
      let param = "";
      for(let i = 0; i < type.length; i++){
        param += `type=${type[i]}&`;
      }
      param = param.substring(0,param.length - 1);
      
      return this.http.get(url + `/allproducttypes?${param}`, header);
    } else{      
      return this.http.get(url + `/allproducttypes`, header);
    }
  }
  public getValidProductTypes(type:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    console.log('getValidProductTypes')
    if(type != null){
      let param = "";
      for(let i = 0; i < type.length; i++){
        param += `type=${type[i]}&`;
      }
      param = param.substring(0,param.length - 1);
      // return this.http.get(url + `/validproducttypes?type=${type}`, header);
      
      return this.http.get(url + `/validproducttypes?${param}`, header);
    } else{      
      return this.http.get(url + `/validproducttypes`, header);
    }
  }

  public getProductTypes(type:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(type != null){
      return this.http.get(url + `/producttypes?type=${type}`, header);
    } else{      
      return this.http.get(url + `/producttypes`, header);
    }
  }

  public getOptionGroups(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;   
    return this.http.get(url + `/optiongroups`, header);
  }
  public getOptionGroup(id){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;   
    return this.http.get(url + `/optiongroupbyid?id=${id}`, header);
  }
  public getValidOptionGroups(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;   
    return this.http.get(url + `/validoptiongroups`, header);
  }
  

  public revokeGoogleDriveToken(code:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/accessgoogleDrive`, header);
  }  
  public getProductImageList(code:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    if(code){
      return this.http.get(url + `/goolgeDrivePictureList?code=${code}`, header);
    }else{      
      return this.http.get(url + `/goolgeDrivePictureList`, header);
    }
  }  
  public uploadProductPicture(filename:any, file: File): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('filename',filename);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/goolgeDrivePicture`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public getProductCodeSeq(id:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/productSeqByType?type=${id}`, header);
  }
  
  public saveAccountType(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/accounttypes`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public saveInvoiceType(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/invoicetypes`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public saveOptionGroup(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/optiongroup`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  
  public saveProductType(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/producttypes`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public getPaginationPayment(year,month,type,page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/payment?`;
    if(type){
      if(month){
        url +=`month=${month}&year=${year}&type=${type}`;
      }else{
        url +=`year=${year}&type=${type}`;
      }
    }else{
      if(month){
        url +=`month=${month}&year=${year}`;
      }else{
        url +=`year=${year}`;
      }
    }
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }

  public paymentsByMonth(year,month){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/paymentsByMonth?`;
    url +=`month=${month}&year=${year}`;
    
    return this.http.get(url, header);
  }

  public getPaymentByDate(date){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/paymentsByDate?`;
    url +=`date=${date}`;
    
    return this.http.get(url, header);
  }

  public getPayment(year,month,type){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/payment?`;
    if(type){
      if(month){
        url +=`month=${month}&year=${year}&type=${type}`;
      }else{
        url +=`year=${year}&type=${type}`;
      }
    }else{
      if(month){
        url +=`month=${month}&year=${year}`;
      }else{
        url +=`year=${year}`;
      }
    }
    
    return this.http.get(url, header);
  }

  public getCashFlowList(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/cashflow?`;
    
    return this.http.get(url, header);
  }
  
  public getFullAccountList(search,year,month,status,page,size){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/fullaccount?`;
    // if(month){   
    //   if(status  == undefined){
    //     url +=`month=${month}&year=${year}`;
    //   }else{        
    //   }
    // }else{ 
          
    //   if(status  == undefined){
    //     url +=`year=${year}`;
    //   }else{        
    //     url +=`year=${year}&status=${status}`;
    //   }     
    // }
    url +=`month=${month}&year=${year}&status=${status}`;
    
    url += `&search=${search}`;
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    
    return this.http.get(url, header);
  }
  
  public getAllPosOrder(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/allposorder`;
    
    return this.http.get(url, header);
  }
  public getAccountList(year,month,type:any=null,page:any =1,size:any=10){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/account?`;
    if(month){
      if(type){
        url +=`month=${month}&year=${year}&type=${type}`;
      }else{        
        url +=`month=${month}&year=${year}`;
      }
    }else{
      if(type){
        url +=`year=${year}&type=${type}&status=${status}`;
      }else{        
        url +=`year=${year}&status=${status}`;
      }
    }
    
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    
    return this.http.get(url, header);
  }

  

  public getExpiredListing(year,month,page:any = null, size:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/expiredList?`;
    if(year && month){
      url +=`month=${month}&year=${year}`;
    }
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    
    return this.http.get(url, header);
  }

  public checkedExpiredItemList(params): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    // const formData: FormData = new FormData();
    // formData.append('file', file);
    // formData.append('group_data', JSON.stringify(params));
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    console.log(params);
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/expiredList/checked`, params, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public getExpiredListingByPage(year,month,page:any = null, size:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/expiredListbyPage?`;
    if(year && month){
      url +=`month=${month}&year=${year}`;
    }
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    
    return this.http.get(url, header);
  }

  public getExpiredCheck(code,page:any = null, size:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/expiredCheck?`;
    if(code){
      url +=`code=${code}`;
    }
    if(page){
      url+= `&page=${page}&size=${size}`;
    }
    
    return this.http.get(url, header);
  }

  public getPurchasesByCategory(year,month,category,search,page:any = null,size:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/purchase/category?`;
    // if(month){
    //   if(type){
    //     url +=`month=${month}&year=${year}&type=${type}`;
    //   }else{
    //     url +=`month=${month}&year=${year}`;
    //   }
    // }else{
    //   url +=`year=${year}`;
    // }
    url +=`month=${month}&year=${year}&type=${category}`;
    url += `&search=${search}`;
    if(page!=null){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }

  public getPurchases(year,month,type,search,supplier:any=null,page:any = null,size:any = null){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/purchase?`;
    // if(month){
    //   if(type){
    //     url +=`month=${month}&year=${year}&type=${type}`;
    //   }else{
    //     url +=`month=${month}&year=${year}`;
    //   }
    // }else{
    //   url +=`year=${year}`;
    // }
    url +=`month=${month}&year=${year}&type=${type}`;
    url += `&search=${search}`;
    if(supplier!=null){
      url += `&supplier=${supplier}`;
    }
    if(page!=null){
      url+= `&page=${page}&size=${size}`;
    }
    return this.http.get(url, header);
  }

  public getReceiptNo(){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    url+=`/receiptNo?`;    
    return this.http.get(url, header);
  }
  public getTotal(info){
    
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const req = new HttpRequest('POST', `${url}/receipt/total`, info, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);  
  }
  
  public savePaySlip(pdfInfo: any): Observable<HttpEvent<any>> {
    
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/save/payslip`, pdfInfo, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }

  public downloadFile(data: any, suffix, filename: any) {
    let parsedResponse = data;
    let blob = new Blob([parsedResponse], { type: `application/${suffix}` });
    if(!isbrowser()){
      device_download_plugins(filename+"."+suffix, blob, blob.type); // for android
    }else{
      let url = window.URL.createObjectURL(blob);
      // if (navigator.msSaveOrOpenBlob) {
      //   navigator.msSaveBlob(blob, `${filename}.${suffix}`);
      // } else {
        let a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${suffix}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      // }
      window.URL.revokeObjectURL(url);

    }
  }

  public upgradeVersion(){
    // device_download_plugins(filename+"."+suffix, blob, blob.type); // for android
  }
  
  public getPDFReportBySelectedId(filename, selectedId:any) {
    // private getPDFReport(pdfInfo: any) : Observable<HttpEvent<any>> {
      
        var header = {};
        var url = `${this.environmentsService.config.posServiceUrl}`;
        
        // header = { "headers": {
        //   'Content-Type': 'application/json'
        //   }};
        if(filename == 'receipt' || filename == 'posorder' || filename == 'posreceipt'){
          url = `${url}/${filename}/pdf/${selectedId}`
        }else{
          url = `${url}/${filename}/pdf/`;
        }
        const req = new HttpRequest('POST', `${url}`, null, {
            reportProgress: true,
            responseType: 'blob'
          });
    
      return this.http.request(req);  
      // var header = {};
      // var url = `${this.environmentsService.config.posServiceUrl}`;
      // this.name = pdfInfo.type;
      // return this.http.post(`${url}/cashsales/pdf`, pdfInfo, { responseType: 'blob'});
    }
  public getPDFReport(pdfInfo: any,filename,prefix:any=null,print:any = false) {
  // private getPDFReport(pdfInfo: any) : Observable<HttpEvent<any>> {
    
      var header = {};
      var url = `${this.environmentsService.config.posServiceUrl}`;
      
      // header = { "headers": {
      //   'Content-Type': 'application/json'
      //   }};
      if(filename == 'receipt' || filename == 'posorder' || filename == 'posreceipt'){
        url = `${url}/${filename}/pdf/${prefix}/${print}`
      }else{
        url = `${url}/${filename}/pdf/`;
      }
      const req = new HttpRequest('POST', `${url}`, pdfInfo, {
          reportProgress: true,
          responseType: 'blob'
        });
  
    return this.http.request(req);  
    // var header = {};
    // var url = `${this.environmentsService.config.posServiceUrl}`;
    // this.name = pdfInfo.type;
    // return this.http.post(`${url}/cashsales/pdf`, pdfInfo, { responseType: 'blob'});
  }
  public exportPDF(info,fileName) {
    let promise = new Promise((resolve, reject) => {
      this.getPDFReport(info,fileName)
        .toPromise()
        .then(
          res => { // Success
            console.log(res);
            
            this.downloadFile(res['body'], 'pdf',fileName)
          },
          msg => { // Error
            // this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }
  public print(filename) {
    // private getPDFReport(pdfInfo: any) : Observable<HttpEvent<any>> {
      
        var header = {};
        var url = `${this.environmentsService.config.posServiceUrl}`;
        
        // header = { "headers": {
        //   'Content-Type': 'application/json'
        //   }};
        const req = new HttpRequest('POST', `${url}/print/${filename}`, {
            reportProgress: true,
            responseType: 'blob'
          });
    
      return this.http.request(req);  
      // var header = {};
      // var url = `${this.environmentsService.config.posServiceUrl}`;
      // this.name = pdfInfo.type;
      // return this.http.post(`${url}/cashsales/pdf`, pdfInfo, { responseType: 'blob'});
    }

    public splitItem(id) {        
        var header = {};
        var url = `${this.environmentsService.config.posServiceUrl}`;
        
        url = `${url}/splitOrderItem?id=${id}` ;
        const req = new HttpRequest('POST', `${url}`, {
            reportProgress: true,
            responseType: 'blob'
          });
    
      return this.http.request(req);  
    }

    
    public handledOrder(id) {        
      var header = {};
      var url = `${this.environmentsService.config.posServiceUrl}`;
      console.log('handled id:'+ id)
      // url = `${url}/handleOrderItem?id=${id}` ;
      const req = new HttpRequest('POST', `${url}`, {
          reportProgress: true,
          responseType: 'blob'
        });
  
    return this.http.request(req);  
  }

    public handledItem(id) {        
        var header = {};
        var url = `${this.environmentsService.config.posServiceUrl}`;
        
        url = `${url}/handleOrderItem?id=${id}` ;
        const req = new HttpRequest('POST', `${url}`, {
            reportProgress: true,
            responseType: 'blob'
          });
    
      return this.http.request(req);  
    }

    public serverPrint(info,fileName, prefix,print,printPrevious:any=false) {
      let promise = new Promise((resolve, reject) => {
        this.getPDFReport(info,fileName,prefix,printPrevious)
          .toPromise()
          .then(
            res => { // Success              
              // this.downloadFile(res['body'], 'pdf',fileName)
              //browser to print directly with using Java to print
              console.log('serverPrint'+print);
              if(print){
                let parsedResponse = res['body'];
                let blob = new Blob([parsedResponse], { type: `application/pdf` });
                let iframe =  document.createElement('iframe'); //load content in an iframe to print later
               
                document.body.appendChild(iframe);
                let url = window.URL.createObjectURL(blob);
                iframe.width = '1000';
                iframe.style.display = 'none';
                iframe.src = url;
                iframe.style.margin = '0';
                iframe.onload = function() {
                  setTimeout(function() {
                    iframe.focus();
                    iframe.contentWindow.print();
                  }, 1);
                };
              }
            },
            msg => { // Error
              // this.common.createModalMessage(msg.error.error, msg.error.message).error()
              }
            );
      });
    }
    public serverPrintBySelectedId(fileName, selectedId) {
      let promise = new Promise((resolve, reject) => {
        this.getPDFReportBySelectedId(fileName,selectedId)
          .toPromise()
          .then(
            res => { // Success              
              // this.downloadFile(res['body'], 'pdf',fileName)
              //browser to print directly with using Java to print
              console.log('serverPrint'+print);
              if(print){
                let parsedResponse = res['body'];
                let blob = new Blob([parsedResponse], { type: `application/pdf` });
                let iframe =  document.createElement('iframe'); //load content in an iframe to print later
               
                document.body.appendChild(iframe);
                let url = window.URL.createObjectURL(blob);
                iframe.width = '1000';
                iframe.style.display = 'none';
                iframe.src = url;
                iframe.style.margin = '0';
                iframe.onload = function() {
                  setTimeout(function() {
                    iframe.focus();
                    iframe.contentWindow.print();
                  }, 1);
                };
              }
            },
            msg => { // Error
              // this.common.createModalMessage(msg.error.error, msg.error.message).error()
              }
            );
      });
    }
  public printReceipt(fileName){
    let promise = new Promise((resolve, reject) => {
      this.print(fileName)
        .toPromise()
        .then(
          res => { // Success
            console.log(res);
          },
          msg => { // Error
            // this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
  public exportReceiptPDF(info,fileName,downloadName) {
    let promise = new Promise((resolve, reject) => {
      this.getPDFReport(info,fileName)
        .toPromise()
        .then(
          res => { // Success
            console.log(res);
            
            this.downloadFile(res['body'], 'pdf',downloadName)
          },
          msg => { // Error
            // this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }
  public loadSalesRecord(receiptNO){
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    return this.http.get(url + `/loadSale/${receiptNO}`, header);
  }

  
  public saveProductPrice(params): Observable<HttpEvent<any>> {
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('group_data', JSON.stringify(params));
    // formData.append('update', JSON.stringify(update));
    // formData.append('category', category);
    // const req = new HttpRequest('POST', `${this.baseUrl}/products`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
    const req = new HttpRequest('POST', `${url}/product/price`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
  public addProductPrice(info,type): Observable<HttpEvent<any>> {

    var header = {};
      var url = `${this.environmentsService.config.posServiceUrl}`;
      const req = new HttpRequest('POST', `${url}/product/${type}/price`, info, {
          reportProgress: true,
          responseType: 'json'
        });
  
    return this.http.request(req);  
  }

  public setProductPrice(info,priceType) {
    let promise = new Promise((resolve, reject) => {
      this.addProductPrice(info,priceType)
        .toPromise()
        .then(
          res => { // Success
            console.log(res);
          },
          msg => { // Error
            // this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }
  public userAuthentication(id,password):Observable<HttpEvent<any>>{
    var header = {};
    var url = `${this.environmentsService.config.posServiceUrl}`;
    const formData: FormData = new FormData();
    formData.append('id', JSON.stringify(id));
    formData.append('password', JSON.stringify(password));
    
    header = { "headers": {
      'Content-Type': 'application/json'
      }};
      console.log(id)
      console.log(password)
    const req = new HttpRequest('POST', `${url}/login`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);
  }
}