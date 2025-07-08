import { Component, inject } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { DashboardSummary, DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NgChartsModule], 
  templateUrl: './overview.html',
})
export class Overview {
  summary: DashboardSummary | null = null;
  dashboardService = inject(DashboardService);

  ngOnInit() {
    this.dashboardService.getSummary().subscribe(data => this.summary = data);
  }
}
