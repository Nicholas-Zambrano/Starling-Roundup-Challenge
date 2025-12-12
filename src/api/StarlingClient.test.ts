
import { jest, beforeAll, afterAll, describe, expect, beforeEach } from '@jest/globals';
// We import all functions, including the ones with the new signature
import { getAccounts, getTransactions, getSavingsGoals, createSavingsGoal, fundSavingsGoal } from './StarlingClient.js'; 
import type { AccountResponse } from '../types/AccountResponse.js';
import type { TransactionFeedResponse } from '../types/TransactionFeedResponse.js';
import type { SavingsGoalsResponse, CreateGoalResponse, FundGoalResponse } from '../types/SavingsGoal.ts';

// --- GLOBAL SETUP & CONSTANTS ---
const MOCK_ACCOUNT_UID = 'test-acc-123';
const MOCK_CATEGORY_UID = 'test-cat-456';
const MOCK_GOAL_UID = 'test-goal-789';

// DEFINE MOCK UUID FUNCTIONS (
const mockGoalUuidV4 = jest.fn(() => MOCK_GOAL_UID);
const mockTransferUuidV4 = jest.fn(() => 'transfer-abc'); 

// Declare the spy instance globally
let fetchSpy: any;

beforeAll(() => {
    fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({} as any); 
    });
});

afterAll(() => {
    fetchSpy.mockRestore(); 
});

beforeEach(() => {
    fetchSpy.mockClear();
});


// test 1 : getAccounts (Unchanged) ---
describe('getAccounts', () => { /* ... Unchanged ... */ });

// test 2 : getTransactions (Unchanged) ---
describe('getTransactions', () => { /* ... Unchanged ... */ });

// test 3: getSavingsGoals (Unchanged) ---
describe('getSavingsGoals', () => { /* ... Unchanged ... */ });


// test 4: createSavingsGoal (UPDATED) ---
describe('createSavingsGoal', () => {
    const GOAL_NAME = 'My Test Round-Up Goal';
    

    const mockCreateResponse: CreateGoalResponse = {
        savingsGoalUid: MOCK_GOAL_UID,
        success: true,
        message: 'Savings goal created',
    };

    it('should successfully create a new savings goal', async () => {
        // Clear mock history on the function we are injecting
        mockGoalUuidV4.mockClear(); 
        
        fetchSpy.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockCreateResponse),
            status: 200,
            text: () => Promise.resolve(JSON.stringify(mockCreateResponse)),
        } as any);

        // puy THE MOCK FUNCTION as  3rd argument
        const data = await createSavingsGoal(MOCK_ACCOUNT_UID, GOAL_NAME, mockGoalUuidV4); 

        expect(data.success).toBe(true);
        expect(data.savingsGoalUid).toBe(MOCK_GOAL_UID);
        expect(mockGoalUuidV4).toHaveBeenCalledTimes(1); // Check our mock was used
        
        // add the URL uses the MOCK_GOAL_UID
        const expectedUrl = `https://api-sandbox.starlingbank.com/api/v2/account/${MOCK_ACCOUNT_UID}/savings-goals/${MOCK_GOAL_UID}`;
        expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining(`"name":"${GOAL_NAME}"`),
        }));
    });
    
    it('should throw an error if goal creation fails', async () => {
        fetchSpy.mockResolvedValue({
            ok: false,
            status: 400,
            text: () => Promise.resolve('{"error":"Invalid goal name"}'),
        } as any);
        
        // Pass the mock function here too, though it won't be called if the fetch fails instantly
        await expect(createSavingsGoal(MOCK_ACCOUNT_UID, GOAL_NAME, mockGoalUuidV4)).rejects.toThrow('Failed to create savings goal. Status: 400');
    });
});


// test 5: fundSavingsGoal (NEWLY ADDED) ---
describe('fundSavingsGoal', () => {
    const FUND_AMOUNT = 500; 
    
    const mockFundResponse: FundGoalResponse = {
        transferUid: 'transfer-abc',
        success: true,
        message: 'Goal funded',
    };

    it('should successfully fund the savings goal with the correct amount', async () => {
        mockTransferUuidV4.mockClear(); // Clear history of transfer mock

        fetchSpy.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockFundResponse),
            status: 200,
            text: () => Promise.resolve(JSON.stringify(mockFundResponse)),
        } as any);

        // 💥 INJECT THE TRANSFER MOCK FUNCTION as the 4th argument
        const data = await fundSavingsGoal(MOCK_ACCOUNT_UID, MOCK_GOAL_UID, FUND_AMOUNT, mockTransferUuidV4); 
        
        expect(data.success).toBe(true);
        expect(mockTransferUuidV4).toHaveBeenCalledTimes(1); 
        
        // add the URL uses the MOCK TRANSFER UID
        const expectedUrl = `https://api-sandbox.starlingbank.com/api/v2/account/${MOCK_ACCOUNT_UID}/savings-goals/${MOCK_GOAL_UID}/add-money/transfer-abc`; 
        
        expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining(`"minorUnits":${FUND_AMOUNT}`), 
        }));
    });
    
    it('should throw an error if funding fails', async () => {
        fetchSpy.mockResolvedValue({
            ok: false,
            status: 400,
            text: () => Promise.resolve('{"error":"Insufficient funds"}'),
        } as any);

        // Inject the mock function here as well
        await expect(fundSavingsGoal(MOCK_ACCOUNT_UID, MOCK_GOAL_UID, FUND_AMOUNT, mockTransferUuidV4)).rejects.toThrow('Failed to fund savings goal. Status: 400');
    });
});