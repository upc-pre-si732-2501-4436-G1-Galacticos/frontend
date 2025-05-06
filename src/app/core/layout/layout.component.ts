import { Component } from '@angular/core';
import {HeaderContentComponent} from '../../public/components/header-content/header-content.component';
import {RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [HeaderContentComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
