import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/authentication/user';
import { TrackerService } from './tracker.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { PageEvent } from '@angular/material/paginator';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

interface GraphType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent implements OnInit {
  option = new FormControl();
  date = new FormControl(moment());
  trackingForm: FormGroup;
  userIsSelected: boolean;
  offers: any;
  dataToBeRendered: any;
  subs: any;
  clicks: any;
  length: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  users: User[];
  pageEvent: PageEvent;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: false,
          scaleLabel: {
            labelString: 'Date',
          },
          ticks: {
            stepSize: 1,
            min: 0,
            maxRotation: 90,
            minRotation: 90,
            autoSkip: false,
          },
        },
      ],
      yAxes: [{}],
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: [] }
  ];

  options: GraphType[] = [
    { value: '24-hours', viewValue: 'Last 24 hours' },
    { value: 'days', viewValue: 'Range of days' },
    { value: 'month', viewValue: 'Month' },
    { value: 'year', viewValue: 'Year' },
  ];

  selectedOption = this.options[0].value;

  constructor(
    private trackerService: TrackerService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllusers();
    this.getAllOffers();
    this.createForm();
    this.trackerService.getAllClicks().subscribe((clicks) => {
      this.clicks = clicks;
      this.length = clicks.length;
      this.dataToBeRendered = this.clicks.slice(0, this.pageSize);
      this.createChart();
    });
    this.option.setValue('24-hours');
    this.option.valueChanges
    .subscribe(data => console.log('hello'));
  }


  getAllusers() {
    this.trackerService.getAllUsers().subscribe((users) => (this.users = users));
  }

  getAllOffers() {
    this.trackerService.getAllOffers().subscribe((offers) => (this.offers = offers));
  }

  createForm() {
    this.trackingForm = this.fb.group({
      user: '',
      offer: '',
    });
    this.trackingForm.valueChanges.subscribe((data) => this.onValueChanged());

    this.onValueChanged();
  }

  onValueChanged() {
    if (this.trackingForm.get('user').value && this.trackingForm.get('offer').value) {
      this.trackerService
        .getClicksByOfferAndUser(this.trackingForm.get('user').value, this.trackingForm.get('offer').value)
        .subscribe(async (clicks) => {
          this.clicks = clicks;
          this.length = clicks.length;
          this.dataToBeRendered = this.clicks.slice(0, this.pageSize);
          this.createChart();
        });
    } else if (this.trackingForm.get('user').value) {
      this.trackerService.getAllClicks().subscribe((clicks) => {
        this.clicks = clicks.filter((click) => click.subscription.user.id === this.trackingForm.get('user').value);
        this.length = this.clicks.length;
        this.dataToBeRendered = this.clicks.slice(0, this.pageSize);
        this.createChart();
      });
    } else if (this.trackingForm.get('offer').value) {
      this.trackerService.getAllClicks().subscribe((clicks) => {
        this.clicks = clicks.filter((click) => click.subscription.offer.id === this.trackingForm.get('offer').value);
        this.length = this.clicks.length;
        this.dataToBeRendered = this.clicks.slice(0, this.pageSize);
        this.createChart();
      });
    } else {
      this.trackerService.getAllClicks().subscribe((clicks) => {
        this.clicks = clicks;
        this.length = clicks.length;
        this.dataToBeRendered = this.clicks.slice(0, this.pageSize);
        this.createChart();
      });
    }
  }

  onChangeData(event) {
    this.dataToBeRendered = [];
    this.pageSize = event.pageSize;
    console.log(event.pageIndex * this.pageSize + 1);
    console.log((event.pageIndex + 1) * this.pageSize);
    this.dataToBeRendered = this.clicks.slice(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

  createChart() {
    switch (this.selectedOption) {
      case '24-hours':
        const date = new Date();
        const labels = [];
        for (let i = 0; i < 24; i++) {
          labels.push((date.getHours() + i + 1) % 24);
        }
        this.barChartLabels = labels.map((label) => label + 'h');
        this.barChartData[0].data = this.getSeries(labels);
        break;
      case 'days':
        this.barChartLabels = [];
        this.barChartData[0].data = [];
        if ( true) {
          this.getDayGraphData();
        }
        break;
    }
  }

  getSeries(labels) {
    const date = new Date();
    const series = [];
    for (let i = 0; i < labels.length; i++) {
      series[i] = this.clicks.filter((click) => new Date(click.time).getHours() === labels[i] &&
       new Date(click.time).getHours() === date.getDate()).length;
    }
    return series;
  }


  getDayGraphData() {
    this.barChartLabels = [];
    const selectedDay = this.date.value._d.getDate();
    const selectedMonth = this.date.value._d.getMonth();
    const selectedYear = this.date.value._d.getFullYear();
    for ( let i = 0; i < 24; i++) {
      this.barChartLabels.push( i + 'h');
    }
    const series = [];
    for (let i = 0; i < this.barChartLabels.length; i++) {
      series[i] = this.clicks.filter(( click ) => {
         const date = new Date(click.time);
         return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth &&
          date.getDate() === selectedDay && date.getHours() === i;
        }).length;
    }
    this.barChartData[0].data = series;
  }
}
