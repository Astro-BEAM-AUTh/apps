import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; declare var Celestial: any;

@Component({
  selector: 'app-d3celestial',
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './d3celestial.component.html',
  styleUrl: './d3celestial.component.scss'
})

export class D3celestialComponent {

  optionsForm: FormGroup;
  showMore = false

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {
    this.optionsForm = this.fb.group({
      projection: ['azimuthal-equidistant'],
      transform: [true],
      centerLon: [0],
      centerLat: [0],
      date: [new Date().toISOString().substr(0, 10)],    // yyyy-MM-dd
      time: [new Date().toTimeString().substr(0, 5)]      // HH:mm
    });
  }

  config = {
    width: 0,           // Default width, 0 = full parent element width; 
    // height is determined by projection
    projection: "aitoff",    // Map projection used: see below
    projectionRatio: null,   // Optional override for default projection ratio
    transform: "equatorial", // Coordinate transformation: equatorial (default),
    // ecliptic, galactic, supergalactic
    center: null,       // Initial center coordinates in set transform
    // [longitude, latitude, orientation] all in degrees 
    // null = default center [0,0,0]
    orientationfixed: true,  // Keep orientation angle the same as center[2]
    geopos: null,       // optional initial geographic position [lat,lon] in degrees, 
    // overrides center
    follow: "zenith",   // on which coordinates to center the map, default: zenith, if location enabled, 
    // otherwise center
    zoomlevel: null,    // initial zoom level 0...zoomextend; 0|null = default, 1 = 100%, 0 < x <= zoomextend
    zoomextend: 10,     // maximum zoom level
    adaptable: true,    // Sizes are increased with higher zoom-levels
    interactive: true,  // Enable zooming and rotation with mousewheel and dragging
    form: "celestial-form",         // Display form for interactive settings. Needs a div with
    // id="celestial-form", created automatically if not present
    location: false,    // Display location settings. Deprecated, use formFields below
    formFields: {
      "location": true,  // Set visiblity for each group of fields with the respective id
      "general": true,
      "stars": true,
      "dsos": true,
      "constellations": true,
      "lines": true,
      "other": true,
      "download": true
    },
    advanced: true,     // Display fewer form fields if false 
    daterange: [],      // Calender date range; null: displaydate-+10; [n<100]: displaydate-+n; [yr]: yr-+10; 
    // [yr, n<100]: [yr-n, yr+n]; [yr0, yr1]  
    controls: true,     // Display zoom controls
    lang: "el",           // Global language override for names, any name setting that has the chosen language available
    // Default: desig or empty string for designations, other languages as used anywhere else
    culture: "",        // Source of constellations and star names, default "iau", other: "cn" Traditional Chinese
    container: "celestial-map",   // ID of parent element, e.g. div, null = html-body
    datapath: "celestial/data/",  // Path/URL to data files, empty = subfolder 'data'
    stars: {
      show: true,    // Show stars
      limit: 6,      // Show only stars brighter than limit magnitude
      colors: true,  // Show stars in spectral colors, if not use default color
      style: { fill: "#ffffff", opacity: 1 }, // Default style for stars
      designation: true, // Show star names (Bayer, Flamsteed, Variable star, Gliese or designation, 
      // i.e. whichever of the previous applies first); may vary with culture setting
      designationType: "desig",  // Which kind of name is displayed as designation (fieldname in starnames.json)
      designationStyle: { fill: "#ddddbb", font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif", align: "left", baseline: "top" },
      designationLimit: 2.5,  // Show only names for stars brighter than nameLimit
      propername: false,   // Show proper name (if present)
      propernameType: "name", // Languge for proper name, default IAU name; may vary with culture setting 
      // (see list below of languages codes available for stars)
      propernameStyle: { fill: "#ddddbb", font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif", align: "right", baseline: "bottom" },
      propernameLimit: 1.5,  // Show proper names for stars brighter than propernameLimit
      size: 7,       // Maximum size (radius) of star circle in pixels
      exponent: -0.28, // Scale exponent for star size, larger = more linear
      data: 'stars.6.json' // Data source for stellar data, 
      // number indicates limit magnitude
    },
    dsos: {
      show: true,    // Show Deep Space Objects 
      limit: 6,      // Show only DSOs brighter than limit magnitude
      colors: true,  // // Show DSOs in symbol colors if true, use style setting below if false
      style: { fill: "#cccccc", stroke: "#cccccc", width: 2, opacity: 1 }, // Default style for dsos
      names: true,   // Show DSO names
      namesType: "name",  // Type of DSO ('desig' or language) name shown
      // (see list below for languages codes available for dsos)
      nameStyle: {
        fill: "#cccccc", font: "11px Helvetica, Arial, serif",
        align: "left", baseline: "top"
      }, // Style for DSO names
      nameLimit: 6,  // Show only names for DSOs brighter than namelimit
      size: null,    // Optional seperate scale size for DSOs, null = stars.size
      exponent: 1.4, // Scale exponent for DSO size, larger = more non-linear
      data: 'dsos.bright.json', // Data source for DSOs, 
      // opt. number indicates limit magnitude
      symbols: {  //DSO symbol styles, 'stroke'-parameter present = outline
        gg: { shape: "circle", fill: "#ff0000" },          // Galaxy cluster
        g: { shape: "ellipse", fill: "#ff0000" },         // Generic galaxy
        s: { shape: "ellipse", fill: "#ff0000" },         // Spiral galaxy
        s0: { shape: "ellipse", fill: "#ff0000" },         // Lenticular galaxy
        sd: { shape: "ellipse", fill: "#ff0000" },         // Dwarf galaxy
        e: { shape: "ellipse", fill: "#ff0000" },         // Elliptical galaxy
        i: { shape: "ellipse", fill: "#ff0000" },         // Irregular galaxy
        oc: {
          shape: "circle", fill: "#ffcc00",
          stroke: "#ffcc00", width: 1.5
        },             // Open cluster
        gc: { shape: "circle", fill: "#ff9900" },          // Globular cluster
        en: { shape: "square", fill: "#ff00cc" },          // Emission nebula
        bn: {
          shape: "square", fill: "#ff00cc",
          stroke: "#ff00cc", width: 2
        },               // Generic bright nebula
        sfr: {
          shape: "square", fill: "#cc00ff",
          stroke: "#cc00ff", width: 2
        },               // Star forming region
        rn: { shape: "square", fill: "#00ooff" },          // Reflection nebula
        pn: { shape: "diamond", fill: "#00cccc" },         // Planetary nebula 
        snr: { shape: "diamond", fill: "#ff00cc" },         // Supernova remnant
        dn: {
          shape: "square", fill: "#999999",
          stroke: "#999999", width: 2
        },               // Dark nebula grey
        pos: {
          shape: "marker", fill: "#cccccc",
          stroke: "#cccccc", width: 1.5
        }              // Generic marker
      }
    },
    planets: {  //Show planet locations, if date-time is set
      show: true,
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
    constellations: {
      names: true,      // Show constellation names 
      namesType: "iau", // Type of name Latin (iau, default), 3 letter designation (desig) or other language (see list below)
      nameStyle: {
        fill: "#cccc99", align: "center", baseline: "middle",
        font: ["14px Helvetica, Arial, sans-serif",  // Style for constellations
          "12px Helvetica, Arial, sans-serif",  // Different fonts for diff.
          "11px Helvetica, Arial, sans-serif"]
      },// ranked constellations
      lines: true,   // Show constellation lines, style below
      lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.6 },
      bounds: false, // Show constellation boundaries, style below
      boundStyle: { stroke: "#cccc00", width: 0.5, opacity: 0.8, dash: [2, 4] }
    },
    mw: {
      show: true,     // Show Milky Way as filled multi-polygon outlines 
      style: { fill: "#ffffff", opacity: 0.15 }  // Style for MW layers
    },
    lines: {  // Display & styles for graticule & some planes
      graticule: {
        show: true, stroke: "#cccccc", width: 0.6, opacity: 0.8,
        // grid values: "outline", "center", or [lat,...] specific position
        lon: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" },
        // grid values: "outline", "center", or [lon,...] specific position
        lat: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" }
      },
      equatorial: { show: true, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },
      ecliptic: { show: true, stroke: "#66cc66", width: 1.3, opacity: 0.7 },
      galactic: { show: false, stroke: "#cc6666", width: 1.3, opacity: 0.7 },
      supergalactic: { show: false, stroke: "#cc66cc", width: 1.3, opacity: 0.7 }
    },
    background: {        // Background style
      fill: "#000000",   // Area fill
      opacity: 1,
      stroke: "#000000", // Outline
      width: 1.5
    },
    horizon: {  //Show horizon marker, if location is set and map projection is all-sky
      show: false,
      stroke: "#cccccc", // Line
      width: 1.0,
      fill: "#000000",   // Area below horizon
      opacity: 0.5
    },
    daylight: {  //Show day sky as a gradient, if location is set and map projection is hemispheric
      show: false
    }
  };































  ngAfterViewInit(): void {
    // Run outside Angular to avoid unnecessary change detection cycles if Celestial
    // this.ngZone.runOutsideAngular(() => {
    // Display map with the configuration above or any subset thereof
    // Celestial.display(this.config);
    console.log(this.config)



    // init celestial once the view is ready
    this.initCelestial();

    // re-draw whenever any form control changes
    this.optionsForm.valueChanges
      .pipe(/* optionally debounceTime(200) */)
      .subscribe(opts => this.updateCelestial(opts));
  }


  private initCelestial() {
    const opts = this.buildConfig(this.optionsForm.value);
    console.log(opts)
    Celestial.display(opts);
  }

  private updateCelestial(form: any) {
    const cfg = this.buildConfig(form);
    // run the redraw outside Angular to avoid change-detection thrash
    this.ngZone.runOutsideAngular(() => Celestial.redraw(cfg));
  }

  /** optional helper to reset to defaults */
  resetDefaults() {
    this.optionsForm.reset({
      projection: 'azimuthal-equidistant',
      transform: true,
      centerLon: 0,
      centerLat: 0,
      date: new Date().toISOString().substr(0, 10),
      time: new Date().toTimeString().substr(0, 5)
    });
  }

  private buildConfig(f: any) {
    return {
      width: 0,
      projection: f.projection,
      projectionRatio: null,
      transform: f.transform,
      center: [+f.centerLon, +f.centerLat],
      date: f.date + 'T' + f.time + ':00Z',
      stars: { show: true, limit: 6 },
      dsos: { show: true },
      constellations: {
        names: true,
        lines: true,
        bounds: false
      },


    // [longitude, latitude, orientation] all in degrees 
    // null = default center [0,0,0]
    orientationfixed: true,  // Keep orientation angle the same as center[2]
    geopos: null,       // optional initial geographic position [lat,lon] in degrees, 
    // overrides center
    follow: "zenith",   // on which coordinates to center the map, default: zenith, if location enabled, 
    // otherwise center
    zoomlevel: null,    // initial zoom level 0...zoomextend; 0|null = default, 1 = 100%, 0 < x <= zoomextend
    zoomextend: 10,     // maximum zoom level
    adaptable: true,    // Sizes are increased with higher zoom-levels
    interactive: true,  // Enable zooming and rotation with mousewheel and dragging
    form: "celestial-form",         // Display form for interactive settings. Needs a div with
    // id="celestial-form", created automatically if not present
    location: false,    // Display location settings. Deprecated, use formFields below
    formFields: {
      "location": true,  // Set visiblity for each group of fields with the respective id
      "general": true,
      "stars": true,
      "dsos": true,
      "constellations": true,
      "lines": true,
      "other": true,
      "download": true
    },
    advanced: true,     // Display fewer form fields if false 
    daterange: [],      // Calender date range; null: displaydate-+10; [n<100]: displaydate-+n; [yr]: yr-+10; 
    // [yr, n<100]: [yr-n, yr+n]; [yr0, yr1]  
    controls: true,     // Display zoom controls
    lang: "el",           // Global language override for names, any name setting that has the chosen language available
    // Default: desig or empty string for designations, other languages as used anywhere else
   




      // …any other options you need…
      // Default: desig or empty string for designations, other languages as used anywhere else
      culture: "",        // Source of constellations and star names, default "iau", other: "cn" Traditional Chinese
      container: "celestial-map",   // ID of parent element, e.g. div, null = html-body
      datapath: "celestial/data/",  // Path/URL to data files, empty = subfolder 'data'
      planets: {  //Show planet locations, if date-time is set
        show: true,
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
      mw: {
        show: true,     // Show Milky Way as filled multi-polygon outlines 
        style: { fill: "#ffffff", opacity: 0.15 }  // Style for MW layers
      },
      lines: {  // Display & styles for graticule & some planes
        graticule: {
          show: true, stroke: "#cccccc", width: 0.6, opacity: 0.8,
          // grid values: "outline", "center", or [lat,...] specific position
          lon: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" },
          // grid values: "outline", "center", or [lon,...] specific position
          lat: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" }
        },
        equatorial: { show: true, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },
        ecliptic: { show: true, stroke: "#66cc66", width: 1.3, opacity: 0.7 },
        galactic: { show: false, stroke: "#cc6666", width: 1.3, opacity: 0.7 },
        supergalactic: { show: false, stroke: "#cc66cc", width: 1.3, opacity: 0.7 }
      },
      background: {        // Background style
        fill: "#000000",   // Area fill
        opacity: 1,
        stroke: "#000000", // Outline
        width: 1.5
      },
      horizon: {  //Show horizon marker, if location is set and map projection is all-sky
        show: false,
        stroke: "#cccccc", // Line
        width: 1.0,
        fill: "#000000",   // Area below horizon
        opacity: 0.5
      },
      daylight: {  //Show day sky as a gradient, if location is set and map projection is hemispheric
        show: false
      }
    };
  }

  showMoreOptions() {
    var nodes = document.getElementById('params')?.childNodes
    for (let i in nodes) {
      if (nodes[Number(i)]) {
        if ((nodes[Number(i)] as HTMLDivElement).id != 'loc') {
          (nodes[Number(i)] as HTMLDivElement).style.display = 'block'
        }
      }
    }
    this.showMore = true
  }

  hideMoreOptions() {
    var nodes = document.getElementById('params')?.childNodes
    for (let i in nodes) {
      if (nodes[Number(i)]) {
        if ((nodes[Number(i)] as HTMLDivElement).id != 'loc') {
          (nodes[Number(i)] as HTMLDivElement).style.display = 'none'
        }
      }
    }
    this.showMore = false
  }

  jsonLine = {
    "type": "FeatureCollection",
    // this is an array, add as many objects as you want
    "features": [
      {
        "type": "Feature",
        "id": "SummerTriangle",
        "properties": {
          // Name
          "n": "Summer Triangle",
          // Location of name text on the map
          "loc": [-67.5, 52]
        }, "geometry": {
          // the line object as an array of point coordinates, 
          // always as [ra -180..180 degrees, dec -90..90 degrees]
          "type": "MultiLineString",
          "coordinates": [[
            [-80.7653, 38.7837],
            [-62.3042, 8.8683],
            [-49.642, 45.2803],
            [-80.7653, 38.7837]
          ]]
        }
      }
    ]
  }

  lineStyle = {
    stroke: "#f00",
    fill: "rgba(255, 204, 204, 0.2)",
    width: 3
  };

  textStyle = {
    fill: "#f00",
    font: "bold 15px Helvetica, Arial, sans-serif",
    align: "center",
    baseline: "bottom"
  };



  hour2degree(ra: any) {
    return ra > 12 ? (ra - 24) * 15 : ra * 15;
  }

  addObject() {
    var asterism = Celestial.getData(this.jsonLine, this.config.transform);

    // Add to celestial objects container in d3
    Celestial.container.selectAll(".asterisms")
      .data(asterism.features)
      .enter().append("path")
      .attr("class", "ast");
    // Trigger redraw to display changes
    Celestial.redraw();
    Celestial.container.selectAll(".ast").each((d: any) => {
      // Set line styles 
      Celestial.setStyle(this.lineStyle);
      // Project objects on map
      Celestial.map(d);
      // draw on canvas
      Celestial.context.fill();
      Celestial.context.stroke();

      // If point is visible (this doesn't work automatically for points)
      if (Celestial.clip(d.properties.loc)) {
        // get point coordinates
        var pt: any = Celestial.mapProjection(d.properties.loc);
        // Set text styles       
        Celestial.setTextStyle(this.textStyle);
        // and draw text on canvas
        Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
        // Celestial.display();

      }
    })

    // Celestial.display();

  }


  // sdfgsdfgh(error: any, json: any) {
  //   if (error) return console.warn(error);
  //   // Load the geoJSON file and transform to correct coordinate system, if necessary
  //   var asterism = Celestial.getData(jsonLine, config.transform);

  //   // Add to celestial objects container in d3
  //   Celestial.container.selectAll(".asterisms")
  //     .data(asterism.features)
  //     .enter().append("path")
  //     .attr("class", "ast");
  //   // Trigger redraw to display changes
  //   Celestial.redraw();
  // }



}
