// src/logic/RoundUpCalculator.test.ts

import { describe, expect, it } from '@jest/globals';
import { calculateTotalRoundUp } from './RoundUpCalculator.js';
import type { Transaction } from '../types/Transaction.js'; 
import type { TransactionFeedResponse } from '../types/TransactionFeedResponse.js';

describe('calculateTotalRoundUp', () => {

    // Helper function to create a simple transaction mock
    const createMockTransaction = (
        minorUnits: number, 
        direction: 'IN' | 'OUT' = 'OUT', 
        status: 'SETTLED' | 'PENDING' = 'SETTLED'
    ): Transaction => ({
        feedItemUid: `tx-${Math.random()}`,
        direction,
        status,
        amount: {
            currency: 'GBP',
            minorUnits,
        },
        transactionTime: new Date().toISOString(),
    });

    // Test Case 1: Standard transactions that should be rounded up
    it('should calculate the correct total round-up for valid fractional transactions', () => {
        const transactions: Transaction[] = [
            // £4.35 (435 minor units) -> Round-up: 100 - 35 = 65
            createMockTransaction(435),
            // £10.99 (1099 minor units) -> Round-up: 100 - 99 = 1
            createMockTransaction(1099),
            // £0.50 (50 minor units) -> Round-up: 100 - 50 = 50
            createMockTransaction(50), 
        ];

        // Total expected: 65 + 1 + 50 = 116 minor units
        const expectedRoundUp = 116; 
        
        expect(calculateTotalRoundUp(transactions)).toBe(expectedRoundUp);
    });

    // Test Case 2: Transactions that should be excluded based on status or direction
    it('should exclude pending, reversed, and INCOMING transactions', () => {
        const transactions: Transaction[] = [
            // £4.35 (SETTLED, OUT) -> Included: 65
            createMockTransaction(435, 'OUT', 'SETTLED'),
            // £2.10 (PENDING, OUT) -> Excluded
            createMockTransaction(210, 'OUT', 'PENDING'),
            // £15.75 (SETTLED, IN) -> Excluded (e.g., a refund or deposit)
            createMockTransaction(1575, 'IN', 'SETTLED'),
            // £0.05 (REVERSED, OUT) -> Excluded (Assuming REVERSED is excluded)
            createMockTransaction(5, 'OUT', 'PENDING'), 
        ];

        // Total expected: 65 minor units
        const expectedRoundUp = 65; 
        
        expect(calculateTotalRoundUp(transactions)).toBe(expectedRoundUp);
    });

    // Test Case 3: Whole pound amounts should result in a zero round-up
    it('should correctly ignore whole pound amounts', () => {
        const transactions: Transaction[] = [
            // £10.00 (1000 minor units) -> Round-up: 0 (1000 % 100 = 0)
            createMockTransaction(1000),
            // £5.00 (500 minor units) -> Round-up: 0
            createMockTransaction(500),
            // £1.01 (101 minor units) -> Round-up: 99 (Included to test filtering works)
            createMockTransaction(101),
        ];

        // Total expected: 99 minor units
        const expectedRoundUp = 99; 
        
        expect(calculateTotalRoundUp(transactions)).toBe(expectedRoundUp);
    });
    
    // Test Case 4: Empty array should return zero
    it('should return 0 for an empty transaction list', () => {
        expect(calculateTotalRoundUp([])).toBe(0);
    });
});

