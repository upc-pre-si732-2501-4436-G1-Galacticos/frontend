import {Component, Inject, Input} from '@angular/core';
import { Diet } from '../../../model/diet.model';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { DietsService } from '../../../services/diets.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {DietCreateDialogComponent} from '../diet-create-dialog/diet-create-dialog.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-diet-details-dialog',
  templateUrl: './diet-details-dialog.component.html',
  imports: [
    NgForOf,
    NgIf,
    TranslateModule
  ],
  styleUrls: ['./diet-details-dialog.component.css']
})
export class DietDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { diet: Diet; isCommunity: boolean; userId?: number },
    private dialogRef: MatDialogRef<DietDetailsDialogComponent>,
    private dietsSvc: DietsService,
    private dialog: MatDialog

  ) {}

  close() {
    this.dialogRef.close();
  }

  makeCurrent() {
    this.dialogRef.close({ setCurrent: this.data.diet });
  }
  edit() {
    // Abre el diálogo de creación en modo "editar"
    const ref = this.dialog.open(DietCreateDialogComponent, {
      width: '600px',
      data: { diet: this.data.diet, editMode: true }
    });

    ref.afterClosed().subscribe(updated => {
      if (updated) {
        // si quieres, recarga o cierra pasándole un flag para refrescar lista
        this.dialogRef.close({ refreshed: true });
      }
    });
  }
}
