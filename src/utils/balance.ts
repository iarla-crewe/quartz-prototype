import {
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Connection,
    clusterApiUrl,
    ConfirmOptions,
    Transaction,
    Signer
} from '@solana/web3.js';
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"

const VAULT_SEED = "vault"
const VAULT_ATA_SEED = "ata"
export const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=1ce851a8-f463-4114-b601-0ae950264e20'

export const QUARTZ_SPEND_ADDRESS = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G");
const QUARTZ_PROGRAM_ID = new PublicKey("5Dxjir2yDi1aZAzgcnkEGmnLVop49DpNoru3c8DNAtcc");       // Devnet Quartz address
export const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Devnet USDC address
// const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");       // Mainnet USDC address

const DEVNET_USDC_DECIMALS = 6;

export const getCardTokenMint = async (userId: number) => {
    //TODO 
    //use the userId to find the users token prefrence for their card
    //returns the token mint string or "native_sol"
    return USDC_MINT_ADDRESS.toBase58();
}

const getWalletAddress =async (userId:number) => {
    //TODO
    //use the userId to find the users wallet address stored in our database
    //return vaultAddress as a string
    return "AvRWoLJFbNCT2UbszKmMHttxcHJPWXMfR1L5fhxv6LV9";
    
}

const getVault = (userPubkey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [utf8.encode(VAULT_SEED), userPubkey.toBuffer()],
      QUARTZ_PROGRAM_ID
    )[0];
  }

const getVaultAta = (userPubkey: PublicKey, tokenAddress: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [utf8.encode(VAULT_ATA_SEED), userPubkey.toBuffer(), tokenAddress.toBuffer()],
        QUARTZ_PROGRAM_ID
    )[0];
}

const getVaultBalance = async (connection: Connection, userId: number) => {
    const wallet = await getWalletAddress(userId);
    const vault = getVault(new PublicKey(wallet));

    try {
        const lamports = await connection.getBalance(new PublicKey(vault));
        return lamports / LAMPORTS_PER_SOL;

    } catch (e) {
        return 0;
    }
};

const getVaultAtaBalance = async (connection: Connection, userId: number, tokenAddress: PublicKey) => {
    const wallet = await getWalletAddress(userId);
    const vaultAta = getVaultAta(new PublicKey(wallet), tokenAddress);
    try {
        const balance = (await connection.getTokenAccountBalance(vaultAta)).value.amount;
        let formatedBalance = await Number(balance);
        return formatedBalance;

    } catch (e) {
        console.log(e);
        return 0;
    }
}

const getVaultUsdcBalance = async (connection: Connection, userId: number) => {
    const rawBalance = await getVaultAtaBalance(connection, userId, USDC_MINT_ADDRESS);
    return rawBalance / 10 ** DEVNET_USDC_DECIMALS;
}

//coin gecko

const getSolanaPrice = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
      {
        method: "GET",
      }
    );
  
    const data = await response.json();
    return data.solana.usd;
  };


  export async function checkCanAfford(connection: Connection, amount: number, userId: number) {
    let userBalance;

    let cardTokenMint = await getCardTokenMint(userId);
    if (cardTokenMint === 'native_sol') {
        userBalance = await getVaultBalance(connection, userId)
        userBalance = await getSolanaPrice() * userBalance;
    } else {
        //USDC
        userBalance = await getVaultUsdcBalance(connection, userId)
    }
    console.log("Vault of mint: ", cardTokenMint, " Balance: ", userBalance);

    if (userBalance > amount) {
        return true;
    }
    else {
        return false
    }
}