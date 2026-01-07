export type TransactionType = "income" | "expense" | "fixedExpense" | "goal";

export interface CardItem {
  id: string;
  title?: string;
  name?: string;
  amount?: number;
  type?: TransactionType; 
  value?: number;
  category?: string;
  subscriptionType?: string;
  date?: string;
  nextBilling?: string;
  goalName?: string;
  goalValue?: number;
  goalDeadline?: string;
  createdAt?: string;
}