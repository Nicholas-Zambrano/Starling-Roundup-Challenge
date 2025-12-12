// src/logic/DateUtils.test.ts

import { jest, describe, expect, it } from '@jest/globals';
import { getLastWeekRange } from './DateUtils.js';

describe('getLastWeekRange', () => {
    // 1. Tell Jest to replace the real timers with fake ones
    jest.useFakeTimers();

    it('should return a valid ISO 8601 date range', () => {
        // Set the system clock to a known point in time
        const MOCK_DATE = new Date('2025-12-11T17:54:09.000Z');
        jest.setSystemTime(MOCK_DATE);

        const range = getLastWeekRange();
        
        // Assert the maximum is the mocked current time
        expect(range.maxTimestamp).toBe(MOCK_DATE.toISOString()); 
    });

    it('should ensure the difference between min and max is exactly 7 days', () => {
        // Set the system clock again for this test
        const MOCK_DATE = new Date('2025-12-11T17:54:09.000Z');
        jest.setSystemTime(MOCK_DATE);
        
        const range = getLastWeekRange();
        
        const minTime = new Date(range.minTimestamp).getTime();
        const maxTime = new Date(range.maxTimestamp).getTime();

        const SEVEN_DAYS_MS = 604800000;

        // Assert that the difference is exactly 7 days
        expect(maxTime - minTime).toBe(SEVEN_DAYS_MS);
    });
    
    // 3. Clean up timers after the suite runs
    afterAll(() => {
        jest.useRealTimers();
    });
});