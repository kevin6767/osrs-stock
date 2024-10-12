import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { BooleanInput } from '@angular/cdk/coercion';
import { AsyncPipe } from '@angular/common';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, AsyncPipe, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'osrs-stock-app';

  constructor() {}
}
