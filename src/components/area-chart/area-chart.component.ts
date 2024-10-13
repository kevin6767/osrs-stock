import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions, registerables, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns'; // Import the date adapter you're using
import { CommonModule } from '@angular/common';
import zoomPlugin from 'chartjs-plugin-zoom'; // Import the zoom plugin
Chart.register(zoomPlugin);
Chart.register(...registerables);

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnChanges {
  @Input() dailyPrices: { date: string; daily: number }[] = [];
  @Input() movingAverages: { date: string; average: number }[] = [];

  constructor() {}

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
        // This will prevent the graph from overflowing its container
        min: 'your_start_date_here', // Set min date
        max: 'your_end_date_here', // Set max date
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.parsed.y; // The value from the y-axis
            const datasetLabel = tooltipItem.dataset.label; // Get the dataset label
            return [`${datasetLabel}: ${value}`]; // Show the dataset label along with the value
          },
        },
      },
    },
  };

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    // Check if dailyPrices or movingAverages are defined and not empty
    const hasDailyPrices =
      Array.isArray(this.dailyPrices) && this.dailyPrices.length > 0;
    const hasMovingAverages =
      Array.isArray(this.movingAverages) && this.movingAverages.length > 0;

    // Clear existing data
    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];
    this.chartData.datasets[1].data = [];

    // Update labels and datasets based on the inputs
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

    // Optionally, adjust the canvas width based on the data length
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const chartWidth =
        Math.max(this.dailyPrices.length, this.movingAverages.length) * 100; // Adjust the multiplier for desired width
      canvas.style.width = `${chartWidth}px`;
    }
  }
}
