import { PublicKey, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { USDC_MINT_ADDRESS, getSolPrice, getWalletAddress, getVault, getUsdcPrice, getVaultAta, USDC_DECIMALS } from './utils';

export async function getRequiredTokenAmount(tokenMint: PublicKey, amountFiat: number) {
    let price;
    if (tokenMint.toBase58() === USDC_MINT_ADDRESS.toBase58()) price = await getUsdcPrice();
    else price = await getSolPrice();

    return amountFiat / price;
}

export async function checkCanAfford(connection: Connection, tokenMint: PublicKey, amountToken: number, userId: number) {
    let balance;
    if (tokenMint === USDC_MINT_ADDRESS) {
        balance = await getVaultUsdcBalance(connection, userId)
    } else { // SOL
        balance = await getVaultBalance(connection, userId)
    }

    return (balance > amountToken);
}

export async function getVaultBalance(connection: Connection, userId: number) {
    const wallet = await getWalletAddress(userId);
    const vault = getVault(new PublicKey(wallet));

    try {
        const lamports = await connection.getBalance(new PublicKey(vault));
        return lamports / LAMPORTS_PER_SOL;
    } catch (e) {
        console.error("[server] " + e);
        return 0;
    }
};

export async function getVaultUsdcBalance(connection: Connection, userId: number) {
    const wallet = await getWalletAddress(userId);
    const vaultAta = getVaultAta(new PublicKey(wallet), USDC_MINT_ADDRESS);

    try {
        const balance = (await connection.getTokenAccountBalance(vaultAta)).value.amount;
        return Number(balance) / 10 ** USDC_DECIMALS
    } catch (e) {
        console.error("[server] " + e);
        return 0;
    }
}
