// __mocks__/uuid.js

// We'll use a fixed ID here
const MOCK_UUID = 'test-goal-789';

// The v4 function is what the client imports
export const v4 = () => MOCK_UUID; 

// export all other functions (required by Jest)
export default {
    v4
};