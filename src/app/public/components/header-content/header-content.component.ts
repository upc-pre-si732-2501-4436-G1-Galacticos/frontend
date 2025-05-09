import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgIf, NgOptimizedImage} from '@angular/common';

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AuthService} from '../../../iam/services/auth.service';
import {Router, RouterModule} from '@angular/router';

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
    NgIf,
  ],
  templateUrl: './header-content.component.html',
  styleUrl: './header-content.component.css'
})

export class HeaderContentComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  isMobile = false;
  isSignedIn: boolean = false;
  currentEmail: string = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
    this.authenticationService.isSignedIn.subscribe(flag => this.isSignedIn = flag);
    this.authenticationService.currentUserMail.subscribe(email => this.currentEmail = email);
  }

  goToProfile() {
    this.router.navigate(['/profile']).then();
  }

  onSignOut() {
    this.authenticationService.signOut();
  }
}
