import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderContentComponent } from '../../public/components/header-content/header-content.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderContentComponent,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    TranslateModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  constructor(private bo: BreakpointObserver) {}

  ngOnInit() {
    this.bo.observe([Breakpoints.Handset])
      .subscribe(r => (this.isMobile = r.matches));
  }

  close() {
    if (this.sidenav) {
      this.sidenav.close().then();
    }
  }

}
