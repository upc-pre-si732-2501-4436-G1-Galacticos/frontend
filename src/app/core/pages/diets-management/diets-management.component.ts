import { Component, OnInit } from '@angular/core';
import { Diet } from '../../model/diet.model';
import { DietsService } from '../../services/diets.service';
import { DietDetailsDialogComponent } from '../../components/diet-details-dialog/diet-details-dialog.component';
import { DietListComponent } from '../../components/diet-list/diet-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-diets-management',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    DietListComponent,
  ],
  templateUrl: './diets-management.component.html',
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

  constructor(private dialog: MatDialog, private dietsService: DietsService) {}

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

  openDietDetails(dietId: number) {
    this.dietsService.getDietById(dietId).subscribe(diet => {
      const dialogRef = this.dialog.open(DietDetailsDialogComponent, {
        width: '400px',
        data: diet
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.assign) {
          this.assignCurrentDiet(result.dietId); // tu lógica existente aquí
        }
      });
    });
  }
}
