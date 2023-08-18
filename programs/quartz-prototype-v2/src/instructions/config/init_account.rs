use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::USDC_MINT_ADDRESS;
use anchor_spl::token::{
    Token,
    TokenAccount,
    Mint
};

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

    #[account(
        init,
        payer = owner,
        seeds=[b"ata", owner.key().as_ref(), token_mint.key().as_ref()],
        bump,
        token::mint=token_mint,
        token::authority=vault,
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    #[account(
        address = USDC_MINT_ADDRESS
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
    
    pub token_program: Program<'info, Token>
}

pub fn init_account_handler(ctx: Context<InitAccount>) -> Result<()> {
    ctx.accounts.vault.owner = ctx.accounts.owner.key();

    msg!("Account created");
    Ok(())
}
