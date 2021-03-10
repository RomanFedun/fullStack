import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInterface, MaterialService} from "../shared/classes/MaterialService";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef | any
  tapTarget: MaterialInterface | any
  data$: Observable<OverviewPage> | undefined
  yesterday = new Date()

  constructor(private service: AnalyticsService) { }

  ngOnInit(): void {
    this.data$ = this.service.getOverview()
    this.yesterday.setDate(this.yesterday.getDate()-1)
  }

  ngOnDestroy() {
    this.tapTarget.destroy()
  }

  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  openInfo() {
    this.tapTarget.open()
  }
}
