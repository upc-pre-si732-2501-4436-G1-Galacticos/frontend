import { Meal } from './meal.model';

export interface Diet {
  id: number;
  title: string;
  note: string;
  meals: Meal[];
}
