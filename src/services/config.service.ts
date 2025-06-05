import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})

export class configService {

    apps = [
        {
            title: 'Dashboard',
            subtitle: '.',
            icon: 'home',
            url: 'dashboard',
            active: true
        },
        {
            title: 'Waveform Fitter',
            subtitle: '.',
            icon: 'show_chart',
            url: 'waveform-fitter',
            active: true
        },
        {
            title: 'Stellarium',
            subtitle: '.',
            icon: 'hotel_class',
            url: 'stellarium',
            active: true
        },
        {
            title: 'D3 Celestial',
            subtitle: 'Simplified version',
            icon: 'stars',
            url: 'd3celestial',
            active: true
        },
        {
            title: 'Signal Processing',
            subtitle: '.',
            icon: 'sensors',
            url: 'signal-processing',
            active: false
        }
    ]

}