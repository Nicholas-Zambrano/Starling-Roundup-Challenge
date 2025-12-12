// src/api/StarlingClient.ts


import type { AccountResponse } from '../types/AccountResponse.js'; 
import type { TransactionFeedResponse } from '../types/TransactionFeedResponse.js';
import type { SavingsGoalsResponse, CreateGoalResponse, FundGoalResponse } from '../types/SavingsGoal.js'; 
import { v4 as realUuidV4 } from 'uuid'; 

// Safely access environment variables
const BASE_URL = process.env.REACT_APP_STARLING_BASE_URL;
const ACCESS_TOKEN = process.env.REACT_APP_STARLING_ACCESS_TOKEN;

if (!BASE_URL || !ACCESS_TOKEN) {
    throw new Error("Missing environment variables. Check your .env file.");
}

// Helper to define consistent headers
const getHeaders = (contentType?: string) => ({
    'Accept': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`, 
    'User-Agent': 'Amandla Kiesser App',
    ...(contentType && { 'Content-Type': contentType }),
});


/**
 * Fetches the customer's accounts to get UIDs needed for subsequent calls.
 */
export async function getAccounts(): Promise<AccountResponse> {
  const url = `${BASE_URL}/api/v2/accounts`;
  // ... (rest of getAccounts remains the same)
  const response = await fetch(url, { method: 'GET', headers: getHeaders(), });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to retrieve accounts. Status: ${response.status}. Body: ${errorBody}`);
  }
  return await response.json() as AccountResponse;
}


/**
 * Fetches all transactions for a given period using the Account and Category UIDs.
 */
export async function getTransactions(
    accountUid: string, 
    categoryUid: string, 
    minDate: string, 
    maxDate: string
): Promise<TransactionFeedResponse> {
    const url = `${BASE_URL}/api/v2/feed/account/${accountUid}/category/${categoryUid}/transactions-between?minTransactionTimestamp=${minDate}&maxTransactionTimestamp=${maxDate}`;
    
    const response = await fetch(url, { method: 'GET', headers: getHeaders(), });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to retrieve transactions. Status: ${response.status}. Body: ${errorBody}`);
    }
    return await response.json() as TransactionFeedResponse;
}


/**
 * Fetches the list of existing Savings Goals for the customer.
 */
export async function getSavingsGoals(accountUid: string): Promise<SavingsGoalsResponse> {
    const url = `${BASE_URL}/api/v2/account/${accountUid}/savings-goals`;
    
    const response = await fetch(url, { method: 'GET', headers: getHeaders(), });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to retrieve savings goals. Status: ${response.status}. Body: ${errorBody}`);
    }
    return await response.json() as SavingsGoalsResponse;
}


/**
 * Creates a new Savings Goal.
 * Uses dependency injection for uuidV4 for testing purposes.
 */
export async function createSavingsGoal(
    accountUid: string, 
    goalName: string,
    // Dependency Injection: Default to real function, but allow mock during test
    uuidV4: () => string = realUuidV4 
): Promise<CreateGoalResponse> {
    
    const goalUid = uuidV4(); 
    const url = `${BASE_URL}/api/v2/account/${accountUid}/savings-goals/${goalUid}`;

    const requestBody = {
        name: goalName,
        currency: 'GBP',
        target: { currency: 'GBP', minorUnits: 100000 },
        base64EncodedPhoto: null, 
    };

    const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders('application/json'),
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create savings goal. Status: ${response.status}. Body: ${errorBody}`);
    }
    return await response.json() as CreateGoalResponse;
}


/**
 * Funds an existing Savings Goal by transferring the calculated round-up amount.
 * Uses dependency injection for uuidV4 for testing purposes.
 */
export async function fundSavingsGoal(
    accountUid: string,
    goalUid: string,
    amountMinorUnits: number,
    // Dependency Injection: Default to real function, but allow mock during test
    uuidV4: () => string = realUuidV4 
): Promise<FundGoalResponse> {
    
    const transferUid = uuidV4(); // Use the injected/default function
    const url = `${BASE_URL}/api/v2/account/${accountUid}/savings-goals/${goalUid}/add-money/${transferUid}`;

    const requestBody = {
        amount: { currency: 'GBP', minorUnits: amountMinorUnits },
    };

    const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders('application/json'),
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fund savings goal. Status: ${response.status}. Body: ${errorBody}`);
    }
    return await response.json() as FundGoalResponse;
}