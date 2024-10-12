import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataFetchingService } from '../../services/data-fetching/data-fetching.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  itemForm: FormGroup;

  constructor(
    private router: Router,
    private dataFetchingService: DataFetchingService,
  ) {
    this.itemForm = new FormGroup({
      itemName: new FormControl(''),
    });
  }

  ngOnInit() {
    this.dataFetchingService.getData().subscribe((data) => {
      console.log(data);
    });
  }

  goToItemPage() {
    const itemName = this.itemForm.get('itemName')?.value;
    if (itemName) {
      // Navigate to the item page using the item name
      this.router.navigate(['/items', itemName]);
    }
  }
}
