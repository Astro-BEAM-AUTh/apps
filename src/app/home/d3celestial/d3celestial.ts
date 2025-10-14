import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

import { distinctUntilChanged } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTimepickerModule, provideNativeDateTimeAdapter } from "@dhutaryan/ngx-mat-timepicker";
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { FormControl } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import {
  MtxCalendarView,
  MtxDatetimepickerMode,
  MtxDatetimepickerModule,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';

declare const d3: any;
declare const Celestial: any;

@Component({
  selector: 'app-d3celestial',
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTooltipModule,
    MatTimepickerModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatProgressSpinnerModule,

    MtxDatetimepickerModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    provideNativeDateTimeAdapter(),
    provideMomentDatetimeAdapter({
      parse: {
        dateInput: 'YYYY-MM-DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY-MM-DD HH:mm',
      },
      display: {
        dateInput: 'YYYY-MM-DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY-MM-DD HH:mm',
        monthYearLabel: 'YYYY MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'MMM DD, ddd',
      },
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './d3celestial.html',
  styleUrl: './d3celestial.scss'
})

export class D3celestial implements AfterViewInit {

  loading = false
  rebuild = false

  @ViewChild('celestialMap', { static: true }) celestialMap!: ElementRef<HTMLDivElement>;

  optionsForm: FormGroup;
  width = 0
  projection = 'aitoff'
  transform = 'equatorial'


  constructor(
    private formBuilder: FormBuilder
  ) {
    this.optionsForm = this.formBuilder.group({

      projection: this.projection,
      lon: 0,
      lat: 0,
      date: [new Date().toISOString().substr(0, 10)], // yyyy-MM-dd
      time: [new Date().toTimeString().substr(0, 5)], // HH:mm
      datetime: new Date(),

      // COORDINATES
      transform: this.transform,
      // CENTER
      centerx: 0,
      centery: 0,
      // ORIENTATION
      centerz: 0,

      // PLANETS
      planets: true,

      // LINES
      graticule: true,
      equatorial: true,
      ecliptic: true,
      galactic: false,
      supergalactic: false,
      // OTHER
      mw: true
    });
    this.optionsForm.valueChanges.subscribe(options => {
      console.log(options);
      this.update();
    });



    // window.addEventListener('resize', (event) => {
    //   console.log(event);
    //   this.update();
    // });
  };

  ngAfterViewInit() {
    this.init();
  };

  init() {
    var config = this.buildConfig();
    Celestial.display(config);
  };

  update() {
    var config = this.buildConfig();
    if (this.rebuild) {
      Celestial.display(config);
      this.rebuild
    } else {
      Celestial.apply(config);
    }

    // Celestial.rotate({
    //   center: [
    //     this.optionsForm.value["centerx"],
    //     this.optionsForm.value["centery"],
    //     this.optionsForm.value["centerz"]
    //   ]
    // })

    // Celestial.location([
    //   this.optionsForm.value['lat'],
    //   this.optionsForm.value['lon']
    // ])

  };

  buildConfig() {
    var cfg: any = {

      // DATA
      datapath: 'celestial/data/',

      // SETTINGS
      form: false,

      // CONTAINER
      container: this.celestialMap.nativeElement.id,
      width: this.celestialMap.nativeElement.clientWidth - 3,
      height: this.celestialMap.nativeElement.offsetHeight - 0.5,
      projectionRatio: (this.celestialMap.nativeElement.clientWidth - 3) / (this.celestialMap.nativeElement.offsetHeight - 0.5),

      // LOCATION
      // geopos: [
      //   this.optionsForm.value["lat"],
      //   this.optionsForm.value["lon"],
      // ],

      // DATE/TIME

      // PROJECTION
      projection: this.optionsForm.value["projection"], // 'aitoff'

      // COORDINATES
      transform: this.optionsForm.value["transform"], // 'equatorial'
      center: [
        this.optionsForm.value["centerx"],
        this.optionsForm.value["centery"],
        this.optionsForm.value["centerz"]
      ],

      // SUN
      planets: {  //Show planet locations, if date-time is set
        show: this.optionsForm.value["planets"],
        // List of all objects to show
        which: ["sol", "mer", "ven", "ter", "lun", "mar", "jup", "sat", "ura", "nep"],
        // Font styles for planetary symbols
        symbols: {  // Character and color for each symbol in 'which' above (simple circle: \u25cf), optional size override for Sun & Moon
          "sol": { symbol: "\u2609", letter: "Su", fill: "#ffff00", size: "" },
          "mer": { symbol: "\u263f", letter: "Me", fill: "#cccccc" },
          "ven": { symbol: "\u2640", letter: "V", fill: "#eeeecc" },
          "ter": { symbol: "\u2295", letter: "T", fill: "#00ccff" },
          "lun": { symbol: "\u25cf", letter: "L", fill: "#ffffff", size: "" }, // overridden by generated crecent, except letter & size
          "mar": { symbol: "\u2642", letter: "Ma", fill: "#ff6600" },
          "cer": { symbol: "\u26b3", letter: "C", fill: "#cccccc" },
          "ves": { symbol: "\u26b6", letter: "Ma", fill: "#cccccc" },
          "jup": { symbol: "\u2643", letter: "J", fill: "#ffaa33" },
          "sat": { symbol: "\u2644", letter: "Sa", fill: "#ffdd66" },
          "ura": { symbol: "\u2645", letter: "U", fill: "#66ccff" },
          "nep": { symbol: "\u2646", letter: "N", fill: "#6666ff" },
          "plu": { symbol: "\u2647", letter: "P", fill: "#aaaaaa" },
          "eri": { symbol: "\u26aa", letter: "E", fill: "#eeeeee" }
        },
        symbolStyle: {
          fill: "#00ccff", font: "bold 17px 'Lucida Sans Unicode', Consolas, sans-serif",
          align: "center", baseline: "middle"
        },
        symbolType: "symbol",  // Type of planet symbol: 'symbol' graphic planet sign, 'disk' filled circle scaled by magnitude
        // 'letter': 1 or 2 letters S Me V L Ma J S U N     
        names: true,          // Show name in nameType language next to symbol
        nameStyle: { fill: "#00ccff", font: "14px 'Lucida Sans Unicode', Consolas, sans-serif", align: "right", baseline: "top" },
        namesType: "desig"     // Language of planet name (see list below of language codes available for planets), 
        // or desig = 3-letter designation
      },

      // LINES
      lines: {
        graticule: {
          show: this.optionsForm.value["graticule"], stroke: "#cccccc", width: 0.6, opacity: 0.8,
          lon: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" },
          lat: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" }
        },
        equatorial: { show: this.optionsForm.value["equatorial"], stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },
        ecliptic: { show: this.optionsForm.value["ecliptic"], stroke: "#66cc66", width: 1.3, opacity: 0.7 },
        galactic: { show: this.optionsForm.value["galactic"], stroke: "#cc6666", width: 1.3, opacity: 0.7 },
        supergalactic: { show: this.optionsForm.value["supergalactic"], stroke: "#cc66cc", width: 1.3, opacity: 0.7 }
      },

      // OTHER
      mw: {
        show: this.optionsForm.value["mw"],
        style: { fill: "#ffffff", opacity: 0.15 }
      },

    };
    return cfg;
  }

  here() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (res) => {
          this.optionsForm.controls['lat'].setValue(
            Math.round(res.coords.latitude * 1000000) / 1000000
          );
          this.optionsForm.controls['lon'].setValue(
            Math.round(res.coords.longitude * 1000000) / 1000000
          );
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    };
  };

  now() {
    this.optionsForm.controls['datetime'].setValue(new Date());
  };

}
