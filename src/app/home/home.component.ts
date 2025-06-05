import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { D3celestialComponent } from './d3celestial/d3celestial.component';
import { Router } from '@angular/router';
import { configService } from '../../services/config.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    RouterModule,
    D3celestialComponent,
    MatDividerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  apps: any

  constructor(
    private router: Router,
    private configService: configService
  ) {
    this.apps = this.configService.apps
  }

  openApplication(path: string) {
    this.router.navigateByUrl('/home/' + path);
  }


}


