import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {WorkoutsService} from '../../services/workouts.service';
import {DietsService} from '../../services/diets.service';
import {FitwisePlansService} from '../../services/fitwise-plans.service';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';


@Component({
  selector: 'app-plan-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, TranslateModule],
  templateUrl: './plan-details-dialog.component.html',
  styleUrls: ['./plan-details-dialog.component.css']
})
export class PlanDetailsDialogComponent implements OnInit {
  selectedWorkoutId: number | null = null;
  selectedDietId: number | null = null;
  workouts: { id: number; title: string }[] = [];
  diets: { id: number; title: string }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number;
      title: string;
      description: string;
      tagNames?: string[];
      workout?: {
        title: string;
        description: string;
        exercises: { title: string }[];
      };
      diet?: {
        title: string;
        description: string;
        meals: { title: string }[];
      };
    },
    private planService: FitwisePlansService,
    private workoutService: WorkoutsService,
    private dietService: DietsService
  ) {}

  ngOnInit(): void {
    this.workoutService.getAllWorkouts().subscribe(data => this.workouts = data);
    this.dietService.getAllDiets().subscribe(data => this.diets = data);
  }

  confirmAssociateWorkout(): void {
    if (!this.selectedWorkoutId) return  alert('No a seleccionado correctamente');
    this.planService.assignWorkoutToPlan(this.data.id, this.selectedWorkoutId)
      .subscribe(() => {
        alert('Workout asociado correctamente');
        location.reload(); // o refrescar datos dinámicamente
      });
  }

  confirmAssociateDiet(): void {
    if (!this.selectedDietId) return alert('No a seleccionado correctamente');
    this.planService.assignDietToPlan(this.data.id, this.selectedDietId)
      .subscribe(() => {
        alert('Dieta asociada correctamente');
        location.reload(); // o refrescar datos dinámicamente
      });
  }
}
