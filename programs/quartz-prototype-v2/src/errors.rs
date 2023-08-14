use anchor_lang::prelude::*;

#[error_code]
pub enum WalletError {
    #[msg("Insufficent funds for the transaction")]
    InsufficientFundsForTransaction
}