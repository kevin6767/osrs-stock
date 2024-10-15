import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataFetchingService } from '../../services/data-fetching/data-fetching.service';
import { transformData } from '../utils/epoch-time';
import { AreaChartComponent } from '../area-chart/area-chart.component';

interface ApiResponse {
  message: {
    prices: {
      average: number | undefined; // Change this if necessary
      daily: any; // Adjust based on actual data structure
    };
    details: {
      item: {
        icon_large: string | undefined; // Change this if necessary
      };
    };
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, AreaChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  itemForm: FormGroup;
  isLoading: boolean = false;
  timeData: {
    transformedAverage: any | null;
    transformedDaily: any | null;
  } = {
    transformedAverage: null,
    transformedDaily: null,
  };
  data: ApiResponse = {
    message: {
      prices: {
        average: undefined,
        daily: undefined,
      },
      details: {
        item: {
          icon_large: undefined,
        },
      },
    },
  };
  average: any = undefined;
  daily: any = undefined;
  item_img: string | undefined = undefined;

  constructor(
    private router: Router,
    private dataFetchingService: DataFetchingService,
  ) {
    this.itemForm = new FormGroup({
      itemName: new FormControl(''),
    });
  }

  goToItemPage() {
    const itemName = this.itemForm.get('itemName')?.value;
    if (itemName) {
      // Navigate to the item page using the item name
      this.isLoading = true;
      this.dataFetchingService
        .getData(itemName)
        .subscribe((data: ApiResponse) => {
          this.data = data;
          console.log(this.data);
          this.timeData = transformData({
            average: this.data.message.prices.average,
            daily: this.data.message.prices.daily,
          });

          // Update the average and daily prices for the chart
          this.item_img = this.data.message.details.item.icon_large;
          this.average = this.timeData.transformedAverage;
          this.daily = this.timeData.transformedDaily;
          this.isLoading = false;
        });
    }
  }
}
