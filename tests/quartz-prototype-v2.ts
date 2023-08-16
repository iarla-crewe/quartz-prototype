import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { QuartzPrototypeV2 } from "../target/types/quartz_prototype_v2";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert, expect } from "chai";
import { 
  Keypair, 
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey,
  BlockheightBasedTransactionConfirmationStrategy
} from "@solana/web3.js"
import {
  createMint,
  createAccount,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  transfer,
  mintTo,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Account,
} from "@solana/spl-token";

describe("quartz-prototype-v2", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>

  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("vault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  )

  const quartzRecievingAddress = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G")
  
  const Payer = anchor.web3.Keypair.generate()
  const tokenMintAuth = anchor.web3.Keypair.generate()    
  const tokenMintKeypair = anchor.web3.Keypair.generate()        
  let tokenMint: PublicKey
  let quartzAta: Account;
  let vaultAta: Account;

  before(async () => {
    // SOL Top-ups for all accounts used
    { 
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(
            Payer.publicKey,
            2 * LAMPORTS_PER_SOL
        )
      )

      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(
            tokenMintAuth.publicKey,
            2 * LAMPORTS_PER_SOL
        )
      )
    } 

    // Create stablecoin mint
    tokenMint = await createMint(
      provider.connection,
      Payer,
      tokenMintAuth.publicKey,
      tokenMintAuth.publicKey,
      10,
      tokenMintKeypair,
      undefined,
      TOKEN_PROGRAM_ID
    ); 
  
    // Initialise ATA for Quartz wallet
    quartzAta = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        Payer,
        tokenMint,
        quartzRecievingAddress
    )

    // Initialize ATA for Vault
    vaultAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      Payer,
      tokenMint,
      vaultPda,
      true
    );
  });

  it("init_account", async () => {
    const tx = await program.methods.initAccount().rpc()

    const account = await program.account.vault.fetch(vaultPda)
    expect(account.initializer === provider.wallet.publicKey)
  })

  it("spend_spl", async () => {
    const initialBalance = await provider.connection.getBalance(quartzAta.address)
    const tokenCount = 100;

    // Mint spl tokens into vaultAta
    await mintTo(
      provider.connection,
      Payer,
      tokenMint,
      vaultAta.address,
      tokenMintAuth,
      tokenCount * 2,
      [],
      undefined,
      TOKEN_PROGRAM_ID
    );

    // Call PDA to send spl tokens to quartzAta
    const tx = await program.methods
      .transferSpl(new anchor.BN(tokenCount))
      .accounts({
        sender: vaultPda,
        senderAta: vaultAta.address,
        receiverAta: quartzAta.address
      })
      .rpc()

    // Check SOL is received
    const newBalance = await provider.connection.getBalance(quartzAta.address)
    expect(newBalance - initialBalance).to.equal(tokenCount);
  })

  it("transfer_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
});

