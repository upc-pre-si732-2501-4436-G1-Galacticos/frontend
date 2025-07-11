import { Meal } from './meal.model';

export interface Diet {
  id: number;
  title: string;
  description: string;
  meals: Meal[];
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}
