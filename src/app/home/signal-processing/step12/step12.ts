import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import type { Layout, PlotData, Config } from 'plotly.js';

@Component({
  selector: 'app-step12',
  imports: [PlotlyModule],
  templateUrl: './step12.html',
  styleUrl: './step12.scss'
})

export class Step12 {
  // ---- Parameters (same as earlier steps) ----
  numSamples = 500;
  centerFreq = 1420;
  bandwidth = 4;
  numSegments = 100;

  mean = 0;
  stDeviation = 0.05;

  // Spectral line
  lineCenter = 1420.0;
  lineWidth = 0.05;
  lineAmplitude = 0.5;

  // Moving average
  N = 11; // kernel length

  // Derived arrays
  freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
    this.centerFreq + this.bandwidth / 2,
    this.numSamples);
  background = this.freqs.map(f => -15 + 2 * Math.sin(f)); // radians
  spectral = this.freqs.map(f =>
    this.lineAmplitude * Math.exp(-0.5 * Math.pow((f - this.lineCenter) / this.lineWidth, 2))
  );

  // Outputs
  onSegment: number[] = [];
  offSegment: number[] = [];
  calibrated: number[] = [];       // ON - OFF
  smoothed: number[] = [];         // moving-average of calibrated

  // Plotly bindings
  plotData: Partial<PlotData>[] = [];
  layout: Partial<Layout> = {
    title: { text: '2.3 Moving Average on Calibrated Signal' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Relative Power (a.u.)' } },
    legend: { x: 0, y: 1 },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 520,
  };
  config: Partial<Config> = { responsive: true, displayModeBar: false };

  constructor() { this.generate(); }

  regenerate(): void { this.generate(); }

  private generate(): void {
    // OFF = background + noise (time-mean)
    const offRows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      offRows.push(this.background.map((b, i) => b + noise[i]));
    }
    this.offSegment = this.meanAcrossRows(offRows);

    // ON = background + spectral + noise (time-mean)
    const onRows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      onRows.push(this.background.map((b, i) => b + this.spectral[i] + noise[i]));
    }
    this.onSegment = this.meanAcrossRows(onRows);

    // Calibrated (difference), then moving average with zero-padding like numpy.convolve(..., 'same')
    this.calibrated = this.onSegment.map((on, i) => on - this.offSegment[i]);

    const kernel = Array.from({ length: this.N }, () => 1 / this.N);
    this.smoothed = this.convolveSame(this.calibrated, kernel);

    // Plot (Calibrated + Smoothed)
    this.plotData = [
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Calibrated',
        x: this.freqs,
        y: this.calibrated,
        line: { width: 2 },
        opacity: 0.7,
        hovertemplate: 'f=%{x:.3f} MHz<br>P=%{y:.4f}<extra></extra>',
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Smoothed',
        x: this.freqs,
        y: this.smoothed,
        line: { width: 2, color: 'red' as any },
        hovertemplate: 'f=%{x:.3f} MHz<br>P=%{y:.4f}<extra></extra>',
      },
    ];
  }

  // ---- helpers ----
  private linspace(start: number, end: number, num: number): number[] {
    if (num <= 1) return [start];
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  }

  // Box–Muller Gaussian
  private normal(mean = 0, std = 1): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return mean + std * z;
  }
  private normalArray(mean: number, std: number, n: number): number[] {
    return Array.from({ length: n }, () => this.normal(mean, std));
  }
  private meanAcrossRows(rows: number[][]): number[] {
    const cols = rows[0].length;
    const out = new Array(cols).fill(0);
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < cols; c++) out[c] += row[c];
    }
    for (let c = 0; c < cols; c++) out[c] /= rows.length;
    return out;
  }

  // Convolution with 'same' length (zero-padding at both ends, like numpy.convolve(..., 'same'))
  private convolveSame(x: number[], k: number[]): number[] {
    const n = x.length, m = k.length;
    const yFull = new Array(n + m - 1).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        yFull[i + j] += x[i] * k[j];
      }
    }
    const start = Math.floor((m - 1) / 2);
    return yFull.slice(start, start + n);
  }
}
