use anchor_lang::prelude::*;
use crate::{
    state::Vault,
    utils::transfer_lamports_from_vault,
    QUARTZ_HOLDING_ADDRESS
};

#[derive(Accounts)]
pub struct SpendLamports<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    /// CHECK: Receiving account does not need to be checked, once address is the correct one
    #[account(
        mut,
        address = QUARTZ_HOLDING_ADDRESS
    )]
    pub receiver: AccountInfo<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn spend_lamports_handler(
    ctx: Context<SpendLamports>, 
    amount_lamports: u64
) -> Result<()> {
    msg!("Sending {} lamports to Quartz address ({}) for card transaction", amount_lamports, ctx.accounts.receiver.key());

    transfer_lamports_from_vault(
        amount_lamports, 
        ctx.accounts.vault.to_account_info(), 
        ctx.accounts.receiver.to_account_info()
    )?;

    msg!("Lamports spent");
    Ok(())
}