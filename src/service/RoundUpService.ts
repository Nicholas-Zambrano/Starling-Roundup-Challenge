// src/service/RoundUpService.ts

import { getAccounts, getTransactions, getSavingsGoals, createSavingsGoal, fundSavingsGoal } from '../api/StarlingClient.js';
import { getLastWeekRange } from '../logic/DateUtils.js';
import { calculateTotalRoundUp } from '../logic/RoundUpCalculator.js';

const ROUND_UP_GOAL_NAME = 'Round Up Savings Goal';

/**
 * Orchestrates the entire round-up process:
 * 1. Finds the primary account and category UIDs.
 * 2. Finds or creates the dedicated Savings Goal.
 * 3. Fetches transactions for the last week.
 * 4. Calculates the total round-up amount.
 * 5. Funds the Savings Goal with the calculated amount.
 * @returns Promise<void>
 */
export async function runRoundUpProcess(): Promise<string> {
    console.log("Starting Round-Up process...");

    // 1. Get Account UIDs
    const accountResponse = await getAccounts();
    const primaryAccount = accountResponse.accounts[0];

    if (!primaryAccount) {
        return "Error: No primary account found.";
    }

    const { accountUid, defaultCategory: categoryUid } = primaryAccount;
    console.log(`Found Account UID: ${accountUid} and Category UID: ${categoryUid}`);

    // 2. Find or Create Savings Goal
    let goalUid: string;
    const goalsResponse = await getSavingsGoals(accountUid);
    const existingGoal = goalsResponse.savingsGoalList.find(
        goal => goal.name === ROUND_UP_GOAL_NAME
    );

    if (existingGoal) {
        goalUid = existingGoal.savingsGoalUid;
        console.log(`Found existing goal: ${ROUND_UP_GOAL_NAME} (${goalUid})`);
    } else {
        const createResponse = await createSavingsGoal(accountUid, ROUND_UP_GOAL_NAME);
        goalUid = createResponse.savingsGoalUid;
        console.log(`Created new goal: ${ROUND_UP_GOAL_NAME} (${goalUid})`);
    }

    // 3. Get Date Range
    const { minTimestamp, maxTimestamp } = getLastWeekRange();
    console.log(`Fetching transactions between ${minTimestamp} and ${maxTimestamp}`);

    // 4. Get Transactions
    const transactionResponse = await getTransactions(
        accountUid,
        categoryUid,
        minTimestamp,
        maxTimestamp
    );
    const rawTransactions = transactionResponse.feedItems;
    console.log(`Retrieved ${rawTransactions.length} transactions.`);

    // 5. Calculate Round Up
    const totalRoundUpAmountMinorUnits = calculateTotalRoundUp(rawTransactions);
    
    if (totalRoundUpAmountMinorUnits === 0) {
        return "Process Complete: Total round-up amount is zero. No transfer necessary.";
    }

    const amountInPounds = (totalRoundUpAmountMinorUnits / 100).toFixed(2);
    console.log(`Calculated total round-up amount: £${amountInPounds} (${totalRoundUpAmountMinorUnits} minor units)`);

    // 6. Fund Savings Goal
    const fundResponse = await fundSavingsGoal(
        accountUid,
        goalUid,
        totalRoundUpAmountMinorUnits
    );

    if (fundResponse.success) {
        return `SUCCESS: Transferred £${amountInPounds} to goal ${ROUND_UP_GOAL_NAME}. Transfer UID: ${fundResponse.transferUid}`;
    } else {
        return `FAILURE: Transfer failed. Message: ${fundResponse.message}`;
    }
}