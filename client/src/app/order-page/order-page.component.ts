import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInterface, MaterialService} from "../shared/classes/MaterialService";
import {OrderService} from "./order-service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef | any
  modal: MaterialInterface | any
  isRoot: boolean |any
  oSub: Subscription | undefined
  pending = false

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
  //  adding event listener to check order id
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy() {
    this.modal.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  open() {
    this.modal.open()
  }

  cancel() {
    this.modal.close()
  }

  submit() {
    this.pending = true

    let order: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }

    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Order N-${newOrder.order} has done`)
      },
      error => {MaterialService.toast(error.error.message)},
      () => {
        this.modal.close()
        this.pending = false
      }
    )
  }

  removePosition(itemPosition: OrderPosition) {
    this.order.remove(itemPosition)
  }
}
