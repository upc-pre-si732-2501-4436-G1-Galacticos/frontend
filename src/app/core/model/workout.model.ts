import { Exercise } from './exercise.model';

export interface Workout {
  id: number;
  title: string;
  description: string;
  exercises: Exercise[];
}
