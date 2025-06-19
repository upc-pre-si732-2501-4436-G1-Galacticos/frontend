import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Workout } from '../../../model/workout.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent {
  @Input() workout: Workout[] = [];
  @Output() selectWorkout = new EventEmitter<Workout>();

  onSelect(diet: Workout) {
    this.selectWorkout.emit(diet);
  }
}
