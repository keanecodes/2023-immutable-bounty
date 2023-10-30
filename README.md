# Immutable Passport Integration Guide

This guide will walk you through the process of integrating Immutable Passport into your application. Immutable Passport is a powerful tool for blockchain-based authentication and transactions. 



https://github.com/keanecodes/2023-immutable-bounty-2/assets/22881005/ac7d677f-312b-497c-aa93-15c408d711a6



Credits to [this CodePen](https://codepen.io/soufiane-khalfaoui-hassani/pen/LYpPWda) for the cool styles 💅

## Prerequisites
Before you begin, make sure you have the following:

* [Node.js](https://nodejs.org/) installed  
* A basic understanding of JavaScript and web development

## Getting Started

### 1. Registering the Application on Immutable Developer Hub
To use Immutable Passport, you need to register your application on the Immutable Developer Hub. Follow these steps:

Go to [Immutable Developer Hub](https://hub.immutable.com/).
Sign in or create an account.
Create a new project and register your application.
Note down your API keys and client ID for later use.

### 2. Creating a Simple Application
You can clone this repo and enter the directory
```bash
git clone https://github.com/keanecodes/2023-immutable-bounty-2.git
cd immutable-passport-demo
```
### 3. Installing and Initializing the Passport Client
In your project directory, install the dependencies with 
```bash
npm i
```
Then fill in the `.env.example` file details and shorten the file to just `.env`
```
VITE_IMMUTABLE_CLIENT_ID="CLIENT_ID"
VITE_BASE_URL="http://localhost:5003"
```

### 4. Running the project
That's all the steps! You can now run the project with 
```bash
npm run dev
```
and navigate to http://localhost:5003

## Code Workthrough

### 0. Immutable Passport Setup
The code to link up the client creentials are as follows in the `immutable.js` file 
```js
import { config, passport } from "@imtbl/sdk";

const passportConfig = {
  clientId: import.meta.env.VITE_IMMUTABLE_CLIENT_ID ?? "YOUR_CLIENT_ID",
  redirectUri: `${import.meta.env.VITE_BASE_URL ?? "http://localhost:5003"}/callback`,
  logoutRedirectUri: import.meta.env.VITE_BASE_URL ?? "http://localhost:5003",
  scope: "transact openid offline_access email",
  audience: "platform_api",

  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX, 
    apiKey: "", // this can be empty
  })
};
const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

// other helper functions
```

### 1. Logging In a User with Passport
The code logic to login a user is very short and can be found in the `Login.jsx` file
```js
function Login() {
  // loading and routing logic
  return (
    <>
        {/*Other styling code*/}
         <button 
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await fetchAuth();
            setLoading(false);
          }}>
          {loading ? "Loading..." : "Login"}
        </button>
        {/*Other styling code*/}
    </>
  )
}
```
### 2. Displaying User Information
After logging in, you can display user information such as the ID token, access token, and nickname:
```

```

### 3. Logging Out a User
Similar to the login code, the log out code logic is also in just a few lines of code in the `App.jsx`
```js
    <button onClick={() => {
        passportInstance.logout()
        navigate("/")
    }}>
        Logout
    </button>
```

### 4. Initiating a Transaction
To initiate a transaction using Passport, you can send a placeholder string and obtain the transaction hash. Refer to the Immutable Passport documentation for details on transaction initiation

## Conclusion
You've now successfully integrated Immutable Passport into your application. Feel free to explore more features and options available in the Immutable Passport documentation or fork this project to tailor to your game needs. If you'd like to see how I take this Immutable Passport integration further, checkout my other Immutable x Stackup bounty here.

