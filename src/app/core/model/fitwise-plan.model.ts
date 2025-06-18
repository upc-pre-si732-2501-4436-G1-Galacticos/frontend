export interface FitwisePlanModel {
  id: number;
  title: string;
  description: string;
  dietId: number;
  workoutId: number;
  tagNames: string[];
}
