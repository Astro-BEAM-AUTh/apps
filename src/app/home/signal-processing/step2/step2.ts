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
  selector: 'app-step2',
  imports: [],
  templateUrl: './step2.html',
  styleUrl: './step2.scss'
})

export class Step2 implements AfterViewInit, OnDestroy {

  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  // Match your Python settings
  numSamples = 500;
  centerFreq = 1420;   // MHz
  bandwidth = 4;       // MHz

  ngAfterViewInit(): void {
    const freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
      this.centerFreq + this.bandwidth / 2,
      this.numSamples);
    const zeros = new Array(freqs.length).fill(0);

    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: freqs.map(f => f.toFixed(3)), // label each x tick with MHz
        datasets: [
          {
            label: 'Relative Power (a.u.)',
            data: zeros,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0,            // straight line
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2.2,
        plugins: {
          title: {
            display: true,
            text: 'Step 2',
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              // Show (freq, power) like matplotlib would
              title: (items) => items.length ? `Frequency: ${freqs[items[0].dataIndex].toFixed(6)} MHz` : '',
              label: () => 'Relative Power: 0',
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Frequency (MHz)' },
            ticks: {
              maxTicksLimit: 10,   // fewer ticks—readable axis
            },
          },
          y: {
            title: { display: true, text: 'Relative Power (a.u.)' },
            suggestedMin: -1,
            suggestedMax: 1,
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
