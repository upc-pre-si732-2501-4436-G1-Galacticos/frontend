import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Diet } from '../../../model/diet.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-diet-list',
  templateUrl: './diet-list.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./diet-list.component.css']
})
export class DietListComponent {
  @Input() diets: Diet[] = [];
  @Output() selectDiet = new EventEmitter<Diet>();

  onSelect(diet: Diet) {
    this.selectDiet.emit(diet);
  }
}
