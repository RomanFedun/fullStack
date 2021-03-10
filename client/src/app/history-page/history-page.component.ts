import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {MaterialInterface, MaterialService} from "../shared/classes/MaterialService";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})


export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('toolTip') tooltipRef: ElementRef | any
  isFilterVisible = false
  tooltip: MaterialInterface | any
  // bannerName: string = 'banner'
  orders: Order[] | any= []

  offset = 0
  limit = STEP
  oSub: Subscription | any
  loading = false
  reloading = false
  filter: Filter = {}

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch() {
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // }
    let params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = [...this.orders, ...orders]
      this.loading = false
      this.reloading = false
    })
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initToolTip(this.tooltipRef)
  }

  loadMore() {
    this.loading = true
    this.offset += STEP
    this.fetch()
  }

  applyFilter(filter: Filter) {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
    console.log(filter)
  }


  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }
}
