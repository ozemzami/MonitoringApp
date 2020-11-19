import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  clicks: any;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.getAllClicks()
    .subscribe(clicks => {
      this.clicks = clicks;
      const date = new Date();
      const labels = [];
      for ( let i = 0; i < 24; i++) {
        labels.push( (date.getHours() + i + 1) % 24 );
      }
      const datawebsiteViewsChart = {

        labels: labels.map(label => label + 'h'),
        series: [
          this.getSeries(labels)

        ]
      };
      const optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: Math.max(...this.getSeries(labels)) + 1,
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
          height: '300px'
      };
      const responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: Math.max(...this.getSeries(labels)),
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      const websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);
    });

  }

  getSeries(labels) {
    const series = [];
    for ( let i = 0; i < labels.length; i++) {
      series[i] = this.clicks.filter(click => new Date(click.time).getHours() === labels[i]).length;
    }
    return series;
  }

}
