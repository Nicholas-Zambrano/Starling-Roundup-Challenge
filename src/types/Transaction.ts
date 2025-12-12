
export interface Amount {
    currency: 'GBP'; 
    minorUnits: number; // The amount in pence (e.g., £4.35 is 435 minor units)
}

export interface Transaction {
    feedItemUid: string;
    direction: 'IN' | 'OUT'; // Must be 'OUT' (spending) for round-up calculation
    status: 'PENDING' | 'SETTLED' | 'REVERSED'; // Must be 'SETTLED'
    amount: Amount;
    transactionTime: string; // The time the transaction was initiated
    // SettlementTime is often useful but optional for basic filtering:
    // settlementTime?: string; 
}