import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Dashboard } from './home/dashboard/dashboard';
import { D3celestial } from './home/d3celestial/d3celestial';
import { WaveformFitterComponent } from './home/waveform-fitter/waveform-fitter.component'
import { StellariumComponent } from './home/stellarium/stellarium.component';

export const routes: Routes = [

    // Define main routes
    {
        path: 'home', component: Home,
        children:
            [
                { path: '', component: Dashboard },
                { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
                { path: 'd3celestial', component: D3celestial },
                { path: 'waveform-fitter', component: WaveformFitterComponent },
                { path: 'stellarium', component: StellariumComponent },
            ]
    },

    // Redirect root path '' to '/home'
    { path: '', redirectTo: '/home', pathMatch: 'full' },

];
