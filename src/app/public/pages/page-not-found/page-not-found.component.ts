import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {CommonModule, NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    NgOptimizedImage,
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {
  hovering: boolean = false;
  protected invalidUrl: string;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {
    this.invalidUrl = '';
  }

  ngOnInit(): void {
    this.invalidUrl = this.route.snapshot.url.map(element => element.path).join('/');
  }

  protected onNavigateHome() {
    this.router.navigate(['']).then();
  }

  goHome() {
    this.router.navigate(['/home']).then();
  }
}
