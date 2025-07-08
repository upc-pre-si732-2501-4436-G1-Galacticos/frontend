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
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {GeminiService} from '../../../../gemini.service';

@Component({
  selector: 'app-diet-details-dialog',
  templateUrl: './diet-details-dialog.component.html',
  imports: [
    NgForOf,
    NgIf,
    TranslateModule,
    MatProgressSpinner
  ],
  styleUrls: ['./diet-details-dialog.component.css']
})
export class DietDetailsDialogComponent {
  geminiTip: string = '';
  geminiStatistic: string = '';
  loadingGemini: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { diet: Diet; isCommunity: boolean; userId?: number },
    private dialogRef: MatDialogRef<DietDetailsDialogComponent>,
    private dietsSvc: DietsService,
    private dialog: MatDialog,
    private geminiService: GeminiService

  ) {}
  ngOnInit(): void {
    this.loadGeminiContent();
  }
  async loadGeminiContent(): Promise<void> {
    try {

      const heightProfile = localStorage.getItem('heightProfile');
      const weightProfile =localStorage.getItem('weightProfile');
      if(!heightProfile || !weightProfile || !this.data.diet.title)return
      const tipPrompt = `Dame un tip conciso y útil para alguien que sigue la dieta "${this.data.diet.title}".`;
      this.geminiTip = await this.geminiService.generateContent(tipPrompt);

      const statPrompt = `Según una persona que mide ${heightProfile} metros y pesa ${weightProfile} kg, dame una estadística anónima, objetiva y comparativa sobre los beneficios de seguir la dieta "${this.data.diet.title}". Usa un lenguaje directo, sin opiniones, y limita la respuesta a un solo dato estadístico relevante.`;
      this.geminiStatistic = await this.geminiService.generateContent(statPrompt);
    } catch (err) {
      this.geminiTip = 'No se pudo obtener el tip.';
      this.geminiStatistic = 'No se pudo obtener la estadística.';
      console.error('Error al obtener contenido de Gemini:', err);
    } finally {
      this.loadingGemini = false;
    }
  }
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
