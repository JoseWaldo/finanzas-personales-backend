export type SubscriptionFrequency = "MONTHLY" | "YEARLY" | "QUARTERLY" | "BIWEEKLY" | "WEEKLY";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export interface SubscriptionTagEntity {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionEntity {
  id: string;
  name: string;
  amount: number;
  nextPaymentDate: Date;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  userId: string;
  tags: SubscriptionTagEntity[];
  createdAt: Date;
  updatedAt: Date;
}
