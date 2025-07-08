import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  currentPlan: FitwisePlanModel | null = null;
  latestSubscription: FitwisePlanSubscriptionModel | null = null;
  dietTitle: string | null = null;
  workoutTitle: string | null = null;
  userId: number = 0;
  todayString: string = new Date().toISOString().split('T')[0];
  userName: string = '';
  exerciseList: any[] = [];
  mealList: any[] = [];
  calendarDays: { date: string, exercises: any[], meals: any[] }[] = [];
  animatedMessage: string[] = [];
  private typingIndex = 0;
  private typingInterval: any;
  selectedMessage: string = '';
  private messageInterval: any;

  motivationalMessages = {
    morning: [
      '¡Buenos días! Hoy es un gran día para cuidar de ti mismo 💪',
      'Aprovecha la mañana para construir tu mejor versión 🌞',
      'Cada día es una nueva oportunidad. ¡Aprovéchala desde temprano!',
      'Empieza el día con energía y actitud positiva 🚀',
      'Despierta con determinación y duerme con satisfacción.'
    ],
    afternoon: [
      '¡Sigue fuerte! Tu esfuerzo tiene recompensa 🏋️‍♂️',
      'Una buena tarde empieza con una buena actitud y constancia.',
      'No te rindas ahora, ¡vas muy bien! 🔥',
      'Concentración y disciplina: la tarde es clave para avanzar.',
      'Cada paso que das te acerca más a tu meta 💯'
    ],
    evening: [
      '¡Terminaste el día! Celebra cada pequeño logro 🎉',
      'La noche es para reflexionar y prepararte para un mejor mañana.',
      'Descansa, mañana seguiremos con más fuerza 💤',
      'Tu cuerpo también necesita recuperación, duerme bien 😴',
      'Hoy lo diste todo, ¡mañana más y mejor!'
    ]
  };

  constructor(
    private fitwisePlanSubscriptionsService: FitwisePlanSubscriptionsService,
    private fitwisePlansService: FitwisePlansService,
    private dietsService: DietsService,
    private workoutsService: WorkoutsService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('email') ?? 'Sin sesión';
    this.loadCurrentPlan();
    this.setMotivationalMessage(); // Inicial
    this.messageInterval = setInterval(() => {
      this.setMotivationalMessage();
    }, 30000); // cada 30 segundos
  }

  ngOnDestroy(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  }

  private setMotivationalMessage(): void {
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening';

    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'afternoon';
    } else {
      timeOfDay = 'evening';
    }

    const messages = this.motivationalMessages[timeOfDay];
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];

    const fullMessageChars = Array.from(message); // ✅ Maneja emojis correctamente
    this.animatedMessage = [];
    this.typingIndex = 0;

    if (this.typingInterval) clearInterval(this.typingInterval);

    this.typingInterval = setInterval(() => {
      if (this.typingIndex < fullMessageChars.length) {
        this.animatedMessage.push(fullMessageChars[this.typingIndex]);
        this.typingIndex++;
      } else {
        clearInterval(this.typingInterval);
      }
    }, 50);// velocidad de escritura
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
              this.mealList = d.meals;
              this.generateCalendar();
            });

            this.workoutsService.getWorkoutById(plan.workoutId).subscribe((w: Workout) => {
              this.workoutTitle = w.title;
              this.exerciseList = w.exercises;
              this.generateCalendar();
            });
          });
        }
      });
  }
}
