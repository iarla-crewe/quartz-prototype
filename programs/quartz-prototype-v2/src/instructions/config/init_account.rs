use anchor_lang::prelude::*;
use crate::state::Vault;

#[derive(Accounts)]
pub struct InitAccount<'info> {
    #[account(
        init,
        seeds = [b"vault", owner.key().as_ref()],
        bump,
        payer = owner,
        space = Vault::SPACE
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>
}

pub fn init_account_handler(ctx: Context<InitAccount>) -> Result<()> {
    ctx.accounts.vault.owner = ctx.accounts.owner.key();

    msg!("Account created");
    Ok(())
}
