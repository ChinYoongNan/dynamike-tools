export class BalanceSheet {
  nca: any = 0.0;
  accdep: any = 0.0;
  bank:any = 0.0;
  cash: any = 0.0;
  coin: any = 0.0;
  cashAtHand: any =0.0;
  deposit: any = 0.0;
  stock: any = 0.0;
  receviable: any = 0.0;
  ca: any = 0.0;
  getCA() {
    this.ca= this.cash + this.coin + this.bank + this.deposit + this.stock + this.receviable
    return !isNaN(this.ca)?this.ca.toFixed(2):0.00
  }
  totalAsset: any = 0.0;
  getTotalAsset() {
    this.totalAsset=this.nca + parseFloat(this.getCA())
    return !isNaN(this.totalAsset)?this.totalAsset.toFixed(2):0.00
  }
  equity_BF: any = 0.0;
  equity: any = 0.0;
  redrawing: any = 0.0;
  profit: any = 0.0;
  totalEquity: any = 0.0;
  getTotalEquity() {
    this.totalEquity=(this.equity_BF + this.equity + this.profit) - this.redrawing
    return !isNaN(this.totalEquity)?this.totalEquity.toFixed(2):0.00
  }
  loans: any = 0.0;
  payble: any = 0.0;
  sundry: any = 0.0;
  totalLiabilities: any = 0.0;
  getTotalLiabilities() {
    this.totalLiabilities=this.loans + this.payble + this.sundry 
    return !isNaN(this.totalLiabilities)?this.totalLiabilities.toFixed(2):0.00
  }
  differences:any = 0.0;
  getDifferences() {
    this.differences= this.totalAsset - this.totalETLB
    return !isNaN(this.differences)?this.differences.toFixed(2):0.00
  }
  totalETLB: any = 0.0;
  getTotalETLB() {
     this.totalETLB = this.totalEquity + this.totalLiabilities
    return !isNaN(this.totalETLB)?this.totalETLB.toFixed(2):0.00
  }
}