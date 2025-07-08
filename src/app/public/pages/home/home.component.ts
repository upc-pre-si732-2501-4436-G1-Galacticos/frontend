import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { FitwisePlanSubscriptionModel } from '../../../core/model/fitwise-plan-subscription.model';
import { FitwisePlanModel } from '../../../core/model/fitwise-plan.model';


import { FitwisePlanSubscriptionsService } from '../../../core/services/fitwise-plan-subscriptions.service';
import { FitwisePlansService } from '../../../core/services/fitwise-plans.service';
import { DietsService } from '../../../core/services/diets.service';
import { WorkoutsService } from '../../../core/services/workouts.service';
import {Diet} from '../../../core/model/diet.model';
import {Workout} from '../../../core/model/workout.model';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentPlan: FitwisePlanModel | null = null;
  latestSubscription: FitwisePlanSubscriptionModel | null = null;
  dietTitle: string | null = null;
  workoutTitle: string | null = null;
  userId: number = 0;
  todayString: string = new Date().toISOString().split('T')[0]; // formato YYYY-MM-D
  userName:string='';
  exerciseList: any[] = [];
  mealList: any[] = [];
  calendarDays: { date: string, exercises: any[], meals: any[] }[] = [];

  constructor(
    private fitwisePlanSubscriptionsService: FitwisePlanSubscriptionsService,
    private fitwisePlansService: FitwisePlansService,
    private dietsService: DietsService,
    private workoutsService: WorkoutsService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.userName=localStorage.getItem('email')??'Sin sesion'
    this.loadCurrentPlan();
  }

  generateCalendar() {
    if (!this.latestSubscription || this.exerciseList.length < 3 || this.mealList.length < 3) return;

    const start = new Date(this.latestSubscription.subscriptionStartDate);
    const end = new Date(this.latestSubscription.endDate);
    const days: { date: string, exercises: any[], meals: any[] }[] = [];

    let mealIndex = 0;
    let exerciseIndex = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d).toISOString().split('T')[0];

      const meals = [];
      const exercises = [];

      for (let i = 0; i < 3; i++) {
        meals.push(this.mealList[(mealIndex + i) % this.mealList.length]);
        exercises.push(this.exerciseList[(exerciseIndex + i) % this.exerciseList.length]);
      }

      days.push({
        date,
        meals,
        exercises
      });

      mealIndex++;
      exerciseIndex++;
    }

    this.calendarDays = days;
  }



  loadCurrentPlan(): void {
    this.fitwisePlanSubscriptionsService
      .getFitwisePlansSubscriptionsByUserId(this.userId)
      .subscribe((subscriptions: FitwisePlanSubscriptionModel[]) => {
        const active = subscriptions
          .filter(sub => sub.isActive)
          .sort((a, b) =>
            new Date(b.subscriptionStartDate).getTime() -
            new Date(a.subscriptionStartDate).getTime()
          );

        if (active.length > 0) {
          const latest = active[0];
          this.latestSubscription = latest;

          this.fitwisePlansService.getPlanById(latest.fitwisePlanId).subscribe((plan: FitwisePlanModel) => {
            this.currentPlan = plan;

            this.dietsService.getDietById(plan.dietId).subscribe((d: Diet) => {
              this.dietTitle = d.title;
              this.mealList=d.meals;
              this.generateCalendar();
            });

            this.workoutsService.getWorkoutById(plan.workoutId).subscribe((w: Workout) => {
              this.workoutTitle = w.title;
              this.exerciseList=w.exercises;
              this.generateCalendar();
            });
          });
        }
      });
  }
}
