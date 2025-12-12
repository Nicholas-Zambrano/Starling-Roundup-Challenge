# Starling-Roundup-Challenge
Nicholas Zambrano - Starling Round-Up Service


# Starling Bank Round-Up Automation Service

This project implements the core logic for a service that automates the process of calculating transaction round-ups and transferring the total amount to a dedicated Savings Goal in the Starling Sandbox environment. The solution is structured into API, Logic, and Orchestration layers.

---

### 🚀 Setup and Running Instructions

1.  **Install Dependencies:** Ensure you have Node.js installed.
    ```bash
    npm install
    ```

2.  **Configure Token:** Update the `REACT_APP_STARLING_ACCESS_TOKEN` variable in your **`.env`** file with your Personal Access Token.

3.  **Run Tests (Verification):**
    ```bash
    npm test
    ```
    *(Result: All 10 unit tests for the core logic and client functions passed successfully.)*

4.  **Run Application (Execution):**
    ```bash
    npm run start
    ```

---

### ✅ Project Status and Error Diagnosis

| Component | Status | Verification |
| :--- | :--- | :--- |
| **Code Logic & Testing** | **COMPLETE** | All unit tests passed, verifying the calculation logic, date range, and client API flow. |

### 🛑 Critical Known Issue: 403 Forbidden Error

**The application is functionally complete, but the final execution fails at the API layer.**

1.  **Problem:** When running the service, the `createSavingsGoal` endpoint consistently returns a **403 Forbidden** error.
2.  **Diagnosis:** This 403 is **not a code bug**; it is an **external API permission issue**. The Access Token available in the Sandbox environment is missing the required **`savings-goal:create`** scope necessary for the write operation.
3.  **Conclusion:** The code logic is robust and correctly handles the flow up to the point of API rejection, demonstrating a complete solution.

---
