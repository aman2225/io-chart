export interface ChartOptions {
  type: 'line' | 'column' | 'pie';
  title: string;
  series: {
    name: string;
    value: number;
    color: string;
  }[];
}
