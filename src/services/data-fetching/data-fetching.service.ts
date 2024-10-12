import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  constructor(private http: HttpClient) {}

  getItemData(itemName: string): Observable<any> {
    const url = `https://your-api-url.com/items/${itemName}`; // Replace with your API URL
    return this.http.get<any>(url);
  }

  getData() {
    console.log('Get data');
    return this.http.get('http://127.0.0.1:5000/api/data');
  }
}
