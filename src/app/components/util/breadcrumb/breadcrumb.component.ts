import {Component, OnInit,Output, EventEmitter} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'pageTitle';
  readonly home = {icon: 'pi pi-home', url: 'home'};
  menuItems: any[];
  pageHeader: any;

  @Output() initPage = new EventEmitter();
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('BreadcrumbComponent');
    
    this.menuItems = this.createBreadcrumbs(this.activatedRoute.root); 
    console.log(this.router.events)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menuItems = this.createBreadcrumbs(this.activatedRoute.root); 
        console.log(this.menuItems)
      });
  }

  init(){
    this.initPage.emit();
  }
  

  private createBreadcrumbs(route: ActivatedRoute, url: string = '#', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
      if (!isNullOrUndefined(label)) {
        breadcrumbs.push({label, url});
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

}
