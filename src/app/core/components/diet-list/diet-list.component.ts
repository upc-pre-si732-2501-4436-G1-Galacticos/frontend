import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Diet } from '../../model/diet.model';

@Component({
  selector: 'app-diet-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './diet-list.component.html',
  styleUrls: ['./diet-list.component.css']
})
export class DietListComponent implements OnChanges {
  @Input() diets: any[] = [];
  @Output() dietSelected = new EventEmitter<number>();

  paginatedDiets: Diet[] = [];
  pageSize = 5;
  currentPage = 0;

  ngOnChanges(): void {
    this.updatePaginatedDiets();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedDiets();
  }

  updatePaginatedDiets(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDiets = this.diets.slice(start, end);
  }

  onDietClick(id: number) {
    this.dietSelected.emit(id);
  }
}
