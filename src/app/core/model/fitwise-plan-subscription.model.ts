export interface FitwisePlanSubscriptionModel {
  id: number;
  fitwisePlanId: number;
  userId: number;
  subscriptionStartDate: string;
  endDate: string;
  isActive: boolean;
  notes: string;
}

