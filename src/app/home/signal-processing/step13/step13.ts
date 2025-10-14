import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import type { Layout, PlotData, Config } from 'plotly.js';

@Component({
  selector: 'app-step13',
  imports: [PlotlyModule],
  templateUrl: './step13.html',
  styleUrl: './step13.scss'
})
export class Step13 {
  // ---- parameters ----
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
  N = 11;

  // Derived axes/signals
  freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
    this.centerFreq + this.bandwidth / 2,
    this.numSamples);
  background = this.freqs.map(f => -15 + 2 * Math.sin(f));
  spectral = this.freqs.map(f =>
    this.lineAmplitude * Math.exp(-0.5 * Math.pow((f - this.lineCenter) / this.lineWidth, 2))
  );

  onSegment: number[] = [];
  offSegment: number[] = [];
  calibrated: number[] = [];
  smooth: number[] = [];

  // Detection result
  peakFreq: number | null = null;
  peakValue: number | null = null;

  // Plotly
  plotData: Partial<PlotData>[] = [];
  layout: Partial<Layout> = {
    title: { text: 'Spectral Line Detection' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Relative Power (a.u.)' } },
    legend: { x: 0, y: 1 },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 460,
  };
  config: Partial<Config> = { responsive: true, displayModeBar: false };

  constructor() { this.generate(); }

  regenerate(): void { this.generate(); }

  private generate(): void {

    // OFF rows: background + noise
    const offRows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      offRows.push(this.background.map((b, i) => b + noise[i]));
    }
    this.offSegment = this.meanAcrossRows(offRows);

    // ON rows: background + spectral + noise
    const onRows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      onRows.push(this.background.map((b, i) => b + this.spectral[i] + noise[i]));
    }
    this.onSegment = this.meanAcrossRows(onRows);

    // Calibrated (difference) + moving average (same length)
    this.calibrated = this.onSegment.map((on, i) => on - this.offSegment[i]);
    const kernel = Array.from({ length: this.N }, () => 1 / this.N);
    this.smooth = this.convolveSame(this.calibrated, kernel);

    // ---- Detect peak in 1419–1421 MHz window ----
    const lo = 1419, hi = 1421;
    const idxs: number[] = [];
    for (let i = 0; i < this.freqs.length; i++) if (this.freqs[i] > lo && this.freqs[i] < hi) idxs.push(i);

    if (idxs.length) {
      let bestIdx = idxs[0];
      let bestVal = this.smooth[bestIdx];
      for (const i of idxs) {
        if (this.smooth[i] > bestVal) { bestVal = this.smooth[i]; bestIdx = i; }
      }
      this.peakFreq = this.freqs[bestIdx];
      this.peakValue = bestVal;
    } else {
      this.peakFreq = null;
      this.peakValue = null;
    }

    // ---- Build plot ----
    const vline: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines',
      name: '1420 MHz',
      x: [1420, 1420],
      y: [Math.min(...this.smooth), Math.max(...this.smooth)],
      line: { dash: 'dash' },
      hoverinfo: 'skip',
    };

    const smoothed: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines',
      name: 'Smoothed',
      x: this.freqs,
      y: this.smooth,
      hovertemplate: 'f=%{x:.3f} MHz<br>P=%{y:.4f}<extra></extra>',
    };

    const peakPoint: Partial<PlotData> = this.peakFreq !== null ? {
      type: 'scatter',
      mode: 'markers',
      name: 'Peak',
      x: [this.peakFreq],
      y: [this.peakValue!],
      marker: { size: 10 },
      hovertemplate: 'Peak<br>f=%{x:.6f} MHz<br>P=%{y:.4f}<extra></extra>',
    } : { type: 'scatter', x: [], y: [] };

    this.plotData = [smoothed, vline, peakPoint];
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

  // numpy-like conv with mode='same'
  private convolveSame(x: number[], k: number[]): number[] {
    const n = x.length, m = k.length;
    const yFull = new Array(n + m - 1).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) yFull[i + j] += x[i] * k[j];
    const start = Math.floor((m - 1) / 2);
    return yFull.slice(start, start + n);
  }
  
}
