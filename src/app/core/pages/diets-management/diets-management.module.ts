import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { DietsManagementComponent } from './diets-management.component';
import { DietListComponent } from '../../components/diet/diet-list/diet-list.component';
import { DietDetailsDialogComponent } from '../../components/diet/diet-details-dialog/diet-details-dialog.component';
import { DietCreateDialogComponent } from '../../components/diet/diet-create-dialog/diet-create-dialog.component';
import { CommunityDietsDialogComponent } from '../../components/diet/community-diets-dialog/community-diets-dialog.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    CommunityDietsDialogComponent,
    DietCreateDialogComponent,
    DietDetailsDialogComponent,
    DietListComponent,

  ],
  exports: []
})
export class DietsManagementModule {}
