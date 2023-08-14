use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Insufficent funds for the transaction")]
    InsufficientFundsForTransaction
}