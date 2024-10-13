import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataFetchingService } from '../../services/data-fetching/data-fetching.service';
import { transformData } from '../utils/epoch-time';
import { AreaChartComponent } from '../area-chart/area-chart.component';

interface ApiResponse {
  message: {
    average: number | undefined; // Change this if necessary
    daily: any; // Adjust based on actual data structure
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
  timeData: {
    transformedAverage: any | null;
    transformedDaily: any | null;
  } = {
    transformedAverage: null,
    transformedDaily: null,
  };
  data: ApiResponse = {
    message: {
      average: undefined,
      daily: undefined,
    },
  };
  average: any = undefined;
  daily: any = undefined;

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
      this.dataFetchingService
        .getData(itemName)
        .subscribe((data: ApiResponse) => {
          this.data = data;
          this.timeData = transformData({
            average: this.data.message.average,
            daily: this.data.message.daily,
          });

          this.average = this.timeData.transformedAverage;
          this.daily = this.timeData.transformedDaily;
        });
    }
  }
}
