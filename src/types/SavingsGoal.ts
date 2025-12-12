
export interface SavingsGoal {
    savingsGoalUid: string;
    name: string;
    //  other necessary properties
    currency: string;
    target: {
        currency: string;
        minorUnits: number;
    };
    totalSaved: {
        currency: string;
        minorUnits: number;
    }
}

export interface SavingsGoalsResponse {
    savingsGoalList: SavingsGoal[];
}

export interface CreateGoalResponse {
    savingsGoalUid: string;
    success: boolean;
    message?: string;
}

export interface FundGoalResponse {
    transferUid: string;
    success: boolean;
    message?: string;
}