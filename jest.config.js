// jest.config.js

export default {
    // 1. ADD: Tells Jest to treat .ts files as ES Modules
    extensionsToTreatAsEsm: [".ts"],
    
    // Use the ts-jest preset to transform TypeScript files
    preset: 'ts-jest',

    // 2. ADD: Passes the useESM flag to ts-jest
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },

    // 3. ADD: Ensures Node.js is the test environment 
    testEnvironment: "node",

    // 4. ADD: Necessary to resolve imports like './StarlingClient.js' back to source file
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1", 
    },
    
    // Jest will look for test files ending in .test.ts or .spec.ts
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    
    // Directory for coverage reports
    collectCoverage: true,

    // Ignore node_modules, dist, etc.
    testPathIgnorePatterns: ["/node_modules/"],

};