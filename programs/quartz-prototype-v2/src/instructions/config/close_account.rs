use anchor_lang::prelude::*;
use crate::state::Vault;

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(
        mut,
        seeds = [b"vault", initializer.key().as_ref()],
        bump,
        close = initializer
    )]
    pub wallet: Account<'info, Vault>,
    
    #[account(mut)]
    pub initializer: Signer<'info>
}

pub fn close_account_handler(_ctx: Context<CloseAccount>) -> Result<()> {
    msg!("Account closed");
    Ok(())
}