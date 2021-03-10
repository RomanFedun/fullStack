import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialService, MaterialDatePicker} from "../../shared/classes/MaterialService";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') starRef: ElementRef | any
  @ViewChild('end') endRef: ElementRef | any


  order: number | any
  start: MaterialDatePicker | any
  end: MaterialDatePicker |any
  isValid = true


  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.start.destroy()
  }

  ngAfterViewInit() {
    this.start = MaterialService.initDatePicker(this.starRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    if (!!this.start.date || !!this.end.date) {
      return
    }

   this.isValid = this.start.date < this.end.date
  }

  submitFilter() {
    let filter: Filter = {}

    if(this.start.date) {
      filter.start = this.start.date
    }

    if(this.end.date) {
      filter.end = this.end.date
    }

    if (this.order) {
      filter.order = this.order
    }
    this.onFilter.emit(filter)
  }
}
