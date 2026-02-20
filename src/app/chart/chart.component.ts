import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions } from './chart-options.interface';

export interface PieSlice {
    name: string;
    value: number;
    color: string;
    percent: number;
    startAngle: number;
    endAngle: number;
    path: string;
    labelX: number;
    labelY: number;
}

export interface LinePoint {
    x: number;
    y: number;
    value: number;
    name: string;
    color: string;
}

@Component({
    selector: 'io-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IoChartComponent implements OnChanges {
    @Input() chartOptions!: ChartOptions;

    // Shared
    hoveredIndex: number = -1;

    // Column / Line chart shared
    maxValue: number = 0;
    barWidth: number = 0;
    barGap: number = 0;
    svgHeight: number = 320;
    chartPaddingLeft: number = 50;
    chartPaddingBottom: number = 40;
    chartPaddingRight: number = 20;
    chartPaddingTop: number = 20;
    chartWidth: number = 700;
    innerWidth: number = 0;
    innerHeight: number = 0;
    yTicks: { value: number; y: number; label: string }[] = [];
    columnBars: { x: number; y: number; width: number; height: number; color: string; name: string; value: number }[] = [];

    // Line chart
    linePoints: LinePoint[] = [];
    polylinePath: string = '';
    areaPath: string = '';

    // Pie chart
    pieSlices: PieSlice[] = [];
    total: number = 0;

    ngOnChanges(_changes: SimpleChanges): void {
        if (!this.chartOptions || !this.chartOptions.series?.length) return;

        this.hoveredIndex = -1;
        this.innerWidth = this.chartWidth - this.chartPaddingLeft - this.chartPaddingRight;
        this.innerHeight = this.svgHeight - this.chartPaddingTop - this.chartPaddingBottom;

        switch (this.chartOptions.type) {
            case 'column':
                this.computeColumnChart();
                break;
            case 'line':
                this.computeLineChart();
                break;
            case 'pie':
                this.computePieChart();
                break;
        }
    }

    private computeColumnChart(): void {
        const series = this.chartOptions.series;
        this.maxValue = Math.max(...series.map((s) => s.value));
        const nicedMax = this.niceMax(this.maxValue);

        const totalBars = series.length;
        const totalGap = this.innerWidth * 0.4;
        this.barWidth = (this.innerWidth - totalGap) / totalBars;
        this.barGap = totalGap / (totalBars + 1);

        this.columnBars = series.map((s, i) => {
            const barH = (s.value / nicedMax) * this.innerHeight;
            const x = this.chartPaddingLeft + this.barGap + i * (this.barWidth + this.barGap);
            const y = this.chartPaddingTop + this.innerHeight - barH;
            return { x, y, width: this.barWidth, height: barH, color: s.color, name: s.name, value: s.value };
        });

        const tickCount = 5;
        this.yTicks = [];
        for (let i = 0; i <= tickCount; i++) {
            const val = (nicedMax / tickCount) * i;
            const y = this.chartPaddingTop + this.innerHeight - (val / nicedMax) * this.innerHeight;
            this.yTicks.push({ value: val, y, label: this.formatValue(val) });
        }
    }

    private computeLineChart(): void {
        const series = this.chartOptions.series;
        this.maxValue = Math.max(...series.map((s) => s.value));
        const nicedMax = this.niceMax(this.maxValue);

        const stepX = this.innerWidth / (series.length > 1 ? series.length - 1 : 1);

        this.linePoints = series.map((s, i) => {
            const x = this.chartPaddingLeft + (series.length === 1 ? this.innerWidth / 2 : i * stepX);
            const y = this.chartPaddingTop + this.innerHeight - (s.value / nicedMax) * this.innerHeight;
            return { x, y, value: s.value, name: s.name, color: s.color };
        });

        this.polylinePath = this.linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        const lastPoint = this.linePoints[this.linePoints.length - 1];
        const firstPoint = this.linePoints[0];
        const baseY = this.chartPaddingTop + this.innerHeight;
        this.areaPath = `${this.polylinePath} L ${lastPoint.x} ${baseY} L ${firstPoint.x} ${baseY} Z`;

        const tickCount = 5;
        this.yTicks = [];
        for (let i = 0; i <= tickCount; i++) {
            const val = (nicedMax / tickCount) * i;
            const y = this.chartPaddingTop + this.innerHeight - (val / nicedMax) * this.innerHeight;
            this.yTicks.push({ value: val, y, label: this.formatValue(val) });
        }
    }

    private computePieChart(): void {
        const series = this.chartOptions.series;
        this.total = series.reduce((acc, s) => acc + s.value, 0);
        const cx = 180;
        const cy = 160;
        const r = 130;

        let currentAngle = -Math.PI / 2;
        this.pieSlices = series.map((s) => {
            const percent = s.value / this.total;
            const startAngle = currentAngle;
            const endAngle = currentAngle + percent * 2 * Math.PI;
            currentAngle = endAngle;

            const midAngle = (startAngle + endAngle) / 2;
            const labelR = r * 0.65;
            const labelX = cx + Math.cos(midAngle) * labelR;
            const labelY = cy + Math.sin(midAngle) * labelR;

            const path = this.describeArc(cx, cy, r, startAngle, endAngle);
            return { name: s.name, value: s.value, color: s.color, percent, startAngle, endAngle, path, labelX, labelY };
        });
    }

    private describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    private niceMax(val: number): number {
        if (val <= 0) return 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(val)));
        const normalized = val / magnitude;
        let nice: number;
        if (normalized <= 1) nice = 1;
        else if (normalized <= 2) nice = 2;
        else if (normalized <= 5) nice = 5;
        else nice = 10;
        return nice * magnitude;
    }

    private formatValue(v: number): string {
        if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
        if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
        return v % 1 === 0 ? v.toString() : v.toFixed(1);
    }

    formatPercent(v: number): string {
        return (v * 100).toFixed(1) + '%';
    }

    onHover(index: number): void {
        this.hoveredIndex = index;
    }

    onLeave(): void {
        this.hoveredIndex = -1;
    }

    trackByIndex(index: number): number {
        return index;
    }
}
