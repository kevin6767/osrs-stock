import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataFetchingService } from '../../services/data-fetching/data-fetching.service'; // Import your service
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-page',
  standalone: true,
  imports: [CommonModule], // Add CommonModule if you use common directives like *ngIf
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css'],
})
export class ItemPageComponent implements OnInit {
  itemName: string | null = null;
  itemData: any;

  constructor(
    private route: ActivatedRoute,
    private dataFetchingService: DataFetchingService, // Inject the service
  ) {}

  ngOnInit(): void {
    // Get the item name from the route
    this.itemName = this.route.snapshot.paramMap.get('itemName');

    // Make an API call if the item name is available
    if (this.itemName) {
      this.fetchItemData(this.itemName);
    }
  }

  fetchItemData(itemName: string): void {
    this.dataFetchingService.getItemData(itemName).subscribe(
      (data) => {
        this.itemData = data; // Store the fetched data
      },
      (error) => {
        console.error('Error fetching item data:', error);
      },
    );
  }
}
