use anchor_lang::prelude::*;

declare_id!("57U6PNi6ymKcsTTsoFRC18iA4Nuaw6KdTz52NHqo3ENt");

#[program]
pub mod quartz_prototype_v2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
