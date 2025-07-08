import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Workout } from '../../model/workout.model';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './routine-list.component.html',
  styleUrls: ['./routine-list.component.css']
})
export class RoutineListComponent {
  @Input() routines: Workout[] = [];
  @Output() routineSelected = new EventEmitter<number>();

  onRoutineClick(id: number): void {
    this.routineSelected.emit(id);
  }
}
