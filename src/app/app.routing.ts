import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './components/Inventory/Product/product/product.component';
import { ProductListingComponent } from './components/Inventory/Product/productlisting/productlisting.component';
import { ProductListComponent } from './components/Inventory/Product/product_list/product_list.component';
import { FoodMenuComponent } from './components/Inventory/Product/food_menu/food_menu.component';
import { OrderMenuComponent } from './components/Inventory/Product/order_menu/order_menu.component';
import { FoodMenuCategoryComponent } from './components/Inventory/Product/food_menu_category/food_menu_category.component';
import { FoodRecipeComponent } from './components/Inventory/Product/food_recipe/food_recipe.component';
import { PurchaseListComponent } from './components/Purchases/purchaselisting/purchaselisting.component';
import { PurchaseAddComponent } from './components/Purchases/purchase_add/purchase_add.component';
import { EshopAddComponent } from './components/CompanyTools/eshop_add/eshop_add.component';
import { ShopAddComponent } from './components/Transaction/shop_add/shop_add.component';
import { PosOrderComponent } from './components/Transaction/pos_order/pos_order.component';
import { KitchenDashboardComponent } from './components/Transaction/kitchen_dashboard/kitchen_dashboard.component';
import { ProductCatalogueComponent } from './components/Inventory/Product/product_catalogue/product_catalogue.component';
import { ProductPriceComponent } from './components/Settings/productpricelisting/productpricelisting.component';
import { PaySlipComponent } from './components/payslip/payslip.component';
import { EshopImportComponent } from './components/CompanyTools/eshop_import/eshop_import.component';
import { EshopListingComponent } from './components/CompanyTools/eshoplisting/eshoplisting.component';
import { SummaryReportComponent } from './components/summaryreport/summaryreport.component';
import { VoucherListingComponent } from './components/CompanyTools/voucher/voucher.component';
import { ClientListingComponent } from './components/User/Client/clientlisting/clientlisting.component';
import { ClientAddingComponent } from './components/User/Client/clientadding/clientadding.component';
import { SupplierListingComponent } from './components/User/Supplier/supplierlisting/supplierlisting.component';
import { InsuranceListingComponent } from './components/Insurance/insurancelisting/insurancelisting.component';
import { ProductTypeListingComponent } from './components/Settings/ProductType/producttypelisting/producttypelisting.component';
import { InvoiceTypeListingComponent } from './components/Settings/InvoiceType/invoicetypelisting/invoicetypelisting.component';
import { PaySlipRecordComponent } from './components/CompanyTools/payslip_record/payslip_record.component';
import { AttendanceRecordComponent } from './components/CompanyTools/attendance_record/attendance_record.component';
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
import { SupplierAddComponent } from './components/User/Supplier/supplier-add/supplier-add.component';
import { ProductTypeAddComponent } from './components/Settings/ProductType/producttype-add/producttype-add.component';
import { InvoiceTypeAddComponent } from './components/Settings/InvoiceType/invoicetype-add/invoicetype-add.component';
import { AccountTypeAddComponent } from './components/Settings/AccountType/accountype-add/accountype-add.component';
import { InsuranceAddComponent } from './components/Insurance/insurance_add/insurance_add.component';
import { OptionGroupAddComponent } from './components/Settings/ProductOptionGroup/optiongroup-add/optiongroup-add.component';
import { InsuranceClientComponent } from './components/Insurance/insurance_client/insurance_client.component';
import { InsurancePolicyComponent } from './components/Insurance/insurance_policy/insurance_policy.component';
import { ProviderAddComponent } from './components/Settings/Provider/provider_add/provider_add.component';
import { ProviderListComponent } from './components/Settings/Provider/provider_list/provider_list.component';
import { LoginComponent } from './components/login/login.component';
import { PolicyListingComponent } from './components/Insurance/policylisting/policylisting.component';
import { AuthGuard } from './helpers/auth.guard';
import { Role } from './models/Role';
import { HomeModule } from './home/home.module';
import { ProfileComponent } from './home/profile/profile.component';
import { SalesComponent } from './components/Transaction/Sales/sales.component';
import { CompanyComponent } from './components/CompanyTools/Profile/company/company.component';
import { CompanyAddComponent } from './components/CompanyTools/Profile/company-add/company-add.component';
import { VirtualCardComponent } from './components/virtual_card/virtual_card.component';

import { GLMainComponent } from './components/Purchases/gl_main/gl_main.component';
import { UserMainComponent } from './components/User/user_main/user_main.component';
import { SettingsMainComponent } from './components/Settings/settings_main/settings_main.component';
export const mainTools = [
  [          
    { 
      name: "Order", 
      link: "/PosOrder", 
      icon: 'carry-out', 
      role: ['Admin','Cafe']      
    },     
    {
      name: 'Kitchen',
      link: '/KitchenDashboard',
      icon: 'coffee',
      role: ['Kitchen','Admin'] 
    },  
    {
      name: 'Product',
      link: '/ProductListing/1',
      icon: 'barcode',
      role: ['Admin'] 
    },   
    {
      name: 'Sales',
      icon: 'fund', 
      link: "/Sales",
      role: ['Admin'] 
    },  
    { 
      icon: 'read',
      name: "Recipe", 
      link: "/FoodMenuCategory/4",
      role: ['Admin']    
    },     
  ],
  [            
    { 
      icon: 'ordered-list',
      name: "Inventory", 
      link: "/CafeStockTick",
      role: ['Admin']    
    },      
    {
      name: "餐牌 Menu", 
      link: "/OrderMenu/4",
      icon: 'book',
      role: ['Admin']    
    }, 
    {     
      icon: 'account-book',
      name: "进账",
      link: "/PurchaseAdd",
      role: ['Admin']    
    },  
  ]
];
export const navItems = [    
  {
    name: 'Home',
    icon: 'profile',
    link: "/",
    role: ['Admin'] 
  }, 
  {
    name: 'Home',
    icon: 'profile',
    link: "/ClockIn",
    role: ['Staff'] 
  },
  {
    name: '出单 Cashier',
    link: '/ShopAdd',
    role: ['Admin'] 
  },
  {
    title: true,
    name: "Restaurant ", 
    icon: 'carry-out', 
    children: [    
      { 
        name: "Order", 
        link: "/PosOrder", 
        icon: 'carry-out', 
        role: ['Admin','Cafe']      
      },      
      {
        name: 'Kitchen Dashboard',
        link: '/KitchenDashboard',
        icon: 'coffee',
        role: ['Kitchen','Admin'] 
      },    
      {
        name: 'Stock Tick',
        link: '/CafeStockTick',
        icon: 'carry-out',
        role: ['Kitchen','Admin'] 
      },
      { 
        name: "Clock In / Clock Out", 
        link: "/AttendanceListing/cafe",
        role: ['Admin','Cafe']  
      }, 
      { 
        name: "餐牌 Menu", 
        link: "/FoodMenu/4",
        role: ['Admin']    
      },
      { name: "Recipe", link: "ProductAdd/6" },
      {
        name: "Sales", 
        link: "/CafeSales",
        role: ['Admin','Cafe'] 
      },
    ], role: ['Admin','Kitchen','Cafe'] 
  },
  {
    title: true,
    name: '进账 General Ledger',
    // icon: 'wallet',      
    icon: 'account-book',
    children: [  
      { name: "进账 General Ledger", link: "/PurchaseAdd" },   
      { name: "进账记录 Listing", link: "/PurchaseList/1", role: ['Admin']  }, 
      // { name: "进账记录 General Ledger", link: "/GL", role: ['Admin']  },         
    ], role: ['Admin'] 
  },
  {
    title: true,
    name: '商品 Product',
    icon: 'barcode',
    children: [
      { name: "Search 寻找货", link: "/ProductListing/1" },    
      // { name: "货的资料 Detail", link: "/Product" },         
      { name: "查过期货品 Expired Item", link: "/ExpiredItemListing" },                
      { name: "货单 POrder Listing", link: "/POrderListing" }  ,     
      { name: "包装 Package Stock Balance", link: "/ProductListing/2" },
      { name: "存货 Cafe Stock Balance", link: "/ProductListing/5" },        
      { name: "做目录 Catalogue", link: "/ProductCatalogue" }  ,             
    ], role: ['Admin'] 
  },    
  {
    title: true,
    name: '营业 Transaction',
    icon: 'fund',
    children: [
      { name: "Sales", link: "/Sales" },
      // { name: "进单 Add", link: "/EshopAdd", role: ['Admin'] },
      // { name: "营业单 Detail", link: "/Eshop", role: ['Admin'] },
      { name: "营业 Listing", link: "/EshopList", role: ['Admin'] },  
    ], role: ['Admin'] 
  },
  {
    title: true,
    name: '开单 Generate',
    icon: 'form',
    children: [
      { name: "开 Invoice", link: "/InvoiceAdd" },
      { name: "开批发单 Cash Sale", link: "/CashsalesAdd" },
      { name: "粮单 PaySlip", link: "/Payslip" , role: ['Admin'] },
    ], role: ['Admin'] 
  },
  {
    title: true,
    name: '报告 Report',
    icon: 'wallet',
    children: [   
      { name: "账簿 Listing", link: "/PurchaseList/3" , role: ['Admin']},
      { name: "报告 Summary Report", link: "/SummaryReport" , role: ['Admin']},   
      { name: "Income Statement", link: "/pl" , role: ['Admin']},   
      { name: "Balance Sheet", link: "/bs" , role: ['Admin']},   
      { name: "CashFlow", link: "/CashFlow" , role: ['Admin']}   
    ], role: ['Admin'] 
  },
  {
    title: true,
    name: '保险 Insurance',
    icon: 'insurance',
    children: [
      { name: "保险添加 Add", link: "/InsuranceAdd" },
      // { name: "保险客户 Client List", link: "/InsuranceListing", role: ['Admin']  },
      { name: "保险记录 Policy List", link: "/PolicyListing", role: ['Admin']  },
      // { name: "保险添加 New Policy", link: "/InsurancePolicy" },
      // { name: "保险记录 List", link: "/InsuranceList" },        
      // { name: "保险详情 Detail", link: "/InsuranceDetail" },
    ], role: ['Admin'] 
  },
  {
    title: true,
    name: 'User',
    icon: 'user',
    link: "/User",   
    role: ['Admin'] 
  },
  {
    title: true,
    name: 'Company Tools',
    icon: 'setting',
    children: [          
      { name: "本公司资料 Company Detail", link: "/Company", role: ['Admin'] },
      { name: "PaySlip Listing", link: "/PaySlipRecord/admin" },
      { name: "Clock In / Clock Out", link: "/AttendanceListing/admin" },     
      { name: "Voucher", link: "/Vouchers" },               
      {
        title: true,
        name: '网店  E-Shop',
        icon: 'cloud-upload',
        children: [
          { name: "网店导入 Import", link: "/EshopImport" }       
        ], role: ['Admin'] 
      },      
      {
        title: true,
        name: '点货 Stock Check',
        icon: 'carry-out',
        children: [
          { name: "点货 Stock Tick", link: "/StockTick" },
          { name: "自动查货 Check Stock", link: "/StockCheck", role: ['Admin']  },
          { name: "点货记录 Listing", link: "/StockCheckListing", role: ['Admin']  }   
        ]
      },
    ], role: ['Admin'] 
  }, 
  {
    title: true,
    name: 'Settings',
    icon: 'setting',
    link: "/Settings", 
    role: ['Admin'] 
  },
];
export const ROUTES: Routes = [
  {
    path: 'GL', component: GLMainComponent, canActivate: [AuthGuard] 
  },
  {
    path: 'SummaryReport', component: SummaryReportComponent, canActivate: [AuthGuard] 
  },
  {
    path: 'InsuranceDetail/:id', component: InsuranceAddComponent,
  },
  {
    path: 'InsuranceAdd', component: InsuranceAddComponent,
  },
  {
    path: 'InsuranceClient', component: InsuranceClientComponent,
  },
  {
    path: 'InsuranceClient/:num', component: InsuranceClientComponent,
  },
  {
    path: 'InsurancePolicy', component: InsurancePolicyComponent,
  },
  {
    path: 'InsurancePolicy/:num', component: InsurancePolicyComponent,
  },
  {
    path: 'InsurancePolicy/:id', component: InsurancePolicyComponent,
  },  
  {
    path: 'Product', component: ProductComponent,
    data: { pageTitle: 'Product' }
  },  
  {
    path: 'ProductListing/:type', component: ProductListComponent
  },
  {
    path: 'OrderMenu/:type', component: OrderMenuComponent
  },
  {
    path: 'FoodMenu/:type', component: FoodMenuComponent
  },
  {
    path: 'FoodMenuCategory/:type', component: FoodMenuCategoryComponent
  },        
  {
    path: 'Recipe/:type/:id', component: FoodRecipeComponent
  },  
  {
    path: 'ProductList/:type', component: ProductListingComponent, canActivate: [AuthGuard], 
    data: { roles: [Role.Admin], pageTitle: 'Product Listing 货品单' }
  }, 
  {
    path: 'PurchaseList/:category', component: PurchaseListComponent
  },
  {
    path: 'PurchaseAdd', component: PurchaseAddComponent,
  },
  {
    path: 'Purchase/:id/:mode', component: PurchaseAddComponent,
  },
  {
    path: 'ProductAdd/:type', component: ProductComponent,    
  },
  {
    path: 'Product/:id/:type', component: ProductComponent,
  }, 
  {
    path: 'Eshop', component: EshopAddComponent,
  },
  {
    path: 'EshopAdd/:id', component: EshopAddComponent,
  },
  {
    path: 'EshopAdd', component: EshopAddComponent,
  },
  {
    path: 'EshopImport', component: EshopImportComponent,
  },
  {
    path: 'EshopList', component: EshopListingComponent,
  },  
  {
    path: 'ShopAdd', component: ShopAddComponent,
  },  
  {
    path: 'PosOrder', component: PosOrderComponent,
  },   
  {
    path: 'KitchenDashboard', component: KitchenDashboardComponent,
  }, 
  {
    path: 'ClientListing', component: ClientListingComponent,
  },   
  {
    path: 'ClientAdding', component: ClientAddingComponent,
  },  
  {
    path: 'ClientAdding/:num', component: ClientAddingComponent,
  },
  {
    path: 'SupplierListing', component: SupplierListingComponent,
  },  
  {
    path: 'InsuranceListing', component: InsuranceListingComponent,
  },    
  {
    path: 'ProductTypeListing', component: ProductTypeListingComponent,
  },    
  {
    path: 'POrderListAdd', component: POrderListComponent,
  },   
  {
    path: 'POrderList/:id', component: POrderListComponent,
  },
  {
    path: 'POrderListing', component: POrderListingComponent,
  },
  {
    path: 'StockTick', component: StockTickComponent,
  },   
  {
    path: 'CafeStockTick', component: RestaurantStockTickComponent,
  },   
  {
    path: 'StockCheck', component: StockCheckComponent,
  },   
  {
    path: 'InvoiceTypeListing', component: InvoiceTypeListingComponent,
  },    
  {
    path: 'PaySlipRecord/:mode', component: PaySlipRecordComponent,
  },      
  {
    path: 'AttendanceListing/:mode', component: AttendanceRecordComponent,
  },  
  {
    path: 'pl', component: IncomeStatementComponent,
  },   
  {
    path: 'bs', component: BalanceSheetComponent,
  }, 
  {
    path: 'CashFlow', component: CashFlowComponent,
  },     
  {
    path: 'Expired', component: ExpiredListComponent,
  },       
  {
    path: 'GoodsPrice', component: GoodsPriceListComponent,
  },        
  {
    path: 'StockCheckListing', component: StockCheckListComponent,
  },         
  {
    path: 'ExpiredItemListing', component: ExpiredItemListComponent,
  },   
  {
    path: 'InvoiceAdd', component: InvoiceAddComponent,
  }, 
  {
    path: 'CashsalesAdd', component: CashsalesAddComponent,
  }, 
  {
    path: 'ProductCatalogue', component: ProductCatalogueComponent,
  }, 
  {
    path: 'ProductPrice', component: ProductPriceComponent,
  },
  {
    path: 'Payslip', component: PaySlipComponent,data: { roles: [Role.Admin] }
  },
  {
    path: 'Login', component: LoginComponent,
  },
  {
    path: 'PolicyListing', component: PolicyListingComponent,
  },
  {
    path: 'SupplierAdd', component: SupplierAddComponent,
  },   
  {
    path: 'OptionGroupAdd', component: OptionGroupAddComponent,
  },      
  {
    path: 'OptionGroup/:id', component: OptionGroupAddComponent,
  }, 
  {
    path: 'ProductTypeAdd', component: ProductTypeAddComponent,
  }, 
  {
    path: 'AccountTypeAdd', component: AccountTypeAddComponent,
  },   
  {
    path: 'InvoiceTypeAdd', component: InvoiceTypeAddComponent,
  },   
  {
    path: 'ProviderAdd', component: ProviderAddComponent,
  }, 
  {
    path: 'ProviderList', component: ProviderListComponent,
  }, 
  {
    path: 'ProviderDetail', component: ProviderAddComponent,
  },
  {
    path: 'Sales', component: SalesComponent,  
  },
  {
    path: 'CafeSales', component: SalesComponent,  
  },
  {
    path: 'ClockIn', component: VirtualCardComponent,  
  },
  {
    path: 'Company', component: CompanyComponent,  
  },   
  {
    path: 'Vouchers', component: VoucherListingComponent,  
  },   
  {
    path: 'Settings', component: SettingsMainComponent,  
  }, 
  {
    path: 'User', component: UserMainComponent,  
  }, 
  // {
  //   path: '', component: BalanceSheetComponent,  
  // },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
        HomeModule,
        data: { breadcrumb: 'Dashboard' },
      },
    ],
  }, 
  {
    path: 'CompanyAdd', component: CompanyAddComponent,  
  },  
  { path: '**', redirectTo: '/Home/Landing', pathMatch: 'full' },
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES, { useHash: true ,onSameUrlNavigation: 'reload'});
