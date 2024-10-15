import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartData, ChartOptions, registerables, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { CommonModule } from '@angular/common';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnChanges, OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() dailyPrices: { date: string; daily: number }[] = [];
  @Input() movingAverages: { date: string; average: number }[] = [];
  @Input() item_img: string | undefined;
  public isZoomingOrPanning = false;

  isLoading: boolean = false;

  constructor() {
    Chart.register(...registerables, zoomPlugin);
  }

  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Daily Price',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.5,
      },
      {
        label: '30-Day Moving Average',
        data: [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.5,
      },
    ],
  };
  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
          onZoomStart: () => (this.isZoomingOrPanning = true),
          onZoomComplete: () => (this.isZoomingOrPanning = false),
        },
        pan: {
          enabled: true,
          mode: 'x',
          onPanStart: () => (this.isZoomingOrPanning = true),
          onPanComplete: () => (this.isZoomingOrPanning = false),
        },
        limits: {
          x: { min: 'original', max: 'original' },
        },
      },
      tooltip: {
        enabled: (context) => {
          return !this.isZoomingOrPanning;
        },
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.parsed.y;
            const datasetLabel = tooltipItem.dataset.label;
            return [`${datasetLabel}: ${value}`];
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dailyPrices'] || changes['movingAverages']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    this.isLoading = true;
    const hasDailyPrices =
      Array.isArray(this.dailyPrices) && this.dailyPrices.length > 0;
    const hasMovingAverages =
      Array.isArray(this.movingAverages) && this.movingAverages.length > 0;

    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];
    this.chartData.datasets[1].data = [];

    if (hasDailyPrices) {
      this.chartData.labels = this.dailyPrices.map((price) => price.date);
      this.chartData.datasets[0].data = this.dailyPrices.map(
        (price) => price.daily,
      );
    }

    if (hasMovingAverages) {
      this.chartData.datasets[1].data = this.movingAverages.map(
        (avg) => avg.average,
      );
    }
    this.isLoading = false;
    if (this.chart) {
      this.chart.update();
    }
  }
}
