import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FitwisePlansService} from '../../../core/services/fitwise-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentPlan: any;

  constructor(private fitwisePlansService: FitwisePlansService) {}

  ngOnInit(): void {
    this.loadCurrentPlan();
  }

  loadCurrentPlan() {
    this.fitwisePlansService.getFitwisePlans().subscribe(plans => {
      if (plans.length > 0) {
        this.currentPlan = plans[0]; // En el futuro puedes permitir selección
      }
    });
  }
}
