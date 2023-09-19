"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCanAfford = exports.getCardTokenMint = exports.USDC_MINT_ADDRESS = exports.QUARTZ_SPEND_ADDRESS = exports.RPC_ENDPOINT = void 0;
const web3_js_1 = require("@solana/web3.js");
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const VAULT_SEED = "vault";
const VAULT_ATA_SEED = "ata";
exports.RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=1ce851a8-f463-4114-b601-0ae950264e20';
exports.QUARTZ_SPEND_ADDRESS = new web3_js_1.PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G");
const QUARTZ_PROGRAM_ID = new web3_js_1.PublicKey("5Dxjir2yDi1aZAzgcnkEGmnLVop49DpNoru3c8DNAtcc"); // Devnet Quartz address
exports.USDC_MINT_ADDRESS = new web3_js_1.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Devnet USDC address
// const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");       // Mainnet USDC address
const DEVNET_USDC_DECIMALS = 6;
const getCardTokenMint = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO 
    //use the userId to find the users token prefrence for their card
    //returns the token mint string or "native_sol"
    return exports.USDC_MINT_ADDRESS.toBase58();
});
exports.getCardTokenMint = getCardTokenMint;
const getWalletAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO
    //use the userId to find the users wallet address stored in our database
    //return vaultAddress as a string
    return "AvRWoLJFbNCT2UbszKmMHttxcHJPWXMfR1L5fhxv6LV9";
});
const getVault = (userPubkey) => {
    return web3_js_1.PublicKey.findProgramAddressSync([bytes_1.utf8.encode(VAULT_SEED), userPubkey.toBuffer()], QUARTZ_PROGRAM_ID)[0];
};
const getVaultAta = (userPubkey, tokenAddress) => {
    return web3_js_1.PublicKey.findProgramAddressSync([bytes_1.utf8.encode(VAULT_ATA_SEED), userPubkey.toBuffer(), tokenAddress.toBuffer()], QUARTZ_PROGRAM_ID)[0];
};
const getVaultBalance = (connection, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield getWalletAddress(userId);
    const vault = getVault(new web3_js_1.PublicKey(wallet));
    try {
        const lamports = yield connection.getBalance(new web3_js_1.PublicKey(vault));
        return lamports / web3_js_1.LAMPORTS_PER_SOL;
    }
    catch (e) {
        return 0;
    }
});
const getVaultAtaBalance = (connection, userId, tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield getWalletAddress(userId);
    const vaultAta = getVaultAta(new web3_js_1.PublicKey(wallet), tokenAddress);
    try {
        const balance = (yield connection.getTokenAccountBalance(vaultAta)).value.amount;
        let formatedBalance = yield Number(balance);
        return formatedBalance;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
});
const getVaultUsdcBalance = (connection, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const rawBalance = yield getVaultAtaBalance(connection, userId, exports.USDC_MINT_ADDRESS);
    return rawBalance / 10 ** DEVNET_USDC_DECIMALS;
});
//coin gecko
const getSolanaPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`, {
        method: "GET",
    });
    const data = yield response.json();
    return data.solana.usd;
});
function checkCanAfford(connection, amount, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let userBalance;
        let cardTokenMint = yield (0, exports.getCardTokenMint)(userId);
        if (cardTokenMint === 'native_sol') {
            userBalance = yield getVaultBalance(connection, userId);
            userBalance = (yield getSolanaPrice()) * userBalance;
        }
        else {
            //USDC
            userBalance = yield getVaultUsdcBalance(connection, userId);
        }
        if (userBalance > amount) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.checkCanAfford = checkCanAfford;
