# io-chart

A custom Angular chart component built as part of a Frontend Intern Assignment. It renders **Line**, **Column**, and **Pie** charts purely from a simple `ChartOptions` input — no third-party chart library involved.

The app also includes a **live playground** where you can change the chart type, edit the title, add/remove data series, and pick custom colors — all updating the chart in real time.

---

## Tech Stack

| Tech | Why |
|---|---|
| **Angular 21** (standalone components) | The assignment required Angular; standalone components keep things simple without needing NgModules |
| **TypeScript** | Type safety for the `ChartOptions` interface, helps catch mistakes early |
| **SCSS** | Easier to write nested styles and keep the component styles organized |
| **SVG (native)** | Charts are drawn directly with SVG inside the component template — no canvas, no external lib |

---

## Getting Started

### Prerequisites

- [Angular CLI](https://angular.dev/tools/cli) ≥ 21 (`npm install -g @angular/cli`)

### Run locally

```bash
# 1. Clone the repo
git clone https://github.com/aman2225/io-chart.git
cd io-chart

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
```

Open your browser at **http://localhost:4200**

---

## Usage

Pass a `ChartOptions` object to the `<io-chart>` component:

```ts
chartData: ChartOptions = {
  type: 'line',       // 'line' | 'column' | 'pie'
  title: 'Sales Report',
  series: [
    { name: 'Offline', value: 30, color: 'red' },
    { name: 'Online',  value: 70, color: 'blue' },
  ],
};
```

```html
<io-chart [chartOptions]="chartData"></io-chart>
```

---

## Screenshots

### Live Playground
![Live Playground](https://raw.githubusercontent.com/aman2225/io-chart/main/screenshots/playground.png)

### Line Chart
![Line Chart](https://raw.githubusercontent.com/aman2225/io-chart/main/screenshots/line.png)

### Column Chart
![Column Chart](https://raw.githubusercontent.com/aman2225/io-chart/main/screenshots/column.png)

### Pie Chart
![Pie Chart](https://raw.githubusercontent.com/aman2225/io-chart/main/screenshots/pie.png)
