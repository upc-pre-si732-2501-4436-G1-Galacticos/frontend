import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog} from '@angular/material/dialog';
import { PlanDetailsDialogComponent} from '../../components/plan-details-dialog/plan-details-dialog.component';
import { PlannerService} from '../../services/planner.service';
import { FitwisePlanModel } from '../../model/fitwise-plan.model';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './planner-management.component.html',
  styleUrls: ['./planner-management.component.css']
})
export class PlannerManagementComponent implements OnInit {
  recommendedPlans: FitwisePlanModel[] = [];
  profileId = 1; // TODO: reemplazar con el ID real del usuario logueado

  constructor(
    private plannerService: PlannerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.plannerService.getRecommendedPlans(this.profileId)
      .subscribe(plans => this.recommendedPlans = plans);
  }

  openPlanDetails(plan: FitwisePlanModel): void {
    this.dialog.open(PlanDetailsDialogComponent, {
      width: '400px',
      data: plan
    });
  }

}
