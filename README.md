# Quartz Prototype Monorepo

Quartz is a self-custody Solana crypto wallet with a linked debit card, allowing users to spend their crypto as if it were fiat.  
Users' funds are kept in "vaults", accounts owned by the Quartz Solana program on-chain. Their crypto stays in their custody and control until the moment of purchase.  
All card transactions must be manually approved by the user through an app notification, this is done using quartzpay.io's API.  

For this demo, the debit card is not integrated and some values (such as wallet addresses) are hardcoded, however, all of this functionality is ready to be plugged in for the full product. Deposit fees are also not yet implemented. Currently, only Android is supported.  

---

This repo is split into 4 different sub-repos:  
- Solana-program
- website
- mobile-app
- pay-demo

### Solana Program
This is the code for the on-chain program that handles all user vaults. Vaults act as users' wallets, with which they can send and receive Solana transactions. When they send money to another wallet, or when they tap their card, the program's instructions are called. Users can init accounts, close accounts, transfer SOL/USDC and spend SOL/USDC (for card transactions).  
The program is currently deployed on Devnet at 5Dxjir2yDi1aZAzgcnkEGmnLVop49DpNoru3c8DNAtcc  

### Website
This is the landing page for Quartz, currently hosted through Vercel at https://www.quartzpay.io  
It also handles API requests for card transactions. In the full product, these will be called by the card network, but for the demo, they are called by "pay-demo" (see below).  
The website handles card transaction flow (when a POST request is made to https://www.quartzpay.io/api/demo):
1. Sends user a notification
2. Awaits user approval/denial
3. If approved, then authorizes card transaction
4. If denied, or the time limit of 25s is reached, declines card transaction

### Mobile App
This is the Quartz mobile app that users will interact with. In this demo, seed phrase functionality is not added and the wallet's keys are hardcoded in.  
With the app, users can view their balance, get their address for deposits, transfer money to other wallets, and accept/decline transactions when they receive a notification.  
The app uses Coin Gecko's free API for token price info (https://www.coingecko.com/en/api) 

### Pay Demo
This is a mobile app used to fake a card spend for this demo. When opened, it displays a tick to mimic Google/Apple Pay and sends an API request to the website for a card transaction to be approved by the user.

---

# Set-Up

1. Node dependencies need to be installed in each sub-repo, by navigating to each one individually and running `npm install`
2. For pay-demo to call the correct mobile-app, the mobile-app's app token needs to be added:
    1. Run mobile-app, by navigating to the folder and running `npm start`
    2. Check the console logs for "Token: ", and copy the token to clipboard
    3. Navigate to pay-demo/App.tsx and paste the token into the empty APP_TOKEN variable
3. Pay-demo can be run through Expo Go, or built using Expo's build servers.
4. Once mobile-app and pay-demo are installed on your device/emulator, you can use all the functionality. To demo a card transaction:
    1. First top up your account, by copying the address in the "Deposit" tab and sending some Devnet SOL/USDC to it.
    2. Open the pay-demo app, to fake using Google/Apple Pay for a card transaction.
    3. You will be sent a notification, tap into it to approve or deny the transaction
    4. If approved, your account will be debited and the server will call acceptTransaction(), outputting "Accept debit card transaction" to the Vercel logs

---

Note: The USDC devnet address is 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU  
Faucets for this can be found online

Please email iarla@quartzpay.io for any queries.
