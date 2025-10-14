import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import type { Layout, Config, PlotData } from 'plotly.js';


@Component({
  selector: 'app-step5',
  imports: [
    PlotlyModule
  ],
  templateUrl: './step5.html',
  styleUrl: './step5.scss'
})

export class Step5 {

  // --- parameters (match your Python) ---
  numSamples = 500;
  centerFreq = 1420;   // MHz
  bandwidth = 4;       // MHz

  mean = 0;            // μ
  stDeviation = 0.05;  // σ
  numSegments = 100;   // time segments

  // computed series
  freqs = this.linspace(this.centerFreq - this.bandwidth / 2,
    this.centerFreq + this.bandwidth / 2,
    this.numSamples);
  background = this.freqs.map(f => -15 + 2 * Math.sin(f)); // radians, like NumPy

  waterfallOff: number[][] = [];
  offSegment: number[] = [];

  // plotly bindings
  plotData: Partial<PlotData>[] = [];
  layout: Partial<Layout> = {
    title: { text: 'Step 5 & 6' },
    xaxis: { title: { text: 'Frequency (MHz)' } },
    yaxis: { title: { text: 'Time segment' } },
    margin: { l: 60, r: 40, t: 40, b: 50 },
    height: 520,
    // coloraxis: { colorscale: 'Inferno', colorbar: { title: 'Relative Power' } },
  };
  config: Partial<Config> = { responsive: true, displayModeBar: false };

  constructor(

  ) {
    this.generate();
  }

  regenerate() { this.generate(); }

  private generate(): void {
    // Build waterfall_off: each row = background + fresh Gaussian noise
    const rows: number[][] = [];
    for (let s = 0; s < this.numSegments; s++) {
      const noise = this.normalArray(this.mean, this.stDeviation, this.numSamples);
      rows.push(this.background.map((x, i) => x + noise[i]));
    }
    this.waterfallOff = rows;

    // OFF segment = mean over time (not shown, but computed like your code)
    this.offSegment = this.meanAcrossRows(rows);

    // Prepare Plotly heatmap (z is [rows][cols] with rows = time, cols = frequency)
    this.plotData = [{
      type: 'heatmap',
      z: rows,
      x: this.freqs,
      y: Array.from({ length: this.numSegments }, (_, i) => i),
      // coloraxis: 'coloraxis',           // use layout.coloraxis for 'Inferno'
      colorscale: 'Inferno',  // <- here instead of layout.coloraxis
      colorbar: { title: { text: 'Relative Power' } },
      showscale: true,
      hovertemplate: 'f=%{x:.3f} MHz<br>t=%{y}<br>P=%{z:.3f}<extra></extra>',
    }];
  }

  // ---- helpers ----
  private linspace(start: number, end: number, num: number): number[] {
    if (num <= 1) return [start];
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  }

  // Box–Muller Gaussian sample
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
