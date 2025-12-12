// src/types/TransactionFeedResponse.ts

import type { Transaction } from './Transaction.js';

export interface TransactionFeedResponse {
    feedItems: Transaction[];
}