import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { GeminiService } from '../../../gemini.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; // Ajusta si es necesario

@Component({
  selector: 'app-routine-details-dialog',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './routine-details-dialog.component.html',
  styleUrls: ['./routine-details-dialog.component.css']
})
export class RoutineDetailsDialogComponent implements OnInit {
  geminiTip: string = '';
  geminiStatistic: string = '';
  loadingGemini: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<RoutineDetailsDialogComponent>,
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
      const tipPrompt = `Dame un tip breve, útil y práctico para alguien que sigue la rutina de ejercicios "${this.data.title}". No uses frases genéricas ni motivacionales.`;
      this.geminiTip = await this.geminiService.generateContent(tipPrompt);
      const statPrompt = `Eres una persona que mide ${heightProfile} m y pesa ${weightProfile} kg. Basado en datos reales y comparativos anónimos, genera una estadística objetiva y sorprendente sobre los beneficios de realizar la rutina de ejercicios "${this.data.title}". Limítate a una sola estadística concreta y breve. No incluyas explicaciones ni consejos.`;
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
    this.dialogRef.close({ assign: true, routineId: this.data.id });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
