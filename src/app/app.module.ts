import { NgModule } from '@angular/core';

// import {
//   MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule, MatFormFieldModule,
//   MatInputModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatTooltipModule
// } from '@angular/material';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';

import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTING } from "./app.routing";

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
// import { ClarityModule } from "@clr/angular";

import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import en from '@angular/common/locales/en';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './components/footer/footer.component';
import { TabnavComponent } from './components/Inventory/Product/tabnav/tabnav.component';
import { SummaryReportComponent } from './components/summaryreport/summaryreport.component';
import { GLMainComponent } from './components/Purchases/gl_main/gl_main.component';
import { PurchaseListComponent } from './components/Purchases/purchaselisting/purchaselisting.component';
import { PurchaseAddComponent } from './components/Purchases/purchase_add/purchase_add.component';
import { PurchaseComponent } from './components/Purchases/purchase/purchase.component';
import { ProductListingComponent } from './components/Inventory/Product/productlisting/productlisting.component';
import { ProductListComponent } from './components/Inventory/Product/product_list/product_list.component';
import { FoodMenuComponent } from './components/Inventory/Product/food_menu/food_menu.component';
import { OptionGroupMenuComponent } from './components/Inventory/Product/option_group_menu/option_group_menu.component';
import { OrderMenuComponent } from './components/Inventory/Product/order_menu/order_menu.component';
import { FoodMenuCategoryComponent } from './components/Inventory/Product/food_menu_category/food_menu_category.component';
import { FoodRecipeComponent } from './components/Inventory/Product/food_recipe/food_recipe.component';
import { ProductComponent } from './components/Inventory/Product/product/product.component';
import { MenuComponent } from './components/menu/menu.component';
import { CashierDialogComponent } from './components/dialog/cashier/cashier_dialog.component';
import { EshopAddComponent } from './components/CompanyTools/eshop_add/eshop_add.component';
import { ShopAddComponent } from './components/Transaction/shop_add/shop_add.component';
import { PosOrderComponent } from './components/Transaction/pos_order/pos_order.component';
import { KitchenDashboardComponent } from './components/Transaction/kitchen_dashboard/kitchen_dashboard.component';
import { ProductCatalogueComponent } from './components/Inventory/Product/product_catalogue/product_catalogue.component';
import { ProductPriceComponent } from './components/Settings/productpricelisting/productpricelisting.component';
import { EshopImportComponent } from './components/CompanyTools/eshop_import/eshop_import.component';
import { EshopListingComponent } from './components/CompanyTools/eshoplisting/eshoplisting.component';
import { ClientListingComponent } from './components/User/Client/clientlisting/clientlisting.component';
import { ClientAddingComponent } from './components/User/Client/clientadding/clientadding.component';
import { SupplierListingComponent } from './components/User/Supplier/supplierlisting/supplierlisting.component';
import { ProductTypeAddComponent } from './components/Settings/ProductType/producttype-add/producttype-add.component';
import { InsuranceListingComponent } from './components/Insurance/insurancelisting/insurancelisting.component';
import { PolicyListingComponent } from './components/Insurance/policylisting/policylisting.component';
import { ProductTypeListingComponent } from './components/Settings/ProductType/producttypelisting/producttypelisting.component';
import { InvoiceTypeListingComponent } from './components/Settings/InvoiceType/invoicetypelisting/invoicetypelisting.component';
import { AccountTypeListingComponent } from './components/Settings/AccountType/accountypelisting/accountypelisting.component'
import { PaySlipRecordComponent } from './components/CompanyTools/payslip_record/payslip_record.component';
import { AttendanceRecordComponent } from './components/CompanyTools/attendance_record/attendance_record.component';
import { VoucherListingComponent } from './components/CompanyTools/voucher/voucher.component';
import { POrderListComponent } from './components/Inventory/Stocks/porder_list/porder_list.component';
import { POrderListingComponent } from './components/Inventory/Stocks/porderlisting/porderlisting.component';
import { StockTickComponent } from './components/Inventory/Stocks/stock_tick/stock_tick.component';
import { RestaurantStockTickComponent } from './components/Inventory/Stocks/restaurant_stock_tick/restaurant_stock_tick.component';
import { StockCheckComponent } from './components/Inventory/Stocks/stock_check/stock_check.component';
import { IncomeStatementComponent } from './components/Accounting/pl/pl.component';
import { BalanceSheetComponent } from './components/Accounting/bs/bs.component';
import { CashFlowComponent } from './components/Accounting/cashflow/cashflow.component';
import { ExpiredListComponent } from './components/Inventory/Product/expired_listing/expired_listing.component';
import { ExpiredItemListComponent } from './components/Inventory/Product/expired_item_listing/expired_item_listing.component';
import { GoodsPriceListComponent } from './components/Inventory/Product/goods_price_listing/goods_price_listing.component';
import { StockCheckListComponent } from './components/Inventory/Stocks/stock_check_listing/stock_check.component';
import { InvoiceAddComponent } from './components/Transaction/invoice_add/invoice_add.component';
import { CashsalesAddComponent } from './components/Transaction/cashsales_add/cashsales_add.component';
import { PaySlipComponent } from './components/payslip/payslip.component';
import { SupplierAddComponent } from './components/User/Supplier/supplier-add/supplier-add.component';
import { InvoiceTypeAddComponent } from './components/Settings/InvoiceType/invoicetype-add/invoicetype-add.component';
import { AccountTypeAddComponent } from './components/Settings/AccountType/accountype-add/accountype-add.component';
import { ProductSearchEngineComponent } from './components/util/product_search_engine/product_search_engine';
import { LoginComponent } from './components/login/login.component';
import { InsuranceAddComponent } from './components/Insurance/insurance_add/insurance_add.component';
import { InsuranceClientComponent } from './components/Insurance/insurance_client/insurance_client.component';
import { InsurancePolicyComponent } from './components/Insurance/insurance_policy/insurance_policy.component';
import { ProviderAddComponent } from './components/Settings/Provider/provider_add/provider_add.component';
import { ProviderListComponent } from './components/Settings/Provider/provider_list/provider_list.component';
import { ProductListSelectionComponent } from './components/util/product_list_selection/product_list_selection';
import { ProductPriceListComponent } from './components/util/product_price_list/product_price_list';
import { UserMainComponent } from './components/User/user_main/user_main.component';
import { SettingsMainComponent } from './components/Settings/settings_main/settings_main.component';
import { ProductDialogComponent } from './components/Inventory/Product/product_dialog/product_dialog.component'


import { NgxLoadingModule } from 'ngx-loading';

import { DcrService } from "./services/dcr.service"
import { AuthInterceptor } from "./services/auth.interceptor";
// import { PdfViewerModule } from 'ng2-pdf-viewer';

import {BreadcrumbComponent} from './components/util/breadcrumb/breadcrumb.component';
import {PageHeaderComponent} from './components/util/pageHeader/pageHeader.component';
import {PageDetailComponent} from './components/util/pageDetail/pageDetail.component';
import { TableComponent } from './components/util/table/table.component';
import { CardComponent } from './components/util/card/card.component';
import { VerticalTabComponent } from './components/util/vertical_tabs/vertical_tabs.component';
import { VerticalCardComponent } from './components/util/vertical_card/vertical_card.component';
import { VerticalListComponent } from './components/util/vertical_list/vertical_list.component';
import { GroupCardComponent } from './components/util/group_card/group_card.component';
import { CarouselComponent } from './components/util/carousel/carousel.component';

import { SalesComponent } from './components/Transaction/Sales/sales.component';
import { CompanyComponent } from './components/CompanyTools/Profile/company/company.component';
import { CompanyAddComponent } from './components/CompanyTools/Profile/company-add/company-add.component';
import { VirtualCardComponent } from './components/virtual_card/virtual_card.component';

import { QRCodeModule } from 'angularx-qrcode';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';


import { ProfileComponent } from './home/profile/profile.component';

import {LandingComponent} from './home/landing/landing.component';
import { VoucherComponent } from './components/util/voucher/voucher.component';

/**
 * Shared Component
 */
import {OutletComponent} from './components/Shared/outlet/outlet.component';
import {ProviderComponent} from './components/Shared/provider/provider.component';
import {OptionGroupAddComponent} from './components/Settings/ProductOptionGroup/optiongroup-add/optiongroup-add.component'
import {OptionGroupListingComponent} from './components/Settings/ProductOptionGroup/optiongrouplisting/optiongrouplisting.component'

registerLocaleData(en);

// import { AuthModule } from './auth/auth.module';
// import { CoreModule } from './core/core.module';
// import { SharedModule } from './shared/shared.module';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TabnavComponent,
    PurchaseListComponent,
    MenuComponent,
    LoginComponent,
    SummaryReportComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    ProductListingComponent,
    ProductListComponent,
    ProductComponent,
    EshopAddComponent,
    ShopAddComponent,
    PosOrderComponent,
    KitchenDashboardComponent,
    EshopImportComponent,
    EshopListingComponent,
    PurchaseAddComponent,
    PurchaseComponent,
    SupplierListingComponent,
    InsuranceListingComponent,
    ClientListingComponent,
    ClientAddingComponent,
    ProductTypeListingComponent,
    InvoiceTypeListingComponent,
    AccountTypeListingComponent,
    PaySlipRecordComponent,
    AttendanceRecordComponent,
    POrderListComponent,
    POrderListingComponent,
    StockTickComponent,
    RestaurantStockTickComponent,
    StockCheckComponent,
    CashFlowComponent,
    ExpiredListComponent,
    GoodsPriceListComponent,
    StockCheckListComponent,
    InvoiceAddComponent,
    CashsalesAddComponent,
    ProductCatalogueComponent,
    ProductSearchEngineComponent,
    ProductPriceComponent,
    InsuranceAddComponent,
    InsuranceClientComponent,
    PaySlipComponent,
    SupplierAddComponent,
    InvoiceTypeAddComponent,
    AccountTypeAddComponent,
    InsurancePolicyComponent,
    PolicyListingComponent,
    ProviderAddComponent,
    ProviderListComponent,
    TableComponent,
    CarouselComponent,
    VerticalCardComponent,
    VerticalListComponent,
    VerticalTabComponent,
    VoucherComponent,
    GroupCardComponent,
    CardComponent,
    BreadcrumbComponent,
    ProfileComponent,
    PageHeaderComponent,
    PageDetailComponent,
    SalesComponent,
    ProductListSelectionComponent,
    ProductPriceListComponent,
    ProductTypeAddComponent,
    CompanyComponent,
    CompanyAddComponent,
    VirtualCardComponent,
    LandingComponent,
    ExpiredItemListComponent,
    GLMainComponent,
    UserMainComponent,
    VoucherListingComponent,
    FoodMenuComponent,
    OptionGroupMenuComponent,
    OrderMenuComponent,
    FoodMenuCategoryComponent,
    FoodRecipeComponent,
    SettingsMainComponent,
    CashierDialogComponent,
    ProductDialogComponent,
    OutletComponent,
    ProviderComponent,
    OptionGroupAddComponent,
    OptionGroupListingComponent
  ],
  imports: [
    BrowserModule,
    ROUTING,
    FormsModule,
    QRCodeModule,
    NgxBarcodeModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DemoNgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // PdfViewerModule,

    MatListModule, MatIconModule,
    MatRadioModule,
    MatSidenavModule,
    MatRadioModule,
    MatStepperModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatDialogModule,
    MatListModule,
    // MatButtonModule,
    // MatChipsModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    // MatProgressSpinnerModule,
    // MatExpansionModule,
    // MatTooltipModule,
    // MatCardModule,

    NgxLoadingModule.forRoot({}),
    // AuthModule,
    // CoreModule,
    // SharedModule,
  ],
  providers   : [ 
    {
    provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    {
    provide: MatDialogRef,
      useValue: {}
    },
    { provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons },
    DcrService,
    FontAwesomeModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
