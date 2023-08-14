use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::Vault;

#[derive(Accounts)]
pub struct SplTransfer<'info> {
    #[account(
        seeds = [SEED_PROGRAM_CONFIG],
        bump,
    )]
    pub program_config: Account<'info, Vault>,
    #[account(
        mut,
        token::mint = USDC_MINT_PUBKEY
    )]
    pub sender_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = USDC_MINT_PUBKEY
    )]
    pub receiver_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub sender: Signer<'info>,
}

pub fn spl_transfer_handler(
    ctx: Context<SplTransfer>, 
    amount: u64
) -> Result<()> {
    msg!("Amount: {}", amount);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.sender_token_account.to_account_info(),
                authority: ctx.accounts.sender.to_account_info(),
                to: ctx.accounts.receiver_token_account.to_account_info(),
            }
        ),
        amount
    )?;

    Ok(())
}