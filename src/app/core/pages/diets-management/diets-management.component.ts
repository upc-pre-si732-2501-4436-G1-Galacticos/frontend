import { Component, OnInit } from '@angular/core';
import { Diet } from '../../model/diet.model';
import { DietsService } from '../../services/diets.service';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-diets-management',
  standalone: true,
  templateUrl: './diets-management.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./diets-management.component.css']
})
export class DietsManagementComponent implements OnInit {
  diets: Diet[] = [];
  currentDiet?: Diet;
  newDiet: Partial<Diet> = {
    title: '',
    note: '',
    meals: []
  };

  constructor(private dietsService: DietsService) {}

  ngOnInit(): void {
    this.loadDiets();
  }

  loadDiets(): void {
    this.dietsService.getAllDiets().subscribe(diets => this.diets = diets);
  }

  createDiet(): void {
    if (this.newDiet.title && this.newDiet.note) {
      const fakeId = Date.now();
      const newDiet: Diet = {
        id: fakeId,
        title: this.newDiet.title!,
        note: this.newDiet.note!,
        meals: []
      };
      this.diets.push(newDiet);
      this.newDiet = { title: '', note: '', meals: [] };
    }
  }

  assignCurrentDiet(diet: Diet): void {
    this.currentDiet = diet;
  }
}
