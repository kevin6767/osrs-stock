import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-chart-financial';
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
} from 'chartjs-chart-financial';
import { CommonModule } from '@angular/common';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

Chart.register(
  OhlcElement,
  OhlcController,
  CandlestickElement,
  CandlestickController,
  ...registerables,
  zoomPlugin,
);

@Component({
  selector: 'candle-stick-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './candle-stick-chart.component.html',
  styleUrls: ['./candle-stick-chart.component.css'],
})
export class CandleStickChartComponent implements OnChanges, OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() itemData: {
    id: number;
    message: {
      data: {
        [key: string]: {
          high: number;
          highTime: number;
          low: number;
          avgHighPrice: any;
          avgLowPrice: any;
          timestamp: number;
        };
      };
    };
  } = { id: 0, message: { data: {} } };

  constructor() {}

  public chartData: ChartData<'candlestick'> = {
    labels: [],
    datasets: [
      {
        label: '365 Days',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  public chartOptions: ChartOptions<'candlestick'> = {
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
          maxTicksLimit: 12, // Limit the number of ticks to fit a full year
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
        beginAtZero: false,
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
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        limits: {
          x: { min: 'original', max: 'original' },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const { o, h, l, c } = tooltipItem.parsed as {
              o: any;
              h: number;
              l: number;
              c: any;
            };
            return [`Open: ${o}`, `High: ${h}`, `Low: ${l}`, `Close: ${c}`];
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.updateChartData();
    this.addChartClickListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemData'] && !changes['itemData'].firstChange) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    console.log('Raw itemData:', this.itemData.message.data);

    const formattedData = Object.values(this.itemData.message.data).map(
      (item, index, array) => {
        return {
          x: item.timestamp * 1000, // Ensure this is a valid Unix timestamp (in ms)
          o: array[index - 1]?.avgLowPrice ?? null,
          h: item.avgHighPrice,
          l: item.avgLowPrice,
          c: array[index + 1]?.avgHighPrice ?? null,
        };
      },
    );

    console.log('Formatted Data for Chart:', formattedData);

    this.chartData.datasets[0].data = formattedData;
    this.chartData.labels = formattedData.map((data) => data.x);

    if (this.chart) {
      this.chart.update();
    }
  }

  private highlightTimeRange(clickX: number): void {
    if (!this.chart) return;

    const xScale = this.chart?.chart?.scales['x'];

    const timestamp = xScale?.getValueForPixel(clickX);
    if (!timestamp) return;

    const rangeStart = timestamp - 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    const rangeEnd = timestamp + 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    this.chartData.datasets[0].data = this.chartData.datasets[0].data.map(
      (dataPoint) => {
        return {
          ...dataPoint,
          backgroundColor:
            dataPoint.x >= rangeStart && dataPoint.x <= rangeEnd
              ? 'rgba(255, 99, 132, 1)'
              : 'rgba(75, 192, 192, 0.5)',
        };
      },
    );

    this.chart.update();
  }

  private addChartClickListener(): void {
    const chartInstance = this.chart?.chart;

    if (chartInstance) {
      chartInstance.canvas.addEventListener('click', (event) => {
        const activePoints = chartInstance.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          false,
        );
        if (activePoints.length) {
          const activePoint = activePoints[0];
          const x = activePoint.element.x;

          if (typeof x === 'number') {
            this.highlightTimeRange(x);
          }
        }
      });
    }
  }
}
