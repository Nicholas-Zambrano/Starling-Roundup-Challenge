// src/logic/RoundUpCalculator.ts

// Import the transaction type you defined
import type { Transaction } from '../types/Transaction.js'; 

/**
 * Calculates the total round-up amount (in minor units) for a list of transactions.
 * * Round-up Rule: Only SETTLED, OUTGOING transactions are included.
 * Round-up amount = 100 pence (1 pound) - (transaction amount in pence % 100)
 * * @param transactions The raw list of transactions from the feed.
 * @returns The total round-up amount in minor units (pence).
 */
export function calculateTotalRoundUp(transactions: Transaction[]): number {
    let totalRoundUpAmount = 0;

    // 1. Filter and Iterate
    for (const tx of transactions) {
        // Rule 1: Must be an OUTGOING transaction (spending)
        if (tx.direction !== 'OUT') {
            continue; 
        }
        
        // Rule 2: Must be SETTLED (finalized)
        if (tx.status !== 'SETTLED') {
            continue; 
        }

        const minorUnits = tx.amount.minorUnits;

        // 2. Calculate the Round-Up
        // Example: £4.35 is 435 minor units. 435 % 100 = 35 (the remainder/pence component).
        const remainder = minorUnits % 100;

        // If remainder is 0, the amount is already a whole pound (e.g., £5.00), so round-up is 0.
        if (remainder === 0) {
            continue;
        }

        // Calculate the amount needed to reach the next whole pound (100 pence)
        const roundUp = 100 - remainder;

        totalRoundUpAmount += roundUp;
    }

    return totalRoundUpAmount;
}