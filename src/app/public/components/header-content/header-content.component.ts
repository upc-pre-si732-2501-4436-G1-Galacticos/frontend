import { Component, ViewChild, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header-content',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    NgOptimizedImage,
    MatSidenavContainer,
    MatNavList,
    MatListItem,
    MatSidenav
  ],
  templateUrl: './header-content.component.html',
  styleUrl: './header-content.component.css'
})

export class HeaderContentComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggleMobileMenu() {
    this.sidenav?.toggle();
  }
}
