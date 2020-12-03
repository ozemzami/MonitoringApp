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
            maxRotation: 75,
            minRotation: 75,
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
    { value: 'days', viewValue: 'Range of days' }
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
    .subscribe(data => this.createChart());
    this.range.valueChanges.subscribe((data) => this.getRangeData());
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

  getRangeData() {
    if ( this.range.get('start').value && this.range.get('end').value ){
      const start = new Date(this.range.get('start').value);
      const end = new Date(this.range.get('end').value);
      this.barChartLabels = [];
      const series = [];
      let i = 0;
      while ( start.getDate() !== end.getDate() ) {
        this.barChartLabels.push(`${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()}`);
        series[i] = this.clicks.filter(( click ) => {
          const date = new Date(click.time);
          return date.getFullYear() === start.getFullYear() && date.getMonth() === start.getMonth() && date.getDate() === start.getDate();
          }).length;
        start.setDate(start.getDate() + 1 );
        i++;
      }
      this.barChartLabels.push(`${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`);
      series[i] = this.clicks.filter(( click ) => {
        const date = new Date(click.time);
        return date.getFullYear() === end.getFullYear() && date.getMonth() === end.getMonth() && date.getDate() === end.getDate();
        }).length;

      this.barChartData[0].data = series;
    }
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
          this.getRangeData();
        }
        break;
    }
  }

  getSeries(labels) {
    const date = new Date();
    const series = [];
    for (let i = 0; i < labels.length; i++) {
      series[i] = this.clicks.filter((click) => new Date(click.time).getHours() === labels[i] &&
       new Date(click.time).getDate() === date.getDate()).length;
    }
    return series;
  }
}
