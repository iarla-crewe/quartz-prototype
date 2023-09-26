import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export const VAULT_SEED = "vault"
export const VAULT_ATA_SEED = "ata"
export const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=1ce851a8-f463-4114-b601-0ae950264e20'

export const QUARTZ_SPEND_ADDRESS = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G");
export const QUARTZ_PROGRAM_ID = new PublicKey("5Dxjir2yDi1aZAzgcnkEGmnLVop49DpNoru3c8DNAtcc");       // Devnet Quartz address
export const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Devnet USDC address
// export const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");       // Mainnet USDC address

export const USDC_DECIMALS = 6;     // Devnet USDC decimals
// export const USDC_DECIMALS = 2;     // Mainnet USDC decimals

export async function getWalletAddress(userId:number) {
    // TODO - Remove hardcoding

    return "AvRWoLJFbNCT2UbszKmMHttxcHJPWXMfR1L5fhxv6LV9";
}

export async function getCardTokenMint(userId: number) {
    // TODO - Remove hardcoding

    // return USDC_MINT_ADDRESS;             // USDC hardcoded
    return QUARTZ_PROGRAM_ID                 // SOL hardcoded - anything other than USDC will result in SOL
}

export function getVault(userPubkey: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [utf8.encode(VAULT_SEED), userPubkey.toBuffer()],
      QUARTZ_PROGRAM_ID
    )[0];
  }

export function getVaultAta(userPubkey: PublicKey, tokenAddress: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [utf8.encode(VAULT_ATA_SEED), userPubkey.toBuffer(), tokenAddress.toBuffer()],
        QUARTZ_PROGRAM_ID
    )[0];
}

export function formatAmountFullUnit(amountToken: number, tokenMint: PublicKey) {
    let magnitude;
    if (tokenMint === USDC_MINT_ADDRESS) magnitude = 10 ** USDC_DECIMALS;
    else magnitude = LAMPORTS_PER_SOL;

    return new BigNumber(Math.trunc(amountToken * magnitude));
}

export function formatAmountDecimal(amountToken: number, tokenMint: PublicKey) {
    let magnitude;
    if (tokenMint === USDC_MINT_ADDRESS) magnitude = 10 ** USDC_DECIMALS;
    else magnitude = LAMPORTS_PER_SOL;

    const amountAsIntegar = formatAmountFullUnit(amountToken, tokenMint);
    return new BigNumber(amountAsIntegar.toNumber() / magnitude);
}

// CoinGecko API Calls
export const getSolPrice = async () => {
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur`,
        { method: "GET" }
    );

    const data = await response.json();
    return data.solana.eur;
};

export const getUsdcPrice = async () => {
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur`,
        { method: "GET" }
    );

    const data = await response.json();
    return data["usd-coin"].eur;
};
