use anchor_lang::prelude::*;
use crate::{
    state::Wallet,
    utils::transfer_lamports_from_pda,
    QUARTZ_HOLDING_ADDRESS
};

#[derive(Accounts)]
pub struct SpendLamports<'info> {
    #[account(
        mut,
        seeds = [b"wallet", initializer.key().as_ref()],
        bump
    )]
    pub sending_wallet: Account<'info, Wallet>,

    #[account(
        mut,
        address = QUARTZ_HOLDING_ADDRESS
    )]
    pub receiver: AccountInfo<'info>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn spend_lamports_handler(
    ctx: Context<SpendLamports>, 
    amount_lamports: u64
) -> Result<()> {
    transfer_lamports_from_pda(
        amount_lamports, 
        ctx.accounts.sending_wallet.to_account_info(), 
        ctx.accounts.receiver.to_account_info()
    )?;

    msg!("{} lamports spent using card", amount_lamports);
    Ok(())
}