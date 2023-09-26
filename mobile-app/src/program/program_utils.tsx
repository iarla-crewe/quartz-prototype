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
  ConfirmOptions,
  Transaction,
  Signer
} from '@solana/web3.js';
import { IDL, QuartzPrototypeV2 as QuartzPrototypeV2Program } from './quartz_prototype_v2';

const VAULT_SEED = "vault"
const VAULT_ATA_SEED = "ata"
const RPC_ENDPOINT = 'devnet'

const QUARTZ_SPEND_ADDRESS = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G");
const QUARTZ_PROGRAM_ID = new PublicKey("5Dxjir2yDi1aZAzgcnkEGmnLVop49DpNoru3c8DNAtcc");       // Devnet Quartz address
const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");       // Devnet USDC address
// const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");       // Mainnet USDC address

const USDC_DECIMALS = 6;      // Devnet USDC decimals
// const USDC_DECIMALS = 2;      // Mainnet USDC decimals

const createConnection = () => {
  return new Connection(clusterApiUrl(RPC_ENDPOINT));
};

const getTestWallet = () => {
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(
      [180,140,40,191,248,9,2,79,179,86,217,85,183,177,221,249,196,165,50,46,55,229,19,7,163,52,88,202,191,169,6,143,147,104,174,219,9,211,255,127,190,232,70,218,71,62,13,126,91,39,237,219,179,45,234,39,37,87,49,249,209,171,183,132]
    )
  )
  
  return {
    signTransaction: async (transaction: Transaction) => {
      const tx = await transaction.sign(keypair as Signer);

      return transaction;
    },

    signAllTransactions: async (transactions: Transaction[]) => {
      return transactions.map(async (tx) => {
        const hash = await tx.sign(keypair as Signer)

        return tx;
      })
    },

    get publicKey() {
      return keypair.publicKey;
    },

    get payer() {
      return keypair as Signer;
    }
  } as Wallet;
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
    const balance = (await connection.getTokenAccountBalance(vaultAta)).value.amount;
    return Number(balance);

  } catch (e) {
    return 0;
  }
}

const getVaultUsdcBalance = async (connection: Connection, userPubkey: PublicKey) => {
  const rawBalance = await getVaultAtaBalance(connection, userPubkey, USDC_MINT_ADDRESS);
  return rawBalance / 10 ** USDC_DECIMALS;
}

export {
  QUARTZ_SPEND_ADDRESS,
  USDC_MINT_ADDRESS,
  USDC_DECIMALS,
  createConnection,
  getTestWallet,
  getProvider,
  getProgram,
  getVault,
  getVaultAta,
  getVaultBalance,
  getVaultUsdcBalance
};
