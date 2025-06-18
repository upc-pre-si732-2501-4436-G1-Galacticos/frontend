import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-diet-details-dialog',
  templateUrl: './diet-details-dialog.component.html',
  imports: [
    MatCardModule, MatButtonModule, NgForOf, NgIf
  ],
  styleUrls: ['./diet-details-dialog.component.css']
})
export class DietDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DietDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAssign() {
    this.dialogRef.close({ assign: true, dietId: this.data.id });
  }

  onClose() {
    this.dialogRef.close();
  }
}
