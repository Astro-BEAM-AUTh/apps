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

  @ViewChild('celestialMap', { static: true }) celestialMap!: ElementRef<HTMLDivElement>;

  optionsForm: FormGroup;

  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twelvehour = false;
  timeInterval = 1;
  timeInput = true;
  timeInputAutoFocus = true;
  customHeader!: any;
  actionButtons = false;
  showWeekNumbers = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.optionsForm = this.formBuilder.group({
      projection: 'aitoff',
      coordinates: 'equatorial',
      // transform: [true],
      centerLon: [0],
      centerLat: [0],
      date: [new Date().toISOString().substr(0, 10)], // yyyy-MM-dd
      time: [new Date().toTimeString().substr(0, 5)], // HH:mm
      datetime: new Date(),
      graticule: true,
      equator: true,
      ecliptic: true,
      galacticPlane: false,
      supergalacticPlane: false,
    });


    // TIME
    const timeControl = this.optionsForm.get('datetime');
    if (!timeControl) {
      throw new Error('Control not found');
    }
    timeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((time) => {
        console.log(time)
      });


  }



  ngAfterViewInit() {
    this.initCelestial();
  }

  private initCelestial() {
    var cfg: any = {
      container: this.celestialMap.nativeElement.id,
      width: this.celestialMap.nativeElement.clientWidth - 5,
      height: this.celestialMap.nativeElement.offsetHeight,
      datapath: 'celestial/data/',
      form: false,
      projection: 'aitoff',
      transform: 'equatorial'
    };
    Celestial.display(cfg);
  }

  here() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (res) => {
          this.optionsForm.controls['centerLat'].setValue(
            Math.round(res.coords.latitude * 1000000) / 1000000
          );
          this.optionsForm.controls['centerLon'].setValue(
            Math.round(res.coords.longitude * 1000000) / 1000000
          );
          console.log(this.optionsForm.value.centerLat, this.optionsForm.value.centerLon)

          this.changeCenter()
        },
        (err) => {
          console.log(err)
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  }

  changeCenter() {
    console.log(this.optionsForm.value['centerLat'],
      this.optionsForm.value['centerLon'])
    Celestial.location([
      this.optionsForm.value['centerLat'],
      this.optionsForm.value['centerLon']
    ])
  }

  changeProjection() {
    Celestial.reproject({
      projection: this.optionsForm.value['projection']
    })
  }

  now() {
    this.optionsForm.controls['datetime'].setValue(new Date());
  }


  // Celestial.rotate({center:[long,lat,orient]})








  run() {
    console.log(this.optionsForm)
  }

}
