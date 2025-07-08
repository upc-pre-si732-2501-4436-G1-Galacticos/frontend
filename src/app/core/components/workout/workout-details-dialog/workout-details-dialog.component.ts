import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Workout} from '../../../model/workout.model';
import {WorkoutsService} from '../../../services/workouts.service';
import {WorkoutCreateDialogComponent} from '../workout-create-dialog/workout-create-dialog.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {GeminiService} from '../../../../gemini.service';

@Component({
  selector: 'app-workout-details-dialog',
  imports: [
    NgForOf,
    NgIf,
    TranslateModule,
    MatProgressSpinner
  ],
  templateUrl: './workout-details-dialog.component.html',
  styleUrl: './workout-details-dialog.component.css'
})
export class WorkoutDetailsDialogComponent {
  geminiTip: string = '';
  geminiStatistic: string = '';
  loadingGemini: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { workout: Workout; isCommunity: boolean; userId?: number },
    private dialogRef: MatDialogRef<WorkoutDetailsDialogComponent>,
    private workoutsSvc: WorkoutsService,
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
      if(!heightProfile || !weightProfile || !this.data.workout.title)return
      const tipPrompt = `Dame un tip breve, útil y práctico para alguien que sigue la rutina de ejercicios "${this.data.workout.title}". No uses frases genéricas ni motivacionales.`;
      this.geminiTip = await this.geminiService.generateContent(tipPrompt);
      const statPrompt = `Eres una persona que mide ${heightProfile} m y pesa ${weightProfile} kg. Basado en datos reales y comparativos anónimos, genera una estadística objetiva y sorprendente sobre los beneficios de realizar la rutina de ejercicios "${this.data.workout.title}". Limítate a una sola estadística concreta y breve. No incluyas explicaciones ni consejos.`;
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
    this.dialogRef.close({ setCurrent: this.data.workout });
  }
  edit() {
    // Abre el diálogo de creación en modo "editar"
    const ref = this.dialog.open(WorkoutCreateDialogComponent, {
      width: '600px',
      data: { workout: this.data.workout, editMode: true }
    });

    ref.afterClosed().subscribe(updated => {
      if (updated) {
        // si quieres, recarga o cierra pasándole un flag para refrescar lista
        this.dialogRef.close({ refreshed: true });
      }
    });
  }

}
