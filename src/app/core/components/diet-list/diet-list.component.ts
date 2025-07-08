import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Diet } from '../../model/diet.model';

@Component({
  selector: 'app-diet-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './diet-list.component.html',
  styleUrls: ['./diet-list.component.css']
})
export class DietListComponent {
  @Input() diets: Diet[] = [];
  @Output() dietSelected = new EventEmitter<number>();

  onDietClick(id: number): void {
    this.dietSelected.emit(id);
  }
}
