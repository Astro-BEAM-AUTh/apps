import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WaveformFitterComponent } from './home/waveform-fitter/waveform-fitter.component';
import { StellariumComponent } from './home/stellarium/stellarium.component';
import { D3celestialComponent } from './home/d3celestial/d3celestial.component';
import { SignalProcessingComponent } from './home/signal-processing/signal-processing.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';

export const routes: Routes = [

  // Define main routes
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'waveform-fitter', component: WaveformFitterComponent },
      { path: 'stellarium', component: StellariumComponent },
      { path: 'd3celestial', component: D3celestialComponent },
      { path: 'signal-processing', component: SignalProcessingComponent },
    ]
  },

  // Redirect root path '' to '/home'
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];
