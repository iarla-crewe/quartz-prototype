use anchor_lang::prelude::*;
use crate::state::Wallet;

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(
        mut,
        seeds = [b"wallet", initializer.key().as_ref()],
        bump,
        close = initializer
    )]
    pub wallet: Account<'info, Wallet>,
    #[account(mut)]
    pub initializer: Signer<'info>
}

pub fn close_account_handler(_ctx: Context<CloseAccount>) -> Result<()> {
    msg!("Account closed");
    Ok(())
}