import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvironmentsService } from '../../services/environment.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from "../../services/common.service";
import { DcrService } from "../../services/dcr.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { mergeMap } from 'rxjs/operators';
import { param } from 'jquery';
import { throwError } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { first } from 'rxjs/operators';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../styles/themes.component.scss']
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isModalVisible = true;
  REDIRECT_URI = '/login/authenticate';
  url: string

  constructor(private route: ActivatedRoute, private router: Router, private _env: EnvironmentsService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private _auth: AuthService, private _loc: Location, private common: CommonService, private dcrService:DcrService) { }

    username:any;
    password:any;
    @ViewChildren('input') vc;
  
    
   ngAfterViewInit() {            
      document.getElementById("loginusername").focus();
      window.scrollTo(0, 0);
        // this.vc.first.nativeElement.focus();
    }
  ngOnInit() {    
    this.getReturnUrl();
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '**';
    // this.route.queryParams.pipe(
    //   mergeMap((params: any) => {
    //     const code = params['code'];
    //     const state = this.getState(params);
    //     if (!state) {
    //       return throwError("Wrong state...");
    //     }
    //     this.url = state.url;
    //     let redirectUri = window.location.origin + this._loc.prepareExternalUrl(this.REDIRECT_URI);
    //     console.log(`redirectUrl: ${redirectUri}, authClientId: ${this._env.config.authClientId}`)
    //     return this._auth.authenticase(code, this._env.config.authClientId, redirectUri);
    //   })
    // ).subscribe(
    //   (response: any) => {
    //     this._auth.saveCurrentSession(response);
    //     this.router.navigateByUrl(this.url);
    //   },
    //   (error) => {
    //     console.log(error);
    //     this._auth.redirectToLogin('/')
    //   }
    // )
  }

  

  getReturnUrl(){
    console.log('getReturnUrl');
    var obj = this.accountService.getUser();
    if(obj){
      switch(obj.role.name){
        // case "Admin":{
        //   this.returnUrl = "/ProductListing/1"
        //   this.router.navigate([this.returnUrl]);
        //   break;
        // }
        default:{
          this.returnUrl ="/"
          this.router.navigate([this.returnUrl]);
        }
      }
    }
  }

  private getState(params) {
    const state = params['state'];
    if (state) {
      try {
        const decoded = JSON.parse(atob(state));
        if (decoded.client_id === this._env.config.authClientId) {
          return decoded;
        }
      } catch (e) { }
    }
  }
  form: FormGroup;
  returnUrl: string;
  submitted = false;
  loading = false;
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  Login(){
    this.submitted = true;
    if (this.form.invalid) {      
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.loading = true;
    this.accountService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
          data => {
            // this.router.navigate([this.getReturnUrl()]);
            this.getReturnUrl();
          },
          error => {
            this.loading = false;
              this.reset();
            this.common.createModalMessage("Login Unsuccessful", "Please try again").error()
          });
  
  }
  reset(){
    this.username=null;
    this.password=null;
  }


}
