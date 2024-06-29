import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';
import { PageHeaderSection } from '../../../models/PageHeaderSection';

@Component({
  selector: 'app-page-header',
  templateUrl: './pageHeader.component.html',
  styleUrls: ['./pageHeader.component.scss']
})
export class PageHeaderComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'pageTitle';
  pageHeader: any;
  @Input() HeaderItems: PageHeaderSection ;
  @Output() initPage = new EventEmitter();
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.pageHeader = this.createPageHeader(this.activatedRoute.root);
    });
  }

  ngOnInit(): void {  
  }

  init(){
    this.initPage.emit();
  }

  private createPageHeader(route: ActivatedRoute, url: string = '#',pageHeader: any = null): any {
    
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return pageHeader;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data[PageHeaderComponent.ROUTE_DATA_BREADCRUMB];
      
      if (!isNullOrUndefined(label)) {
        pageHeader = {'Title':label}
      }

      return this.createPageHeader(child, url, pageHeader);
    }
  }
}
