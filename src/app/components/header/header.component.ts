import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
import { ProfileComponent } from '../../home/profile/profile.component';
import { AppComponent } from '../../app.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user = this.accountService.userValue;

  @ViewChild('div') div: ElementRef;
  get name() { return this.user.username }
  get isLogin() { return this.user != undefined && this.user != null }
  get isStaff() { return this.user != undefined && this.user != null && this.user.staff != undefined && this.user.staff != null }

  constructor(
    private appcomponent: AppComponent,   
    private renderer: Renderer2,
    private router:Router, 
    private accountService: AccountService) { }

  isDesktop = !this.appcomponent.mobile;
  ngOnInit(): void {
    this.isDesktop = !this.appcomponent.mobile;
    this.accountService.getCurrentUser().subscribe((session) => {
      this.user = session;
      this.changeConfig();      
    })
  }

  changeConfig(){
    if(this.user.staff_id!=null){
      this.panels = [
        {
          active: true,
          type: 'qrcode',
          tag: null,
          name: 'Virtiual Card'
        }
      ];
    } else {
      this.panels = [
        {
          active: true,
          type: 'qrcode',
          tag: null,
          name: 'Virtiual Card'
        },
        {
          active: false,
          type: null,
          tag : 'app-profile',
          name: 'PaySlip'
        }
      ];
    }
  }
  addElement(tag) {
    const p: ProfileComponent = this.renderer.createElement(tag);
    console.log(p);
    // p.innerHTML = 'add new';
    this.renderer.appendChild(this.div.nativeElement, p);
  }
  menubar() {
    this.appcomponent.isCollapsed = !this.appcomponent.isCollapsed;
  }
  
  logout() {
    // this.user = null;
    this.accountService.logout();
    this.close();
    this.accountService.getCurrentUser().subscribe((session) => {
      this.user = session
    })
  }

  logIn() {
    // this.accountService.login();    
    this.router.navigate(['/Login'], { queryParams: { returnUrl: this.router.url }});
    this.accountService.getCurrentUser().subscribe((session) => {
      this.user = session
      this.changeConfig();
    })
    // document.getElementById('main').style.display = "none";
    // document.getElementById('login').style.display = "";
  }

  

  panels = [
    {
      active: true,
      type: 'qrcode',
      tag: null,
      name: 'Virtiual Card'
    },
    {
      active: false,
      type: null,
      tag : 'app-profile',
      name: 'PaySlip'
    }
  ];

  visible = false;

  get title(): string {
    return `<i nz-icon nzType="user"></i>`+`Profile`;
  }

  showDefault(): void {
    this.open();
  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  home(): void {
    this.router.navigate(["/"]);
  }

}
