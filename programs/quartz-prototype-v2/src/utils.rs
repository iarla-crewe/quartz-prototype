use anchor_lang::prelude::*;
use crate::errors::VaultError;
use anchor_spl::token;


pub fn transfer_lamports_from_vault(
    amount_lamports: u64,
    sender: AccountInfo,
    receiver: AccountInfo
) -> Result<()> {
    if **sender.try_borrow_lamports()? < amount_lamports {
        return err!(VaultError::InsufficientFunds);
    }

    **sender.try_borrow_mut_lamports()? -= amount_lamports;
    **receiver.try_borrow_mut_lamports()? += amount_lamports;

    Ok(())
}

pub fn transfer_spl_from_vault<'info>(
    amount: u64,
    owner: Pubkey,
    bump: [u8; 1],
    token_program: AccountInfo<'info>,
    vault: AccountInfo<'info>,
    vault_ata: AccountInfo<'info>,
    vault_ata_current_balance: u64,
    receiver_ata: AccountInfo<'info>
) -> Result<()> {
    if vault_ata_current_balance < amount {
        return err!(VaultError::InsufficientFunds);
    }

    let seeds = vec![
        b"vault".as_ref(),
        owner.as_ref(),
        &bump
    ];

    token::transfer(
        CpiContext::new_with_signer(
            token_program,
            token::Transfer {
                from: vault_ata.to_account_info(),
                to: receiver_ata,
                authority: vault
            },
            vec![seeds.as_slice()].as_slice()
        ),
        amount
    )?;

    Ok(())
}