import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IoChartComponent } from './chart/chart.component';
import { ChartOptions } from './chart/chart-options.interface';

interface SeriesRow {
  name: string;
  value: number | null;
  color: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, IoChartComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  // ── Live playground state ──
  chartTypes: Array<'line' | 'column' | 'pie'> = ['line', 'column', 'pie'];
  liveType: 'line' | 'column' | 'pie' = 'line';
  liveTitle: string = 'My Chart';
  liveSeries: SeriesRow[] = [
    { name: 'Category A', value: 40, color: '#2563eb' },
    { name: 'Category B', value: 65, color: '#16a34a' },
    { name: 'Category C', value: 30, color: '#f97316' },
  ];

  // The options object passed to io-chart (always a new reference so OnPush triggers)
  liveChart: ChartOptions = this.buildOptions();

  private buildOptions(): ChartOptions {
    return {
      type: this.liveType,
      title: this.liveTitle || 'My Chart',
      series: this.liveSeries
        .filter(s => s.name.trim() !== '' && s.value !== null && !isNaN(Number(s.value)))
        .map(s => ({ name: s.name, value: Number(s.value), color: s.color || '#2563eb' })),
    };
  }

  onTypeChange(): void {
    this.liveChart = this.buildOptions();
  }

  onFieldChange(): void {
    this.liveChart = this.buildOptions();
  }

  addRow(): void {
    const colors = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed', '#0891b2'];
    this.liveSeries.push({
      name: '',
      value: null,
      color: colors[this.liveSeries.length % colors.length],
    });
    this.liveChart = this.buildOptions();
  }

  removeRow(index: number): void {
    this.liveSeries.splice(index, 1);
    this.liveChart = this.buildOptions();
  }

  // ── Static example charts below ──
  lineChart: ChartOptions = {
    type: 'line',
    title: 'Monthly Sales',
    series: [
      { name: 'Jan', value: 40, color: '#2563eb' },
      { name: 'Feb', value: 65, color: '#2563eb' },
      { name: 'Mar', value: 50, color: '#2563eb' },
      { name: 'Apr', value: 80, color: '#2563eb' },
      { name: 'May', value: 72, color: '#2563eb' },
      { name: 'Jun', value: 95, color: '#2563eb' },
    ],
  };

  columnChart: ChartOptions = {
    type: 'column',
    title: 'Quarterly Revenue',
    series: [
      { name: 'Q1', value: 12000, color: '#16a34a' },
      { name: 'Q2', value: 18500, color: '#16a34a' },
      { name: 'Q3', value: 14200, color: '#16a34a' },
      { name: 'Q4', value: 22000, color: '#16a34a' },
    ],
  };

  pieChart: ChartOptions = {
    type: 'pie',
    title: 'Traffic Sources',
    series: [
      { name: 'Offline', value: 30, color: '#f97316' },
      { name: 'Online', value: 70, color: '#2563eb' },
    ],
  };

  assignmentExample: ChartOptions = {
    type: 'line',
    title: 'Sales Report',
    series: [
      { name: 'Offline', value: 30, color: 'red' },
      { name: 'Online', value: 70, color: 'blue' },
    ],
  };
}
