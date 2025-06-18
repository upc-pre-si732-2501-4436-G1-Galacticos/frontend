import { Exercise } from './exercise.model';

export interface Workout {
  id: number;
  title: string;
  note: string;
  exercises: Exercise[];
}
