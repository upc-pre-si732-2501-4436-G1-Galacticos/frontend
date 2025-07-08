import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { GeminiService } from '../../../gemini.service'; // Asegúrate de la ruta
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-diet-details-dialog',
  templateUrl: './diet-details-dialog.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./diet-details-dialog.component.css']
})
export class DietDetailsDialogComponent implements OnInit {
  geminiTip: string = '';
  geminiStatistic: string = '';
  loadingGemini: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DietDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private geminiService: GeminiService
  ) {}

  ngOnInit(): void {
    this.loadGeminiContent();
  }

  async loadGeminiContent(): Promise<void> {
    try {

      const heightProfile = localStorage.getItem('heightProfile');
      const weightProfile =localStorage.getItem('weightProfile');
      if(!heightProfile || !weightProfile)return
      const tipPrompt = `Dame un tip conciso y útil para alguien que sigue la dieta "${this.data.title}".`;
      this.geminiTip = await this.geminiService.generateContent(tipPrompt);

      const statPrompt = `Según una persona que mide ${heightProfile} metros y pesa ${weightProfile} kg, dame una estadística anónima, objetiva y comparativa sobre los beneficios de seguir la dieta "${this.data.title}". Usa un lenguaje directo, sin opiniones, y limita la respuesta a un solo dato estadístico relevante.`;
      this.geminiStatistic = await this.geminiService.generateContent(statPrompt);
    } catch (err) {
      this.geminiTip = 'No se pudo obtener el tip.';
      this.geminiStatistic = 'No se pudo obtener la estadística.';
      console.error('Error al obtener contenido de Gemini:', err);
    } finally {
      this.loadingGemini = false;
    }
  }

  onAssign(): void {
    this.dialogRef.close({ assign: true, dietId: this.data.id });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
