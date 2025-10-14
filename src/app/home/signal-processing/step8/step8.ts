import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import type { Layout, PlotData, Config } from 'plotly.js';

@Component({
  selector: 'app-step8',
  imports: [PlotlyModule],
  templateUrl: './step8.html',
  styleUrl: './step8.scss'
})

export class Step8 {
  // ---- Base parameters from earlier steps ----
  numSamples = 500;
  numSamples2 = this.numSamples * 2;

  centerFreq = 1420;
  bandwidth = 4;
  numSegments = 100;

  // Spectral line params
  lineCenter = 1420.0;
  lineWidth = 0.05;
  lineAmplitude = 0.5;

  // Derived arrays (doubled resolution)
  freqs2 = this.linspace(this.centerFreq - this.bandwidth / 2,
    this.centerFreq + this.bandwidth / 2,
    this.numSamples2);

  spectral2 = this.freqs2.map(f =>
    this.lineAmplitude * Math.exp(-0.5 * Math.pow((f - this.lineCenter) / this.lineWidth, 2))
  );

  spectral2Waterfall: number[][] = [];
  spectral2Mean: number[] = [];

  // ---- Plotly bindings ----
  heatmapData: Partial<PlotData>[] = [];
  heatmapLayout: Partial<Layout> = {
    title: { text: 'Spectral2 — Waterfall (2× samples)' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Time segment' } },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 520,
  };

  lineData: Partial<PlotData>[] = [];
  lineLayout: Partial<Layout> = {
    title: { text: 'Spectral Line 2' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Relative Power (a.u.)' } },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 420,
    legend: { x: 0, y: 1 },
  };

  plotConfig: Partial<Config> = { responsive: true, displayModeBar: false };

  constructor() { this.generate(); }

  regenerate(): void { this.generate(); }

  private generate(): void {
    // spectral2_waterfall = spectral2 + N(0, 0.10)
    const rows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(0, 0.10, this.numSamples2);
      rows.push(this.spectral2.map((x, i) => x + noise[i]));
    }
    this.spectral2Waterfall = rows;
    this.spectral2Mean = this.meanAcrossRows(rows);

    // Heatmap trace (Inferno)
    this.heatmapData = [{
      type: 'heatmap',
      z: rows,
      x: this.freqs2,
      y: Array.from({ length: this.numSegments }, (_, i) => i),
      colorscale: 'Inferno',
      colorbar: { title: { text: 'Relative Power (a.u.)' } },
      showscale: true,
      hovertemplate: 'f=%{x:.3f} MHz<br>t=%{y}<br>P=%{z:.3f}<extra></extra>',
    }];

    // Line plot traces (clean vs mean with noise)
    this.lineData = [
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Spectral Line 2 (without noise)',
        x: this.freqs2,
        y: this.spectral2,
        line: { width: 2 },
        hovertemplate: 'f=%{x:.3f} MHz<br>P=%{y:.3f}<extra></extra>',
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Spectral Waterfall 2 (mean with noise)',
        x: this.freqs2,
        y: this.spectral2Mean,
        line: { width: 2, dash: 'dash' },
        hovertemplate: 'f=%{x:.3f} MHz<br>P=%{y:.3f}<extra></extra>',
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
