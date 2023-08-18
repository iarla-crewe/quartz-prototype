import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { QuartzPrototypeV2 } from "../target/types/quartz_prototype_v2";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert, expect } from "chai";
import {  
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  Signer,
  Keypair
} from "@solana/web3.js"
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("quartz-prototype-v2 tests", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  const connection = provider.connection
  const wallet = anchor.workspace.QuartzPrototypeV2.provider.wallet
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>

  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("vault"), wallet.publicKey.toBuffer()],
    program.programId
  )

  const quartzRecievingAddress = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G")
  
  const Payer = anchor.web3.Keypair.generate()
  const tokenMintAuth = anchor.web3.Keypair.generate()    
  const tokenMintKeypair = anchor.web3.Keypair.generate()        
  let tokenMint: PublicKey
  let quartzAta: PublicKey
  let vaultAta: PublicKey
  const splTokenAmount = 100

  before(async () => {
    // SOL Top-ups for all accounts used
    const txPayer = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: Payer.publicKey,
        lamports: LAMPORTS_PER_SOL * 1000,
      })
    )
    await provider.sendAndConfirm(txPayer)

    const txTokenMintAuth = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: tokenMintAuth.publicKey,
        lamports: LAMPORTS_PER_SOL * 1000,
      })
    )
    await provider.sendAndConfirm(txTokenMintAuth)

    // Create stablecoin mint
    tokenMint = await createMint(
      connection,
      Payer,
      tokenMintAuth.publicKey,
      tokenMintAuth.publicKey,
      10,
      tokenMintKeypair,
      undefined,
      TOKEN_PROGRAM_ID
    ); 
  
    // Initialise ATA for Quartz wallet
    quartzAta = (await getOrCreateAssociatedTokenAccount(
        connection,
        Payer,
        tokenMint,
        quartzRecievingAddress
    )).address
    
    // Initialize ATA for Vault
    vaultAta = (await getOrCreateAssociatedTokenAccount(
      connection,
      Payer,
      tokenMint,
      vaultPda,
      true
    )).address

    // Mint tokens to vault ATA
    await mintTo(
      connection,
      Payer,
      tokenMint,
      vaultAta,
      tokenMintAuth,
      splTokenAmount * 1000
    )
  })

  it("init_account", async () => {
    const tx = await program.methods.initAccount().rpc()

    const account = await program.account.vault.fetch(vaultPda)
    expect(account.initializer === wallet.publicKey)
  })

  it("spend_spl", async () => {
    const initialBalance = await connection.getBalance(quartzAta)

    // Call PDA to send spl tokens to quartzAta
    const tx = await program.methods
      .spendSpl(new anchor.BN(splTokenAmount))
      .accounts({
        vaultInitializer: wallet.publicKey,
        vaultAta: vaultAta,
        vault: vaultPda,
        receiverAta: quartzAta,
        receiver: quartzRecievingAddress,
        tokenMint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()

    // Check SOL is received
    const newBalance = await connection.getBalance(quartzAta)
    expect(newBalance - initialBalance).to.equal(splTokenAmount);
  })

  it("transfer_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
})

