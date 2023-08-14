use anchor_lang::prelude::*;
use crate::state::Wallet;

#[derive(Accounts)]
pub struct InitAccount<'info> {
    #[account(
        init,
        seeds = [b"wallet", initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = Wallet::SPACE
    )]
    pub wallet: Account<'info, Wallet>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub fn init_account_handler(ctx: Context<InitAccount>) -> Result<()> {
    ctx.accounts.wallet.initializer = ctx.accounts.initializer.key();

    msg!("Account created");
    Ok(())
}
