import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import type { Layout, PlotData, Config } from 'plotly.js';

@Component({
  selector: 'app-step9',
  imports: [PlotlyModule],
  templateUrl: './step9.html',
  styleUrl: './step9.scss'
})

export class Step9 {

  // ---- Parameters (same as your earlier steps) ----
  numSamples = 500;
  centerFreq = 1420;
  bandwidth = 4;

  mean = 0;
  stDeviation = 0.05;
  numSegments = 100;

  // Spectral line
  lineCenter = 1420.0;
  lineWidth = 0.05;
  lineAmplitude = 0.5;

  // Derived arrays
  freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
    this.centerFreq + this.bandwidth / 2,
    this.numSamples);
  background = this.freqs.map(f => -15 + 2 * Math.sin(f)); // radians
  spectral = this.freqs.map(f =>
    this.lineAmplitude * Math.exp(-0.5 * Math.pow((f - this.lineCenter) / this.lineWidth, 2))
  );

  // Outputs
  offSegment: number[] = [];
  onSegment: number[] = [];

  // Plotly bindings
  lineData: Partial<PlotData>[] = [];
  lineLayout: Partial<Layout> = {
    title: { text: 'On and Off' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Relative Power (a.u.)' } },
    legend: { x: 0, y: 1 },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 420,
  };
  plotConfig: Partial<Config> = { responsive: true, displayModeBar: false };

  constructor() { this.generate(); }

  regenerate(): void { this.generate(); }

  private generate(): void {
    // Build OFF waterfall: background + noise
    const offRows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      offRows.push(this.background.map((b, i) => b + noise[i]));
    }
    this.offSegment = this.meanAcrossRows(offRows);

    // Build ON waterfall: background + spectral + noise
    const onRows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      onRows.push(this.background.map((b, i) => b + this.spectral[i] + noise[i]));
    }
    this.onSegment = this.meanAcrossRows(onRows);

    // Line plot (match your matplotlib labels/colors)
    this.lineData = [
      {
        type: 'scatter',
        mode: 'lines',
        name: 'On',
        x: this.freqs,
        y: this.onSegment,
        line: { width: 2 },
        hovertemplate: 'f=%{x:.3f} MHz<br>P=%{y:.4f}<extra></extra>',
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Off',
        x: this.freqs,
        y: this.offSegment,
        line: { width: 2, color: 'orange' as any },
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

}
