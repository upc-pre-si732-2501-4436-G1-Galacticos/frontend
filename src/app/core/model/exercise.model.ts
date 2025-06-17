export interface Exercise {
  id?: number;          // El ID es opcional porque no existe al crear el ejercicio
  title: string;        // Campo obligatorio en el backend
  description: string;  // Campo obligatorio en el backend
  userId?: number;      // Lo maneja el backend, opcional en el front
}
