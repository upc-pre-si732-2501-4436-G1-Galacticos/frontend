import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderContentComponent} from './public/components/header-content/header-content.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fitwise-frontend';
}
