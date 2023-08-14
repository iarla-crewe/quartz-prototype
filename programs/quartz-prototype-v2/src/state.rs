use anchor_lang::prelude::*;

#[account]
pub struct Vault {
    pub initializer: Pubkey
}

impl Vault {
    pub const SPACE: usize = 
        8           // anchor discriminator
        + 32;       // initializer
}