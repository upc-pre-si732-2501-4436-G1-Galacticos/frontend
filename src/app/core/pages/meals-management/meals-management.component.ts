import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../services/meals.service';
import { Meal } from '../../model/meal.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-meals-management',
  templateUrl: './meals-management.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  styleUrls: ['./meals-management.component.css']
})
export class MealsManagementComponent implements OnInit {

  meals: Meal[] = [];
  selectedMeal: Meal = this.createEmptyMeal();
  userId: number | null = null;

  constructor(private mealsService: MealsService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId !== null && !isNaN(Number(storedUserId)) ? Number(storedUserId) : null;

    if (this.userId !== null) {
      this.getMealsByUser(this.userId);
    } else {
      console.error('No se encontró un userId válido en localStorage');
    }
  }

  getMealsByUser(userId: number): void {
    this.mealsService.getMealsByUser(userId).subscribe({
      next: (data) => this.meals = data,
      error: (err) => console.error('Error al obtener meals:', err)
    });
  }

  saveMeal(): void {
    if (this.selectedMeal.id) {
      this.mealsService.updateMeal(this.selectedMeal.id, this.selectedMeal).subscribe({
        next: (updated) => {
          const index = this.meals.findIndex(m => m.id === updated.id);
          if (index !== -1) {
            this.meals[index] = updated;
          }
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar meal:', err)
      });
    } else {
      this.mealsService.createMeal(this.selectedMeal).subscribe({
        next: (created) => {
          this.meals.push(created);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear meal:', err)
      });
    }
  }

  editMeal(meal: Meal): void {
    this.selectedMeal = { ...meal };
  }

  resetForm(): void {
    this.selectedMeal = this.createEmptyMeal();
  }

  private createEmptyMeal(): Meal {
    return {
      title: '',
      description: ''
    };
  }
}
