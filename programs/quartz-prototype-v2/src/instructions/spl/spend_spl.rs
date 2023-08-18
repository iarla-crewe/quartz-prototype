use anchor_lang::prelude::*;
use anchor_spl::token::{
    self,
    Token, 
    TokenAccount,
    Mint
};
use crate::{
    state::Vault,
    utils::transfer_spl_from_vault,
    QUARTZ_HOLDING_ADDRESS,
    USDC_MINT_ADDRESS
};


#[derive(Accounts)]
pub struct SpendSpl<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds=[b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"ata", owner.key().as_ref(), token_mint.key().as_ref()],
        bump,
        token::mint=token_mint,
        token::authority=vault,
    )]
    pub vault_ata_usdc: Account<'info, TokenAccount>,

    /// CHECK: Receiving account does not need to be checked, once address is the correct one
    #[account(
        mut,
        address = QUARTZ_HOLDING_ADDRESS
    )]
    pub receiver: AccountInfo<'info>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = receiver
    )]
    pub receiver_ata: Account<'info, TokenAccount>,

    #[account(
        address = USDC_MINT_ADDRESS
    )]
    pub token_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>
}

pub fn spend_spl_handler(
    ctx: Context<SpendSpl>, 
    amount: u64
) -> Result<()> {
    msg!(
        "Sending {} of token {}, to Quartz address ({}) for card transaction", 
        amount,
        ctx.accounts.token_program.key(),
        ctx.accounts.receiver_ata.key()
    );

    transfer_spl_from_vault(
        amount,
        ctx.accounts.owner.key(),
        [*ctx.bumps.get("vault").expect("vault should always have a valid bump")],
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.vault_ata_usdc.to_account_info(),
        ctx.accounts.receiver_ata.to_account_info()
    )?;

    msg!("Token spent");
    Ok(())
}
