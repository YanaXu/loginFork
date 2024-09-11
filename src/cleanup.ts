import * as core from '@actions/core';
import { setUserAgent, cleanupAzCLIAccounts, cleanupAzPSAccounts } from './common/Utils';

async function cleanup() {
    try {
        setUserAgent();
        await cleanupAzCLIAccounts();
        if (core.getInput('enable-AzPSSession').toLowerCase() === "true") {
            await cleanupAzPSAccounts();
        }
    }
    catch (error) {
        if (error && error.message) {
            core.warning(`Login cleanup failed due to the reason: '${error.message}'. Cleanup will be skipped. If the cleanup step should NOT be run, please set environment variable 'AZURE_LOGIN_SKIP_PRE' or 'AZURE_LOGIN_SKIP_POST' to true.`); 
        } else { 
            core.warning(`Login cleanup failed due to the reason: '${error}'. Cleanup will be skipped. If the cleanup step should NOT be run, please set environment variable 'AZURE_LOGIN_SKIP_PRE' or 'AZURE_LOGIN_SKIP_POST' to true.`); 
        }
        core.debug(error.stack);
    }
}

cleanup();

