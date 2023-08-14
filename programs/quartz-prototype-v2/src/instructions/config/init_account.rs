use anchor_lang::prelude::*;
use crate::state::Vault;

#[derive(Accounts)]
pub struct InitAccount<'info> {
    #[account(
        init,
        seeds = [b"vault", initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = Vault::SPACE
    )]
    pub wallet: Account<'info, Vault>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    
    pub system_program: Program<'info, System>
}

pub fn init_account_handler(ctx: Context<InitAccount>) -> Result<()> {
    ctx.accounts.wallet.initializer = ctx.accounts.initializer.key();

    msg!("Account created");
    Ok(())
}
