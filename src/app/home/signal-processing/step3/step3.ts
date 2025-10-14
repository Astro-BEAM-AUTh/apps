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
  selector: 'app-step3',
  imports: [],
  templateUrl: './step3.html',
  styleUrl: './step3.scss'
})

export class Step3 {

  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  // Match your Python parameters
  numSamples = 500;
  centerFreq = 1420;   // MHz
  bandwidth = 4;       // MHz

  ngAfterViewInit(): void {
    const freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
      this.centerFreq + this.bandwidth / 2,
      this.numSamples);

    // Step 2 reference (flat zeros)
    const zeros = new Array(freqs.length).fill(0);

    // Step 3 background: -15 + 2*sin(freqs)
    // Note: same as NumPy — argument to sin is in radians, using the MHz values directly.
    const background = freqs.map(f => -15 + 2 * Math.sin(f));

    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: freqs.map(f => f.toFixed(3)),
        datasets: [
          {
            label: 'Background signal',
            data: background,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0,
          },
          // {
          //   label: 'Flat baseline (Step 2)',
          //   data: zeros,
          //   borderWidth: 1,
          //   pointRadius: 0,
          //   tension: 0,
          //   borderDash: [6, 6],
          // },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Step 3' },
          legend: { display: true },
          tooltip: {
            callbacks: {
              title: (items) =>
                items.length ? `Frequency: ${freqs[items[0].dataIndex].toFixed(6)} MHz` : '',
              label: (item) => `Relative Power: ${item.parsed.y.toFixed(3)}`,
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

  private linspace(start: number, end: number, num: number): number[] {
    if (num <= 1) return [start];
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  }

}
