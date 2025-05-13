import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-routine-details-dialog',
  imports: [
    MatButtonModule,
    MatCardModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './routine-details-dialog.component.html',
  styleUrl: './routine-details-dialog.component.css'
})
export class RoutineDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RoutineDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAssign() {
    this.dialogRef.close({ assign: true, routineId: this.data.id });
  }

  onClose() {
    this.dialogRef.close();
  }
}
