
import { runRoundUpProcess } from './service/RoundUpService.js';

runRoundUpProcess()
    .then(result => {
        console.log("\n--- PROCESS RESULT ---");
        console.log(result);
        console.log("----------------------\n");
    })
    .catch(error => {
        console.error("\n--- FATAL ERROR ---");
        console.error("An unhandled exception occurred:", error.message);
        console.error("-------------------\n");
    });