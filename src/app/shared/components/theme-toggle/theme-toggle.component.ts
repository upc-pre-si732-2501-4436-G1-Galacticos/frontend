import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { Observable } from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [attr.aria-label]="'Cambiar a modo ' + (currentTheme === 'light' ? 'oscuro' : 'claro')"
      class="theme-toggle-button">
      <mat-icon>{{ currentTheme === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
    </button>
  `,
  imports: [
    MatIcon,
    MatIconButton
  ],
  styles: [`
    .theme-toggle-button {
      transition: all 0.3s ease;
    }

    .theme-toggle-button:hover {
      transform: scale(1.1);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: Theme = 'light';
  currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngOnInit(): void {
    this.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
