//  the structure of a single bank account object
export interface Account {
  accountUid: string;       // Needed for transaction feed and savings goals
  defaultCategory: string;  // Needed as the {categoryUid} for the transaction feed
  currency: string;
  name: string;
}