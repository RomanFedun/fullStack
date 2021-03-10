import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInterface, MaterialService} from "../../shared/classes/MaterialService";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() orders: Order[] | any
  @ViewChild('modal') modalRef: ElementRef | any

  modal: MaterialInterface | any
  selectedOrder: Order[] | any

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total + item.quantity * item.cost
    }, 0)
  }

  selectOrder(order: Order[]) {
    this.selectedOrder = order
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }
}
