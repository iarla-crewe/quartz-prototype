use anchor_lang::prelude::*;
use crate::{
    state::Wallet,
    utils::transfer_lamports_from_pda
};

#[derive(Accounts)]
pub struct SpendLamports<'info> {
    #[account(
        mut,
        seeds = [b"wallet", initializer.key().as_ref()],
        bump
    )]
    pub sending_wallet: Account<'info, Wallet>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn spend_lamports_handler(
    ctx: Context<SpendLamports>, 
    amount_lamports: u64
) -> Result<()> {
    // TODO: Implement finding receiver address
    let receiver = ctx.accounts.sending_wallet.to_account_info();

    transfer_lamports_from_pda(
        amount_lamports, 
        ctx.accounts.sending_wallet.to_account_info(), 
        receiver
    )?;

    msg!("{} lamports spent using card", amount_lamports);
    Ok(())
}