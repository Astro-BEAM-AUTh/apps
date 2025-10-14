import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-step4',
  imports: [],
  templateUrl: './step4.html',
  styleUrl: './step4.scss'
})

export class Step4 implements AfterViewInit, OnDestroy {

  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  // Parameters to match your Python
  numSamples = 500;
  centerFreq = 1420;   // MHz
  bandwidth = 4;       // MHz
  mean = 0;            // μ
  stDeviation = 0.05;  // σ

  private freqs: number[] = [];
  private background: number[] = [];

  ngAfterViewInit(): void {
    this.freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
      this.centerFreq + this.bandwidth / 2,
      this.numSamples);

    // background = -15 + 2*sin(freqs)  (radians, like NumPy)
    this.background = this.freqs.map(f => -15 + 2 * Math.sin(f));

    const offSegment = this.addNoise(this.background, this.mean, this.stDeviation);

    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.freqs.map(f => f.toFixed(3)),
        datasets: [
          {
            label: 'Background signal',
            data: this.background,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0,
            borderDash: [6, 6],
          },
          {
            label: 'OFF: Background + noise',
            data: offSegment,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Step 4' },
          legend: { display: true },
          tooltip: {
            callbacks: {
              title: (items) =>
                items.length ? `Frequency: ${this.freqs[items[0].dataIndex].toFixed(6)} MHz` : '',
              label: (item) => `${item.dataset.label}: ${item.parsed.y.toFixed(4)}`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Frequency (MHz)' },
            ticks: { maxTicksLimit: 10 },
          },
          y: {
            title: { display: true, text: 'Relative Power (a.u.)' },
          },
        },
      },
    };

    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d')!, cfg);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  // Rerun the Gaussian noise (like np.random.seed(None) → new noise each click)
  rerunNoise(): void {
    if (!this.chart) return;
    const off = this.addNoise(this.background, this.mean, this.stDeviation);
    this.chart.data.datasets[1].data = off;
    this.chart.update();
  }

  // ---- helpers ----
  private linspace(start: number, end: number, num: number): number[] {
    if (num <= 1) return [start];
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  }

  // Generate N(μ, σ) with Box–Muller; no seed → non-deterministic like seed(None)
  private normal(mean = 0, std = 1): number {
    let u = 0, v = 0;
    // avoid 0
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v); // ~ N(0,1)
    return mean + std * z;
  }

  private addNoise(signal: number[], mean: number, std: number): number[] {
    return signal.map(x => x + this.normal(mean, std));
  }

}
