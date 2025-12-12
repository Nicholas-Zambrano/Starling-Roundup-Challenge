// src/logic/DateUtils.ts

export function getLastWeekRange(): { minTimestamp: string, maxTimestamp: string } {
    const now = new Date();
    // Calculate the time 7 days ago in milliseconds
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Starling API requires ISO 8601 strings
    return {
        // Transactions from 7 days ago
        minTimestamp: sevenDaysAgo.toISOString(), 
        // Transactions up to the current time
        maxTimestamp: now.toISOString(), 
    };
}