# Immutable Passport Integration Guide

This guide will walk you through the process of integrating Immutable Passport into your application. It is also in conjuction with a [bounty with StackUp](https://app.stackup.dev/bounty/immutable-bounty-2-immutable-passport-integration). We can expect to have the following results as the video shows below:



https://github.com/keanecodes/2023-immutable-bounty-2/assets/22881005/ac7d677f-312b-497c-aa93-15c408d711a6

Link in video: https://keanecodes-imx-passport-stackup-bounty.vercel.app/

Note: due to the SDK technical constraints at the moment. Please view the site in [_**CORS disabled mode**_](https://alfilatov.com/posts/run-chrome-without-cors/).

Credits to [this CodePen](https://codepen.io/soufiane-khalfaoui-hassani/pen/LYpPWda) for the cool styles!

## Prerequisites
Before you begin, make sure you have the following:

* [Node.js](https://nodejs.org/) installed  
* A basic understanding of JavaScript and web development

## Getting Started

### 1. Registering the Application on Immutable Developer Hub
To use Immutable Passport, you need to register your application on the Immutable Developer Hub. You can check [this guide for more pictured steps](https://devsupport.immutable.com/en/articles/8255938-passport-create-an-authentication-client) or follow these steps below:

* Go to [Immutable Developer Hub](https://hub.immutable.com/).
* Sign in or create an account.
* Create a new project and register your application.
* Note down your API keys and client ID for later use. 

Your end result should look like this:

![Screenshot 2023-10-31 at 3 36 41 AM](https://github.com/keanecodes/2023-immutable-bounty-2/assets/22881005/360716b7-8f37-4750-be34-7ae90e3381ab)

### 2. Creating a Simple Application
You can clone this repo and enter the directory
```bash
git clone https://github.com/keanecodes/2023-immutable-bounty-2.git
cd immutable-passport-demo
```
If you want to start from scratch, you can reference [the diff of my Initial Commit and the next commit](https://github.com/keanecodes/2023-immutable-bounty-2/commit/bc1883cabf0c4b8aab8ab2e143abb201470157d4).
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
and navigate to http://localhost:5003 in [_**CORS disabled mode**_](https://alfilatov.com/posts/run-chrome-without-cors/).

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
It is also important you setup a separate component for the callback window
```js
const CallbackPage = () => {
  window.addEventListener("load", function () {
    passportInstance.loginCallback();
  });
  return <div>Loading... Please close this window if it hangs more than 30 seconds.</div>;
};
```
### 2. Displaying User Information
After logging in, the user information such as the ID token, access token, and nickname are fetched displayed in the `App.jsx` file.
```js
export default function App () {
  // other logic...
    const fetchUser = async () => {
    try {
      const userProfile = await passportInstance.getUserInfo();
      const accessToken = await passportInstance.getAccessToken();
      const idToken = await passportInstance.getIdToken();

      Boolean(userProfile === undefined) && navigate("/")

      setUser({
        Nickname: userProfile?.nickname,
        Email: userProfile?.email,
        accessToken: accessToken,
        idToken: idToken,
        sub: userProfile?.sub,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // other logic...
  return (
    <div>
    {/*other logic...*/}
    {
      Boolean(user) && Object.keys(user).map((key, i) => 
        <div className="text-box-wrapper" key={i}>
          <div className="text-box disable">
            <input type="text" defaultValue={user[key] ?? ''} placeholder="No nickname set"/>
            <label>{key}</label>
          </div>
          {Boolean(key === "accessToken" || key === "idToken") && 
            <a onClick={() => {
              const txt = user[key] ?? ''
              navigator.clipboard.writeText(txt)
              console.log(txt)
            }}>Copy</a>
          }
        </div>
      )
    }
    {/*other logic...*/}
    </div>
  )
}
```

### 3. Logging Out a User
Similar to the login code, the log out code logic is also in just a few lines of code in the `App.jsx`
```html
    <button onClick={() => {
        passportInstance.logout()
        navigate("/")
    }}>
        Logout
    </button>
```

### 4. Initiating a Transaction
To initiate a transaction using Passport, we will be using an empty placeholder string '' and obtain the transaction hash. The main logic of it is in the `immutable.js` file as shown below.

```js
async function initiateTransaction() {
  try {
    // mandatory method to call and get the account
    const accounts = await passportProvider.request({
      method: "eth_requestAccounts",
    });

    // setting up the params required
    const params = {
      to: accounts[0],
      // marshall the data into 0x... format
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(''))
    };

    // this is the main function we want to call
    const txnHash = await passportProvider.request({
      method: "eth_sendTransaction",
      params: [params],
    });
    console.log(txnHash);

    return {
      txnHash,
      error: null,
    };
  } catch (error) {
    console.log("err", error.message);
    return {
      txnHash: null,
      error: error.message,
    };
  }
}
```
Read more [eth_sendTransaction](https://docs.immutable.com/docs/zkEVM/products/passport/wallet/rpc-methods/eth_sendTransaction) and other RPC methods.

## Conclusion
You've now successfully integrated Immutable Passport into your application. Feel free to explore more features and options available in the Immutable Passport documentation or fork this project to tailor to your game needs. If you'd like to see how I take this Immutable Passport integration further, checkout my other Immutable x Stackup bounty.

