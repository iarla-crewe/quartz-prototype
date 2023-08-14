use anchor_lang::prelude::*;

#[account]
pub struct Wallet {
    pub initializer: Pubkey
}

impl Wallet {
    pub const SPACE: usize = 
        8           // anchor discriminator
        + 32;       // initializer
}