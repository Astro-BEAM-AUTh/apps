import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { configService } from '../../../services/config.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    configService
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class Dashboard {

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
