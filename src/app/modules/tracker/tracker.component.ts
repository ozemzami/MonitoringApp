import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/authentication/user';
import { TrackerService } from './tracker.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { PageEvent } from '@angular/material/paginator';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as Chartist from 'chartist';
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

  users: User[];
  // MatPaginator Output
  pageEvent: PageEvent;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
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
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
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
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {}

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
    const date = new Date();
    const labels = [];
    for (let i = 0; i < 24; i++) {
      labels.push((date.getHours() + i + 1) % 24);
    }
    const datawebsiteViewsChart = {
      labels: labels.map((label) => label + 'h'),
      series: [this.getSeries(labels)],
    };
    //this.barChartLabels = datawebsiteViewsChart.labels;
    //this.barChartData = [{ data: this.getSeries(labels) }];
    const optionswebsiteViewsChart = {
      axisX: {
        offset: 60,
        showGrid: false,
      },
      low: 0,
      high: Math.max(...this.getSeries(labels)) + 1,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      height: '300px',
    };
    const responsiveOptions: any[] = [
      [
        'screen and (max-width: 640px)',
        {
          seriesBarDistance: Math.max(...this.getSeries(labels)),
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            },
          },
        },
      ],
    ];
    const websiteViewsChart = new Chartist.Bar(
      '#websiteViewsChart',
      datawebsiteViewsChart,
      optionswebsiteViewsChart,
      responsiveOptions
    );
  }

  getSeries(labels) {
    const series = [];
    for (let i = 0; i < labels.length; i++) {
      series[i] = this.clicks.filter((click) => new Date(click.time).getHours() === labels[i]).length;
    }
    return series;
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.random() * 100,
      56,
      Math.random() * 100,
      40,
    ];
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
}
