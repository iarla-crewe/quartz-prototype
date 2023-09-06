import { Program, BN, Wallet, web3 } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { QuartzPrototypeV2 } from "./quartz_prototype_v2";
import { DEVNET_USDC_DECIMALS, QUARTZ_SPEND_ADDRESS, USDC_MINT_ADDRESS, getVault, getVaultAta } from "./program_utils";
import { getAssociatedTokenAddress, createAssociatedTokenAccount } from "@solana/spl-token";

const initAccount = async (program: Program<QuartzPrototypeV2>) => {
    try {
        const tx = await program.methods
            .initAccount()
            .accounts({ tokenMint: USDC_MINT_ADDRESS })
            .rpc();
        console.log(tx);
    } catch (err) {
        console.log(err);
    }
}

const airdropSol = async (connection: Connection, owner: PublicKey) => {
    const vaultAddress = getVault(owner);

    try {
        const tx = await connection.requestAirdrop(vaultAddress, 4e9);
        console.log(tx);
    } catch (err) {
        console.log(err);
    }
}

const transferSol = async (program: Program<QuartzPrototypeV2>, owner: PublicKey, receiver: PublicKey, amount: number) => {
    const lamports = amount * LAMPORTS_PER_SOL;
    const vault = getVault(owner);

    try {
        const tx = await program.methods
            .transferLamports(new BN(lamports))
            .accounts({
                vault: vault,
                receiver: receiver
            })
            .rpc()  
        console.log(tx);
        return tx;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const transferUsdc = async (connection: Connection, program: Program<QuartzPrototypeV2>, owner: Wallet, receiver: PublicKey, amount: number) => {
    const usdc = amount * (10 ** DEVNET_USDC_DECIMALS);

    const vault = getVault(owner.publicKey);
    const vaultAta = getVaultAta(owner.publicKey, USDC_MINT_ADDRESS);
    let receiverAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        receiver,
        true
    );

    try {
        const ataAccount = await connection.getAccountInfo(receiverAta); 
        
        if (ataAccount === null) {
            const tx = await createAssociatedTokenAccount(
                connection,
                owner.payer,
                USDC_MINT_ADDRESS,
                receiver
            )
            console.log(tx);
        }
        
    } catch (err) {
        console.log(`getATA error: ${err}`);
        return;
    }

    try {
        const tx = await program.methods
            .transferSpl(new BN(usdc))
            .accounts({
                vault: vault,
                vaultAtaUsdc: vaultAta,
                tokenMint: USDC_MINT_ADDRESS,
                receiver: receiver,
                receiverAta: receiverAta
            })
            .rpc()  
        console.log(tx);    
        return tx;
    } catch (err) {
        console.log(`instruction error: ${err}`);
        return null;
    }
}

const spendSol = async (program: Program<QuartzPrototypeV2>, owner: PublicKey, lamports: number) => {
    const vault = getVault(owner);

    try {
        const tx = await program.methods
            .spendLamports(new BN(lamports))
            .accounts({
                vault: vault,
                receiver: QUARTZ_SPEND_ADDRESS
            })
            .rpc()  
        console.log(tx);
        return tx;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const spendUsdc = async (connection: Connection, program: Program<QuartzPrototypeV2>, owner: Wallet, amount: number) => {
    const usdc = amount * (10 ** (DEVNET_USDC_DECIMALS - 2));
    const vault = getVault(owner.publicKey);
    const vaultAta = getVaultAta(owner.publicKey, USDC_MINT_ADDRESS);

    let quartzAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        QUARTZ_SPEND_ADDRESS,
        true
    );

    try {
        const quartzAtaAccount = await connection.getAccountInfo(quartzAta); 
        
        if (quartzAtaAccount === null) {
            const tx = await createAssociatedTokenAccount(
                connection,
                owner.payer,
                USDC_MINT_ADDRESS,
                QUARTZ_SPEND_ADDRESS
            )
            console.log(tx);
        }
        
    } catch (err) {
        console.log(`getATA error: ${err}`);
        return;
    }

    try {
        const tx = await program.methods
            .spendSpl(new BN(usdc))
            .accounts({
                vault: vault,
                vaultAtaUsdc: vaultAta,
                tokenMint: USDC_MINT_ADDRESS,
                receiver: QUARTZ_SPEND_ADDRESS,
                receiverAta: quartzAta 
            })
            .rpc()  
        console.log(tx);
        return tx;
    } catch (err) {
        console.log(`instruction error: ${err}`);
        return null;
    }
}

export {
    initAccount,
    airdropSol,
    transferSol,
    transferUsdc,
    spendSol,
    spendUsdc
}