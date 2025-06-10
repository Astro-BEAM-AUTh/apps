import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Router } from '@angular/router';
import { configService } from '../../services/config.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {

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
