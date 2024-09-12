import * as core from '@actions/core';
import { cleanupAzCLIAccounts, cleanupAzPSAccounts, setUserAgent } from './common/Utils'; 
import { AzPSLogin } from './PowerShell/AzPSLogin';
import { LoginConfig } from './common/LoginConfig';
import { AzureCliLogin } from './Cli/AzureCliLogin';

async function main() {
    core.warning("I'm in main!");
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
    
    try {
        // prepare the login configuration
        var loginConfig = new LoginConfig();
        await loginConfig.initialize();
        await loginConfig.validate();

        // login to Azure CLI
        var cliLogin = new AzureCliLogin(loginConfig);
        await cliLogin.login();

        //login to Azure PowerShell
        if (loginConfig.enableAzPSSession) {
            var psLogin: AzPSLogin = new AzPSLogin(loginConfig);
            await psLogin.login();
        }
    }
    catch (error) {
        core.setFailed(`Login failed with ${error}. Double check if the 'auth-type' is correct. Refer to https://github.com/Azure/login#readme for more information.`);
        core.debug(error.stack);
    }
}

main();

