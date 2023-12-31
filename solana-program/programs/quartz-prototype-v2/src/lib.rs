use anchor_lang::prelude::*;
use solana_program::pubkey;
mod state;
mod errors;
mod utils;
mod instructions;
use instructions::*;

declare_id!("5Dxjir2yDi1aZAzgcnkEGmnLVop49DpNoru3c8DNAtcc");

#[constant]
pub const QUARTZ_HOLDING_ADDRESS: Pubkey = pubkey!("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G");

#[cfg(feature = "local-testing")]
#[constant]
pub const USDC_MINT_ADDRESS: Pubkey = pubkey!("envrJbV6GbhBTi8Pu6h9MwNViLuAmu3mFFRq7gE9Cp3");       // Localnet mint address

#[cfg(feature = "devnet")]
#[constant]
pub const USDC_MINT_ADDRESS: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");      // Devnet USDC address

#[cfg(not(any(feature = "local-testing", feature = "devnet")))]
#[constant]
pub const USDC_MINT_ADDRESS: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");      // Mainnet USDC address

#[program]
pub mod quartz_prototype_v2 {
    use super::*;

    pub fn init_account(ctx: Context<InitAccount>) -> Result<()> {
        init_account_handler(ctx)
    }

    pub fn close_account(ctx: Context<CloseAccount>) -> Result<()> {
        close_account_handler(ctx)
    }

    pub fn spend_lamports(ctx: Context<SpendLamports>, amount_lamports: u64) -> Result<()> {
        spend_lamports_handler(ctx, amount_lamports)
    }

    pub fn transfer_lamports(ctx: Context<TransferLamports>, amount_lamports: u64) -> Result<()> {
        transfer_lamports_handler(ctx, amount_lamports)
    }

    pub fn spend_spl(ctx: Context<SpendSpl>, amount_spl: u64) -> Result<()> {
        spend_spl_handler(ctx, amount_spl)
    }

    pub fn transfer_spl(ctx: Context<TransferSpl>, amount_spl: u64) -> Result<()> {
        transfer_spl_handler(ctx, amount_spl)
    } 
}
