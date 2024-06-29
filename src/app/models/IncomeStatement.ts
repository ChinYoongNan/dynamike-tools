export class IncomeStatement {
  sales: any = 0.0;
  outletSales:any = 0.0;
  netSales: any = 0.0;
  getNetSales() {
    this.netSales=this.sales + this.outletSales
    return !isNaN(this.netSales)?this.netSales.toFixed(2):0.00
  }
  purchases: any = 0.0;
  opening: any = 0.0;
  closing: any = 0.0;
  cogs: any = 0.0;
  getCogs() {
    this.cogs= this.closing - (this.purchases+this.opening) 
    return !isNaN(this.cogs)?this.cogs.toFixed(2):0.00
  }
  grossProfit: any = 0.0;
  getGrossProfit() {
    this.grossProfit = this.sales + this.cogs
    return !isNaN(this.grossProfit)?this.grossProfit.toFixed(2):0.00
  }
  expenses:any = 0.0;
  promotion:any = 0.0;
  upkeep:any = 0.0;
  utilities:any = 0.0;
  workContribution:any = 0.0;
  totalExp: any = 0.0;  
  getTotalExp() {
    this.totalExp = this.expenses + this.promotion + this.upkeep + this.utilities + this.workContribution
    return !isNaN(this.totalExp)?this.totalExp.toFixed(2):0.00
  }
  netProfit:any = 0.0;  
  getNetProfit() {
    this.netProfit = this.grossProfit - this.totalExp
    return !isNaN(this.netProfit)?this.netProfit.toFixed(2):0.00
  }
  tax:any = 0.0;
  afterTax:any = 0.0;
}