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
          avgHighPrice: number;
          avgLowPrice: number;
          timestamp: number;
        };
      };
    };
  } = { id: 0, message: { data: {} } };

  constructor() {}

  public chartData: ChartData<'candlestick'> = {
    datasets: [
      {
        label: 'Last hour',
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
          unit: 'minute',
          tooltipFormat: 'hh:mm',
          displayFormats: {
            minute: 'hh:mm',
          },
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
        title: {
          display: true,
          text: 'Time',
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
              o: number;
              h: number;
              l: number;
              c: number;
            };
            return [
              `High: ${h.toLocaleString()}`,
              `Low: ${l.toLocaleString()}`,
            ];
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.updateChartData(); // Initialize chart data
    this.addChartClickListener(); // Add click listener after chart initialization
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemData'] && !changes['itemData'].firstChange) {
      this.updateChartData(); // Update chart data when itemData changes
    }
  }

  private updateChartData(): void {
    console.log('Raw itemData:', this.itemData.message.data);

    const formattedData = Object.values(this.itemData.message.data).map(
      (item) => {
        return {
          x: item.timestamp,
          o: item.avgLowPrice,
          h: item.avgHighPrice,
          l: item.avgLowPrice,
          c: item.avgHighPrice,
        };
      },
    );

    console.log('Formatted Data for Chart:', formattedData); // Log the formatted data

    this.chartData.datasets[0].data = formattedData.map((dataPoint) => ({
      ...dataPoint,
      backgroundColor: 'rgba(75, 192, 192, 0.5)', // Default color
    }));

    if (this.chart) {
      this.chart.update(); // Update the chart to reflect new data
    }
  }

  private highlightTimeRange(clickX: number): void {
    if (!this.chart) return;

    const xScale = this.chart?.chart?.scales['x'];

    const timestamp = xScale?.getValueForPixel(clickX);
    if (!timestamp) return;
    const rangeStart = timestamp - 15 * 60 * 1000; // 15 minutes in milliseconds
    const rangeEnd = timestamp + 15 * 60 * 1000; // 15 minutes in milliseconds

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

    this.chart.update(); // Update the chart to reflect changes
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
          // Access the first active point safely
          const activePoint = activePoints[0];

          // Use the correct structure to access x and y
          const x = activePoint.element.x; // x value from the active point
          const y = activePoint.element.y; // y value from the active point

          if (typeof x === 'number') {
            this.highlightTimeRange(x);
          }
        }
      });
    }
  }
}
