// src/app/core/pages/diets-management/diets-management.component.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule }      from '@angular/material/button';
import { MatDialog, MatDialogModule }  from '@angular/material/dialog';

import { Diet }                 from '../../model/diet.model';
import { DietsService }         from '../../services/diets.service';

import { DietCreateDialogComponent }     from '../../components/diet/diet-create-dialog/diet-create-dialog.component';
import { DietDetailsDialogComponent }    from '../../components/diet/diet-details-dialog/diet-details-dialog.component';
import { CommunityDietsDialogComponent } from '../../components/diet/community-diets-dialog/community-diets-dialog.component';
import { DietListComponent }             from '../../components/diet/diet-list/diet-list.component';

import { tap, switchMap }       from 'rxjs/operators';
import { of }                   from 'rxjs';

@Component({
  selector: 'app-diets-management',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    MatButtonModule,
    MatDialogModule,
    DietListComponent,
  ],
  templateUrl: './diets-management.component.html',
  styleUrls: ['./diets-management.component.css']
})
export class DietsManagementComponent implements OnInit {
  myDiets: Diet[] = [];
  currentDiet?: Diet;
  currentUserId = Number(localStorage.getItem('userId'));

  constructor(
    private dietsSvc: DietsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadMyDiets();
  }

  private loadMyDiets() {
    this.dietsSvc.getDietsByUser(this.currentUserId)
      .pipe(
        tap(ds => this.myDiets = ds),
        switchMap(() => {
          const stored = localStorage.getItem('currentDietId');
          return stored
            ? this.dietsSvc.getDietById(+stored)
            : of(null);
        })
      )
      .subscribe(d => {
        if (d) {
          this.currentDiet = d;
        }
      });
  }

  openCreateDialog() {
    const ref = this.dialog.open(DietCreateDialogComponent, {
      data: { userId: this.currentUserId }
    });
    ref.afterClosed().subscribe((created: Diet) => {
      if (created?.id) {
        this.myDiets.push(created);
        this.setCurrentDiet(created);
      }
    });
  }

  openCommunityDialog() {
    const ref = this.dialog.open(CommunityDietsDialogComponent, {
      data: { userId: this.currentUserId }
    });
    ref.afterClosed().subscribe((selected: Diet) => {
      if (selected?.id) {
        this.setCurrentDiet(selected);
      }
    });
  }

  openDetails(diet: Diet, isCommunity: boolean = false) {
    const ref = this.dialog.open(DietDetailsDialogComponent, {
      data: { diet, isCommunity, userId: this.currentUserId }
    });

    ref.afterClosed().subscribe(result => {
      // 1) Si devuelve { setCurrent: Diet }
      if ((result as any)?.setCurrent) {
        this.setCurrentDiet((result as any).setCurrent);
      }
      // 2) Si es un Diet (actualizado en modo propio)
      else if ((result as Diet)?.id) {
        const upd = result as Diet;
        this.myDiets = this.myDiets.map(d => d.id === upd.id ? upd : d);
      }
      // 3) Si confirma desde comunidad (true)
      else if (isCommunity && result === true) {
        this.dietsSvc.assignDietToUser(diet.id, this.currentUserId)
          .subscribe(() => this.loadMyDiets());
      }
    });
  }

  private setCurrentDiet(d: Diet) {
    this.currentDiet = d;
    localStorage.setItem('currentDietId', d.id.toString());
  }

}
