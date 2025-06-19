import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MealsService } from '../../services/meals.service';
import { DietsService } from '../../services/diets.service';
import { Meal } from '../../model/meal.model';
import { Diet } from '../../model/diet.model';
import { MatFormField } from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-diet-create-dialog',
  templateUrl: './diet-create-dialog.component.html',
  styleUrls: ['./diet-create-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatTabGroup,
    MatTab,
    FormsModule,
    NgForOf,
    MatDialogActions,
    MatLabel,
    MatDialogTitle,
    NgIf
  ]
})
export class DietCreateDialogComponent implements OnInit {
  title = '';
  description = '';
  isEdit = false;
  selectedTabIndex = 0;
  mealsMy: Meal[] = [];
  mealsComm: Meal[] = [];
  selectedMeals: Meal[] = [];
  userId = Number(localStorage.getItem('userId'));
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { diet?: Diet },
    private mealsSvc: MealsService,
    private dietsSvc: DietsService,
    private dialogRef: MatDialogRef<DietCreateDialogComponent>
  ) {}

  ngOnInit(): void {
    // 1) Cargo mis meals y luego filtro comunidad
    this.mealsSvc.getMealsByUser(this.userId).subscribe(myMeals => {
      this.mealsMy = myMeals;
      const myIds = myMeals.map(m => m.id!);
      this.mealsSvc.getAllCommunityMeals().subscribe(allComm => {
        this.mealsComm = allComm.filter(m => !myIds.includes(m.id!));
      });
    });

    // 2) Si venimos a editar, relleno
    if (this.data.diet) {
      this.isEdit = true;
      this.title = this.data.diet.title;
      this.description = this.data.diet.description;
      this.selectedMeals = [...this.data.diet.meals];
      this.selectedTabIndex = 0;
    }
  }

  onTabChanged(index: number) {
    this.selectedTabIndex = index;
  }

  toggleMeal(meal: Meal) {
    const idx = this.selectedMeals.findIndex(m => m.id === meal.id);
    if (idx > -1) {
      this.selectedMeals.splice(idx, 1);
    } else if (this.selectedMeals.length < 3) {
      this.selectedMeals.push(meal);
    }
  }

  confirm() {
    const ids = this.selectedMeals.map(m => m.id!);

    if (this.isEdit && this.data.diet) {
      // update existing diet
      this.dietsSvc.updateDiet(this.data.diet.id, { title: this.title, description: this.description })
        .subscribe(d => {

          this.dialogRef.close(true);
        });
    } else {
      // **create** via the correct endpoint
      this.dietsSvc.createDiet({ title: this.title, description: this.description })
        .subscribe(newDiet => {
          ids.forEach(id =>
            this.dietsSvc.assignMealToDiet(newDiet.id, id).subscribe()
          );
          this.dialogRef.close(true);
        }, err => {
          console.error('Error creating diet:', err);
        });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
