import { LoginConfig } from "../src/common/LoginConfig";

describe("LoginConfig Test", () => {

    function setEnv(name: string, value: string) {
        process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value;
    }

    function cleanEnv() {
        for (const envKey in process.env) {
            if (envKey.startsWith('INPUT_')) {
                delete process.env[envKey]
            }
        }
    }

    async function testCreds(creds:any){
        setEnv('environment', 'azurecloud');
        setEnv('enable-AzPSSession', 'true');
        setEnv('allow-no-subscriptions', 'false');
        setEnv('auth-type', 'SERVICE_PRINCIPAL');
        setEnv('creds', JSON.stringify(creds));
        let loginConfig = new LoginConfig();
        try{
            await loginConfig.initialize();
            throw new Error("The last step should fail.");
        }catch(error){
            expect(error.message.includes("Not all parameters are provided in 'creds'.")).toBeTruthy();
        }
    }

    function testValidateWithErrorMessage(loginConfig:LoginConfig, errorMessage:string){
        try{
            loginConfig.validate();
            throw new Error("The last step should fail.");
        }catch(error){
            expect(error.message.includes(errorMessage)).toBeTruthy();
        }
    }

    beforeEach(() => {
        cleanEnv();
    });


    test('initialize with creds', async () => {
        let creds = {
            'clientId': 'client-id',
            'clientSecret': 'client-secret',
            'tenantId': 'tenant-id',
            'subscriptionId': 'subscription-id'
        }

        setEnv('environment', 'azurecloud');
        setEnv('enable-AzPSSession', 'true');
        setEnv('allow-no-subscriptions', 'false');
        setEnv('auth-type', 'SERVICE_PRINCIPAL');
        setEnv('creds', JSON.stringify(creds));

        let loginConfig = new LoginConfig();
        await loginConfig.initialize();
        expect(loginConfig.environment).toBe("azurecloud");
        expect(loginConfig.enableAzPSSession).toBeTruthy();
        expect(loginConfig.allowNoSubscriptionsLogin).toBeFalsy();
        expect(loginConfig.authType).toBe("SERVICE_PRINCIPAL");
        expect(loginConfig.servicePrincipalId).toBe("client-id");
        expect(loginConfig.servicePrincipalSecret).toBe("client-secret");
        expect(loginConfig.tenantId).toBe("tenant-id");
        expect(loginConfig.subscriptionId).toBe("subscription-id");
    });

});