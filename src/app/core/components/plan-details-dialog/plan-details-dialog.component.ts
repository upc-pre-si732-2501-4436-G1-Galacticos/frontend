import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FitwisePlanModel } from '../../model/fitwise-plan.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-plan-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './plan-details-dialog.component.html',
  styleUrls: ['./plan-details-dialog.component.css']
})
export class PlanDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: FitwisePlanModel) {}
}
