use anchor_lang::prelude::*;
use anchor_spl::token::{
    self,
    Token, 
    TokenAccount
};
use crate::QUARTZ_HOLDING_ADDRESS;


#[derive(Accounts)]
pub struct SpendSpl<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        // token::mint = USDC_MINT_PUBKEY   // Shouldn't need - spl token used is irrelevant
    )]
    pub sender_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = sender_ata.mint,
        address = QUARTZ_HOLDING_ADDRESS
    )]
    pub receiver_ata: Account<'info, TokenAccount>,

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
                from: ctx.accounts.sender_ata.to_account_info(),
                authority: ctx.accounts.sender.to_account_info(),
                to: ctx.accounts.receiver_ata.to_account_info()
            }
        ),
        amount
    )?;

    msg!("Token spent");
    Ok(())
}
