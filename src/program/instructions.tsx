import { Program, BN } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { QuartzPrototypeV2 } from "./quartz_prototype_v2";
import { USDC_MINT_ADDRESS, getVault } from "./program_utils";

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

const airdropSol = async (connection: Connection, vaultAddress: PublicKey) => {
    try {
        const tx = await connection.requestAirdrop(vaultAddress, 4e9);
        console.log(tx);
    } catch (err) {
        console.log(err);
    }
}

const transferSol = async (program: Program<QuartzPrototypeV2>, vault: PublicKey, receiver: PublicKey, amount: number) => {
    const lamports = amount * LAMPORTS_PER_SOL;

    try {
        const tx = await program.methods
            .transferLamports(new BN(lamports))
            .accounts({
                vault: vault,
                receiver: receiver
            })
            .rpc()
        console.log(tx);
    } catch (err) {
        console.log(err);
    }
}

const transferUsdc = async (program: Program<QuartzPrototypeV2>, owner: PublicKey, receiver: PublicKey, amount: Number) => {
    // TODO - Implement
}

const spendSol = async () => {
    // TODO - Implement
}

const spendUsdc = async () => {
    // TODO - Implement
}

export {
    initAccount,
    airdropSol,
    transferSol,
    transferUsdc,
    spendSol,
    spendUsdc
}