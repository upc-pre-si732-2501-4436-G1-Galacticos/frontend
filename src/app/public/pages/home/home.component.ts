import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {FitwisePlanSubscriptionModel} from '../../../core/model/fitwise-plan-subscription.model';
import {FitwisePlanSubscriptionsService} from '../../../core/services/fitwise-plan-subscriptions.service';
import {FitwisePlansService} from '../../../core/services/fitwise-plans.service';
import {DietsService} from '../../../core/services/diets.service';


export class HomeComponent implements OnInit {
  currentPlan: any = null;
  latestSubscription: FitwisePlanSubscriptionModel | null = null;
  dietTitle: string | null = null;
  workoutTitle: string | null = null;
  userId!:number;

  constructor(
    private fitwisePlanSubscriptionsService: FitwisePlanSubscriptionsService,
    private fitwisePlansService: FitwisePlansService,
    private dietsService: DietsService,
    private workoutsService: WorkoutsService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.loadCurrentPlan();
  }

  loadCurrentPlan() {
    this.fitwisePlanSubscriptionsService
      .getFitwisePlansSubscriptionsByUserId(this.userId)
      .subscribe(subscriptions => {
        const active = subscriptions
          .filter(sub => sub.isActive)
          .sort((a, b) => new Date(b.subscriptionStartDate).getTime() - new Date(a.subscriptionStartDate).getTime());

        if (active.length > 0) {
          this.latestSubscription = active[0];
          this.fitwisePlansService.getPlanById(this.latestSubscription.fitwisePlanId).subscribe(plan => {
            this.currentPlan = plan;

            // cargar títulos reales
            this.dietsService.getDietById(plan.dietId).subscribe(d => this.dietTitle = d.title);
            this.workoutsService.getWorkoutById(plan.workoutId).subscribe(w => this.workoutTitle = w.title);
          });
        }
      });
  }
}
