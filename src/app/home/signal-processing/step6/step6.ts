import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import type { Layout, PlotData, Config } from 'plotly.js';

@Component({
  selector: 'app-step6',
  imports: [PlotlyModule],
  templateUrl: './step6.html',
  styleUrl: './step6.scss'
})

export class Step6 {
  
  // -------- Parameters (match your Python) --------
  numSamples = 500;      // Step 1
  centerFreq = 1420;     // Step 2
  bandwidth = 4;

  mean = 0;              // Step 4
  stDeviation = 0.05;

  numSegments = 100;     // Step 5 & 6

  // Spectral line params
  lineCenter = 1420.0;
  lineWidth = 0.05;
  lineAmplitude = 0.5;

  // -------- Derived series --------
  freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
    this.centerFreq + this.bandwidth / 2,
    this.numSamples);
  background = this.freqs.map(f => -15 + 2 * Math.sin(f)); // radians, like NumPy
  spectral = this.freqs.map(f =>
    this.lineAmplitude * Math.exp(-0.5 * Math.pow((f - this.lineCenter) / this.lineWidth, 2))
  );

  // Waterfall (ON)
  waterfallOn: number[][] = [];
  onSegment: number[] = [];

  // -------- Plotly bindings --------
  heatmapData: Partial<PlotData>[] = [];
  heatmapLayout: Partial<Layout> = {
    title: { text: 'Step 5 & 6 — Waterfall (ON)' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Time segment' } },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 520,
  };

  lineData: Partial<PlotData>[] = [];
  lineLayout: Partial<Layout> = {
    title: { text: 'Spectral (ON Signal)' },
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
    // ---- Build ON waterfall: background + spectral + fresh noise each row ----
    const rows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      rows.push(this.background.map((x, i) => x + this.spectral[i] + noise[i]));
    }
    this.waterfallOn = rows;
    this.onSegment = this.meanAcrossRows(rows);

    // ---- Heatmap trace (Inferno colors) ----
    this.heatmapData = [{
      type: 'heatmap',
      z: rows,
      x: this.freqs,
      y: Array.from({ length: this.numSegments }, (_, i) => i),
      colorscale: 'Inferno',
      colorbar: { title: { text: 'Relative Power' } },
      showscale: true,
      hovertemplate: 'f=%{x:.3f} MHz<br>t=%{y}<br>P=%{z:.3f}<extra></extra>',
    }];

    // ---- Line plot traces ----
    const spectralOnlyShifted = this.spectral.map(v => v - 15); // match your matplotlib example
    const bgPlusSpectral = this.background.map((b, i) => b + this.spectral[i]);

    this.lineData = [
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Background',
        x: this.freqs,
        y: this.background,
        line: { dash: 'dash' },
        hovertemplate: 'f=%{x:.3f} MHz<br>Power=%{y:.3f}<extra></extra>',
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Spectral line',
        x: this.freqs,
        y: spectralOnlyShifted,
        hovertemplate: 'f=%{x:.3f} MHz<br>Power=%{y:.3f}<extra></extra>',
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Background + Spectral',
        x: this.freqs,
        y: bgPlusSpectral,
        hovertemplate: 'f=%{x:.3f} MHz<br>Power=%{y:.3f}<extra></extra>',
      },
    ];
  }

  // -------- helpers --------
  private linspace(start: number, end: number, num: number): number[] {
    if (num <= 1) return [start];
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  }

  // Box–Muller
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
