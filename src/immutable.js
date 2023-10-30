import { config, passport } from "@imtbl/sdk";

const passportConfig = {
  clientId: import.meta.env.VITE_IMMUTABLE_CLIENT_ID ?? "YOUR_CLIENT_ID",
  redirectUri: "http://localhost:5003/callback",
  logoutRedirectUri: "http://localhost:5003/",
  scope: "transact openid offline_access email",
  audience: "platform_api",

  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX, 
    apiKey: "", // this can be empty
  })
};
const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

const fetchAuth = async () => {
  try {
    const accounts = await passportProvider.request({
      method: "eth_requestAccounts",
    });
    console.log("connected");
    console.log(accounts);
  } catch (error) {
    console.log(error);
  } finally {
    window.location.reload();
  }
};

export { passportInstance, passportProvider, fetchAuth };
