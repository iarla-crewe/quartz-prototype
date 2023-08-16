use anchor_lang::prelude::*;
use anchor_spl::token::{
    self,
    Token, 
    TokenAccount,
    Mint
};
use crate::{
    state::Vault,
    QUARTZ_HOLDING_ADDRESS
};


#[derive(Accounts)]
pub struct SpendSpl<'info> {
    #[account(mut)]
    pub vault_initializer: Signer<'info>,

    #[account(
        mut,
        seeds=[vault.key().as_ref(), token_program.key().as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds=[b"vault", vault_initializer.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = receiver
    )]
    pub receiver_ata: Account<'info, TokenAccount>,

    /// CHECK: Receiving account does not need to be checked, once address is the correct one
    #[account(
        mut,
        address = QUARTZ_HOLDING_ADDRESS
    )]
    pub receiver: AccountInfo<'info>,

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

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.vault_ata.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.receiver_ata.to_account_info()
            }
        ),
        amount
    )?;

    msg!("Token spent");
    Ok(())
}
