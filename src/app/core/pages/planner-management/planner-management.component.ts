import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlannerService } from '../../services/planner.service';
import { FitwisePlanSubscriptionsService } from '../../services/fitwise-plan-subscriptions.service';
import { FitwisePlanModel } from '../../model/fitwise-plan.model';
import {SubscriptionDaysDialogComponent} from '../../components/subscription-dialog/plan-subscription-dialog.component';
import {PlanDetailsDialogComponent} from '../../components/plan-details-dialog/plan-details-dialog.component';
import {WorkoutsService} from '../../services/workouts.service';
import {DietsService} from '../../services/diets.service';
import {forkJoin, of} from 'rxjs';

import {TagPlanService} from '../../services/tagPlan.service';
import {TagPlan} from '../../model/tag.model';


import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './planner-management.component.html',
  styleUrls: ['./planner-management.component.css']
})
export class PlannerManagementComponent implements OnInit {
  recommendedPlans: FitwisePlanModel[] = [];
  communityPlans: FitwisePlanModel[] = [];
  userId!: number;
  profileId!: number;
  newPlan: Partial<FitwisePlanModel> = {
    title: '',
    description: '',
    tagNames: []
  };
  tagsInput = '';
  availableTags: TagPlan[] = [];

  constructor(
    private plannerService: PlannerService,
    private workoutsService: WorkoutsService,
    private dietsService: DietsService,
    private plannerSubscriptionService: FitwisePlanSubscriptionsService,
    private dialog: MatDialog,
    private router: Router,
    private tagService: TagPlanService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.profileId = Number(localStorage.getItem('profileId'));
    this.loadRecommendedPlans();
    this.loadCommunityPlans();
    this.loadTags();
  }

  loadTags():void{
    this.tagService.getTags().subscribe(tags => {
      this.availableTags = tags;
    });
  }

  submitNewPlan(): void {

    const request: Partial<FitwisePlanModel> = {
      title: this.newPlan.title!,
      description: this.newPlan.description!,
      tagNames: this.newPlan.tagNames || []
    };

    this.plannerService.createPlan(request).subscribe({
      next: () => {
        alert('Plan creado exitosamente');
        this.newPlan = { title: '', description: '', tagNames: [] };
        this.tagsInput = '';
        this.loadCommunityPlans(); // opcional para refrescar
      },
      error: err => {
        console.error('Error al crear el plan:', err);
        alert('Ocurrió un error al crear el plan');
      }
    });
  }
  loadRecommendedPlans(): void {
    this.plannerService.getRecommendedPlans(this.profileId)
      .subscribe(plans => this.recommendedPlans = plans);
  }

  loadCommunityPlans(): void {
    this.plannerService.getPlans()
      .subscribe(plans => this.communityPlans = plans);
  }

  openPlanDetails(plan: FitwisePlanModel): void {
    const workout$ = plan.workoutId
      ? this.workoutsService.getWorkoutById(plan.workoutId)
      : of(null);

    const diet$ = plan.dietId
      ? this.dietsService.getDietById(plan.dietId)
      : of(null);

    forkJoin([workout$, diet$]).subscribe(([workout, diet]) => {
      this.dialog.open(PlanDetailsDialogComponent, {
        width: '500px',
        data: {
          ...plan,
          workout,
          diet
        }
      });
    });
  }

  assignPlanToUser(planId: number): void {

    this.plannerSubscriptionService.getFitwisePlansSubscriptionsByUserId(this.userId)
      .subscribe((subscriptions: any[]) => {
        const today = new Date();

        const activeSubscription = subscriptions.find(sub =>
          sub.isActive &&
          new Date(sub.endDate) >= today
        );

        if (activeSubscription) {
          alert('Ya tienes una suscripción activa. No puedes asignar otra hasta que finalice.');
          return;
        }

        // Si no tiene suscripción activa, abrimos el modal
        const dialogRef = this.dialog.open(SubscriptionDaysDialogComponent, {
          width: '500px',
        });

        dialogRef.afterClosed().subscribe((days: number) => {
          if (!days || days <= 0) return;

          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + days);

          const request = {
            id: 0,
            userId: this.userId,
            fitwisePlanId: planId,
            subscriptionStartDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            notes: 'subscription',
            isActive: true
          };

          this.plannerSubscriptionService.assignPlanSubscriptionToUserId(request)
            .subscribe({
              next: () => {
                alert('Plan asignado exitosamente a tu cuenta.');
                this.router.navigate(['/home']);
              },
              error: (err) => console.error('Error al asignar plan:', err)
            });
        });
      });
  }

}
