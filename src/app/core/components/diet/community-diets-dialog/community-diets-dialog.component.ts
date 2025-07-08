// src/app/core/components/community-diets-dialog/community-diets-dialog.component.ts
import { Component, OnInit }           from '@angular/core';
import { CommonModule, NgForOf }        from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DietDetailsDialogComponent }   from '../diet-details-dialog/diet-details-dialog.component';
import { Diet }                         from '../../../model/diet.model';
import { DietsService }                 from '../../../services/diets.service';
import {forkJoin} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-community-diets-dialog',
  standalone: true,
  imports: [ CommonModule, NgForOf, MatDialogModule, TranslateModule ],
  templateUrl: './community-diets-dialog.component.html',
  styleUrls: ['./community-diets-dialog.component.css']
})
export class CommunityDietsDialogComponent implements OnInit {
  communityDiets: Diet[] = [];
  private userId = Number(localStorage.getItem('userId'));

  constructor(
    private dietsSvc: DietsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CommunityDietsDialogComponent>
  ) {}

  ngOnInit(): void {
    // Cargo TODAS las dietas + las de mi usuario y filtro
    forkJoin({
      all: this.dietsSvc.getAllDiets(),
      mine: this.dietsSvc.getDietsByUser(this.userId)
    }).subscribe(({ all, mine }) => {
      const mineIds = new Set(mine.map(d => d.id));
      this.communityDiets = all.filter(d => !mineIds.has(d.id));
    });
  }

  openDetails(diet: Diet) {
    const ref = this.dialog.open(DietDetailsDialogComponent, {
      data: { diet, isCommunity: true, userId: this.userId }
    });
    ref.afterClosed().subscribe(result => {
      // esperamos un objeto con { setCurrent: Diet }
      if ((result as any)?.setCurrent) {
        // cerramos el diálogo de comunidad devolviendo el setCurrent
        this.dialogRef.close((result as any).setCurrent);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
