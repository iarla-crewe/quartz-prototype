import * as anchor from "@coral-xyz/anchor"
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import {
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl
} from '@solana/web3.js';

const VAULT_SEED = "vault"
const VAULT_ATA_SEED = "ata"

const QUARTZ_PROGRAM_ID = new PublicKey("57U6PNi6ymKcsTTsoFRC18iA4Nuaw6KdTz52NHqo3ENt");       // Devnet Quartz address
const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Devnet USDC address
// const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Mainnet USDC address

const createConnection = () => {
  return new Connection(clusterApiUrl('devnet'));
};

const getVault = (userPubkey: PublicKey) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode(VAULT_SEED), userPubkey.toBuffer()],
    QUARTZ_PROGRAM_ID
  )[0];
}

const getVaultAta = (userPubkey: PublicKey, tokenAddress: PublicKey) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode(VAULT_ATA_SEED), userPubkey.toBuffer(), tokenAddress.toBuffer()],
    QUARTZ_PROGRAM_ID
  )[0];
}

const getVaultBalance = async (connection: Connection, userPubkey: PublicKey) => {
  const vault = getVault(userPubkey);

  try {
    const lamports = await connection.getBalance(vault);
    return lamports / LAMPORTS_PER_SOL;

  } catch (e) {
    return 0;
  }
};

const getVaultAtaBalance = async (connection: Connection, userPubkey: PublicKey, tokenAddress: PublicKey) => {
  const vaultAta = getVaultAta(userPubkey, tokenAddress);

  try {
    const balance = await connection.getTokenAccountBalance(vaultAta).catch(err => {
      console.error(`Error: ${err}`);
    })
    return balance;

  } catch (e) {
    return 0;
  }
}

const getVaultUsdcBalance = async (connection: Connection, userPubkey: PublicKey) => getVaultAtaBalance(connection, userPubkey, USDC_MINT_ADDRESS);


export {
  createConnection,
  getVaultBalance,
  getVaultUsdcBalance
};
