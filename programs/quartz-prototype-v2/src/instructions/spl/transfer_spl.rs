use anchor_lang::prelude::*;
use anchor_spl::token::{
    self,
    Token, 
    TokenAccount
};

#[derive(Accounts)]
pub struct TransferSpl<'info> {
    // TODO - Remake, copy spend_spl's accounts

    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut)]
    pub sender_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = sender_ata.mint
    )]
    pub receiver_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>
}

pub fn transfer_spl_handler(
    ctx: Context<TransferSpl>, 
    amount: u64
) -> Result<()> {
    msg!(
        "Sending {} of token {} to {}",
        amount, 
        ctx.accounts.token_program.key(),
        ctx.accounts.receiver_ata.key()
    );

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.sender_ata.to_account_info(),
                authority: ctx.accounts.sender.to_account_info(),
                to: ctx.accounts.receiver_ata.to_account_info()
            }
        ),
        amount
    )?;

    msg!("Token sent");
    Ok(())
}