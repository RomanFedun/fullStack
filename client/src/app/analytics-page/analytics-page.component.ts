import {AfterViewInit, Component, ElementRef, OnDestroy,  ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";

import {Chart} from 'chart.js'

import {AnalyticsPage} from "../shared/interfaces";

import {Subscription} from "rxjs";




@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef | any
  @ViewChild('order') orderRef: ElementRef | any

  uSub: Subscription | any
  average: number | undefined
  pending = true
  data: AnalyticsPage | any


  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255, 99, 132)'
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }



    this.uSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average


      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)


      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, this.createChartConfig(gainConfig))
      new Chart(orderCtx, this.createChartConfig(orderConfig))

      this.pending = false

    })

  }

  // @ts-ignore
  createChartConfig({labels, data, label, color}) {
     return {
      type: 'line',


      data: {
        labels,
        datasets: [
          {
            label, data,
            borderColor: color,
            steppedLine: false,
            fill: false
          }
        ]
      }
    }
  }


  ngOnDestroy() {
    if(this.uSub) {
      this.uSub.unsubscribe()
    }
  }

}


