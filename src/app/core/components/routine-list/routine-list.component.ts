import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Workout } from '../../model/workout.model';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './routine-list.component.html',
  styleUrls: ['./routine-list.component.css']
})
export class RoutineListComponent implements OnChanges {
  @Input() routines: any[] = [];
  @Output() routineSelected = new EventEmitter<number>();

  paginatedRoutines: Workout[] = [];
  pageSize = 5;
  currentPage = 0;

  ngOnChanges(): void {
    this.updatePaginatedRoutines();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedRoutines();
  }

  updatePaginatedRoutines(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRoutines = this.routines.slice(start, end);
  }

  onRoutineClick(id: number) {
    this.routineSelected.emit(id);
  }
}
