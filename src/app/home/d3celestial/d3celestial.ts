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
  ],
  providers: [
    provideNativeDateAdapter(),
    provideNativeDateTimeAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './d3celestial.html',
  styleUrl: './d3celestial.scss'
})

export class D3celestial implements AfterViewInit {

  @ViewChild('celestialMap', { static: true }) celestialMap!: ElementRef<HTMLDivElement>;

  optionsForm: FormGroup;

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
      datetime: [new Date()],


      graticule: true,
      equator: true,
      ecliptic: true,
      galacticPlane: false,
      supergalacticPlane: false,

    });

    // LOCATION
    // const centerLonControl = this.optionsForm.get('centerLon');
    // if (!centerLonControl) {
    //   throw new Error('Control not found');
    // }
    // centerLonControl.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(() => {
    //     this.changeCenter()
    //   });
    // const centerLatControl = this.optionsForm.get('centerLat');
    // if (!centerLatControl) {
    //   throw new Error('Control not found');
    // }
    // centerLatControl.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(() => {
    //     this.changeCenter()
    //   });

    // TIME
    const timeControl = this.optionsForm.get('datetime');
    if (!timeControl) {
      throw new Error('Control not found');
    }
    timeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((time) => {
        console.log(time.toTimeString().substr(0, 5))
      });


  }

  ngAfterViewInit() {
    this.initCelestial();
  }

  private initCelestial() {
    var cfg: any = {
      container: this.celestialMap.nativeElement.id,
      width: this.celestialMap.nativeElement.clientWidth -5,
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
          this.optionsForm.controls['centerLat'].setValue(res.coords.latitude);
          this.optionsForm.controls['centerLon'].setValue(res.coords.longitude);
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
    this.optionsForm.controls['date'].setValue(new Date().toISOString().substr(0, 10));
    this.optionsForm.controls['datetime'].setValue(new Date());
  }


  // Celestial.rotate({center:[long,lat,orient]})








  run() {
    console.log(this.optionsForm)
  }

}
