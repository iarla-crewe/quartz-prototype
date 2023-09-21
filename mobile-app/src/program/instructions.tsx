import { Program, BN, Wallet, web3 } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { QuartzPrototypeV2 } from "./quartz_prototype_v2";
import { DEVNET_USDC_DECIMALS, QUARTZ_SPEND_ADDRESS, USDC_MINT_ADDRESS, getVault, getVaultAta } from "./program_utils";
import { getAssociatedTokenAddress, createAssociatedTokenAccount } from "@solana/spl-token";
import { handleError } from "../utils";

const initAccount = async (program: Program<QuartzPrototypeV2>) => {
    try {
        const tx = await program.methods
            .initAccount()
            .accounts({ tokenMint: USDC_MINT_ADDRESS })
            .rpc();
        console.log("Transaction Signature: " + tx);
        return tx;
    } catch (err: unknown) {
        return handleError(err);
    }
}

const airdropSol = async (connection: Connection, owner: PublicKey) => {
    const vaultAddress = getVault(owner);

    try {
        const tx = await connection.requestAirdrop(vaultAddress, 4e9);
        console.log("Transaction Signature: " + tx);
        return tx;
    } catch (err: unknown) {
        return handleError(err);
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
        console.log("Transaction Signature: " + tx);
        return tx;
    } catch (err: unknown) {
        return handleError(err);
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
            console.log("Transaction Signature: " + tx);
        }
        
    } catch (err: unknown) {
        return handleError(err, "getATA error: ");
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
        console.log("Transaction Signature: " + tx);    
        return tx;
    } catch (err: unknown) {
        return handleError(err, "instruction error: ");
    }
}

const spendSol = async (connection: Connection, program: Program<QuartzPrototypeV2>, owner: Wallet, lamports: number, reference: PublicKey[] | undefined) => {
    const vault = getVault(owner.publicKey);

    try {
        const instruction = await program.methods
            .spendSpl(new BN(lamports))
            .accounts({
                vault: vault,
                receiver: QUARTZ_SPEND_ADDRESS,
            })
            .instruction()
        console.log("Transaction Signature: " + instruction);

    // If reference accounts are provided, add them to the transfer instruction
    if (reference) {
        if (!Array.isArray(reference)) {
            reference = [reference];
        }

        for (const pubkey of reference) {
            instruction.keys.push({ pubkey, isWritable: false, isSigner: false });
        }
    }

    const tx = new Transaction().add(instruction);

    const signature = await sendAndConfirmTransaction(
        connection,
        tx,
        [owner.payer]
    )
    console.log("Transaction Signature: " + signature);
    return signature;
    } catch (err: unknown) {
        return handleError(err, "instruction error: ");
    }
}

const spendUsdc = async (connection: Connection, program: Program<QuartzPrototypeV2>, owner: Wallet, amount: number, reference: PublicKey[] | undefined) => {
    const usdc = amount * (10 ** (DEVNET_USDC_DECIMALS));
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
            console.log("Created ATA. Signature: " + tx);
        }
        
    } catch (err: unknown) {
        return handleError(err, "getATA error: ");
    }

    try {
        const instruction = await program.methods
            .spendSpl(new BN(usdc))
            .accounts({
                vault: vault,
                vaultAtaUsdc: vaultAta,
                tokenMint: USDC_MINT_ADDRESS,
                receiver: QUARTZ_SPEND_ADDRESS,
                receiverAta: quartzAta 
            })
            .instruction()
        console.log("Transaction Signature: " + instruction);

    // If reference accounts are provided, add them to the transfer instruction
    if (reference) {
        if (!Array.isArray(reference)) {
            reference = [reference];
        }

        for (const pubkey of reference) {
            instruction.keys.push({ pubkey, isWritable: false, isSigner: false });
        }
    }

    const tx = new Transaction().add(instruction);

    const signature = await sendAndConfirmTransaction(
        connection,
        tx,
        [owner.payer]
    )
    console.log("Transaction Signature: " + signature);
    return signature;
    } catch (err: unknown) {
        return handleError(err, "instruction error: ");
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