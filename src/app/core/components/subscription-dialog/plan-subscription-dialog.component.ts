import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-days-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, TranslateModule],
  templateUrl: './plan-subscription-dialog.component.html',
  styleUrls: ['./plan-subscription-dialog.component.css']
})
export class SubscriptionDaysDialogComponent {
  days: number = 7;

  constructor(private dialogRef: MatDialogRef<SubscriptionDaysDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(this.days);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
