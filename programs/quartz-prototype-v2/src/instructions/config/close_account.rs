use anchor_lang::prelude::*;
use crate::state::Vault;

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump,
        close = owner
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub owner: Signer<'info>
}

pub fn close_account_handler(_ctx: Context<CloseAccount>) -> Result<()> {
    msg!("Account closed");
    Ok(())
}