import {
  web3,
  AnchorProvider,
  Program,
  Wallet
} from "@coral-xyz/anchor"
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import {
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  ConfirmOptions
} from '@solana/web3.js';
import { IDL, QuartzPrototypeV2 as QuartzPrototypeV2Program } from './quartz_prototype_v2';
import path from "path";
const fs = require("fs");

const VAULT_SEED = "vault"
const VAULT_ATA_SEED = "ata"
const RPC_ENDPOINT = 'devnet'

const QUARTZ_PROGRAM_ID = new PublicKey("57U6PNi6ymKcsTTsoFRC18iA4Nuaw6KdTz52NHqo3ENt");       // Devnet Quartz address
const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Devnet USDC address
// const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Mainnet USDC address

const createConnection = () => {
  return new Connection(clusterApiUrl(RPC_ENDPOINT));
};

const getTestWallet = () => {
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(
        JSON.parse(
            fs.readFileSync(path.resolve(__dirname, "../../test_keypair.json"))
        )
    )
  )
  return new Wallet(keypair);
}

const getProvider = (connection: Connection, wallet: Wallet) => {
  const confirmOptions : ConfirmOptions = {
    preflightCommitment: 'confirmed',
    commitment: 'confirmed'
  }
  return new AnchorProvider(connection, wallet, confirmOptions);
}

const getProgram = (provider: AnchorProvider) => {
  return new Program<QuartzPrototypeV2Program>(
    IDL as QuartzPrototypeV2Program,
    QUARTZ_PROGRAM_ID,
    provider,
  );
}

const getVault = (userPubkey: PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [utf8.encode(VAULT_SEED), userPubkey.toBuffer()],
    QUARTZ_PROGRAM_ID
  )[0];
}

const getVaultAta = (userPubkey: PublicKey, tokenAddress: PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
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
  USDC_MINT_ADDRESS,
  createConnection,
  getTestWallet,
  getProvider,
  getProgram,
  getVault,
  getVaultBalance,
  getVaultUsdcBalance
};
