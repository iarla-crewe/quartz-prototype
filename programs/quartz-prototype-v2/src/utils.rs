use anchor_lang::prelude::*;
use crate::errors::VaultError;
use anchor_spl::token::{self, TokenAccount, Token};

pub fn transfer_lamports_from_pda(
    amount_lamports: u64,
    sender: AccountInfo,
    receiver: AccountInfo
) -> Result<()> {
    if **sender.try_borrow_lamports()? < amount_lamports {
        return err!(VaultError::InsufficientFundsForTransaction);
    }

    **sender.try_borrow_mut_lamports()? -= amount_lamports;
    **receiver.try_borrow_mut_lamports()? += amount_lamports;

    Ok(())
}
