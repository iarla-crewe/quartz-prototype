use anchor_lang::prelude::*;
use crate::{
    state::Vault,
    utils::transfer_lamports_from_pda
};

#[derive(Accounts)]
pub struct TransferLamports<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub sending_wallet: Account<'info, Vault>,
    
    /// CHECK: Receiving account does not need to be checked
    #[account(mut)]
    pub receiver: AccountInfo<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn transfer_lamports_handler(
    ctx: Context<TransferLamports>, 
    amount_lamports: u64
) -> Result<()> {
    msg!("Sending {} lamports to {}", amount_lamports, ctx.accounts.receiver.key());
        
    transfer_lamports_from_pda(
        amount_lamports, 
        ctx.accounts.sending_wallet.to_account_info(), 
        ctx.accounts.receiver.to_account_info()
    )?;

    msg!("Lamports sent");
    Ok(())
}