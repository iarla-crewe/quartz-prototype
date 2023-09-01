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

// TODO - Add real data
const QUARTZ_PROGRAM_ID = Keypair.generate().publicKey;
const USDC_ADDRESS = Keypair.generate().publicKey;

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

const getVaultBalance = async (userPubkey: PublicKey) => {
  const connection = createConnection();
  const vault = getVault(userPubkey);

  try {
    const lamports = await connection.getBalance(vault);
    return lamports / LAMPORTS_PER_SOL;

  } catch (e) {
    return 0;
  }
};

const getVaultAtaBalance = async (userPubkey: PublicKey, tokenAddress: PublicKey) => {
  const connection = createConnection();
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

const getVaultUsdcBalance =async (userPubkey: PublicKey) => getVaultAtaBalance(userPubkey, USDC_ADDRESS);


export {
  getVaultBalance,
  getVaultUsdcBalance
};


// const transaction = async (from: any, to: any, amount: any) => {
//   console.log('Executing transaction...');
//   console.log(amount);

//   const transaction = new solanaWeb3.Transaction().add(
//     solanaWeb3.SystemProgram.transfer({
//       fromPubkey: publicKeyFromString(from.keyPair.publicKey.toString()),
//       toPubkey: publicKeyFromString(to),
//       lamports: amount * LAMPORTS_PER_SOL,
//     }),
//   );

//   // Sign transaction, broadcast, and confirm
//   const connection = createConnection();
//   const signature = await solanaWeb3.sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [from.keyPair],
//   );
//   console.log('SIGNATURE', signature);
// };