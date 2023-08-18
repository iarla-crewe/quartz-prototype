import * as anchor from "@coral-xyz/anchor"
import { Program, AnchorError } from "@coral-xyz/anchor"
import { QuartzPrototypeV2 } from "../target/types/quartz_prototype_v2"
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { assert, expect } from "chai"
const fs = require("fs")
import path from "path"
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
  getAccount
} from "@solana/spl-token"

describe("quartz-prototype-v2 tests", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  const connection = provider.connection
  const wallet = anchor.workspace.QuartzPrototypeV2.provider.wallet
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>
  
  const quartzAddress = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G")

  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("vault"), wallet.publicKey.toBuffer()],
    program.programId
  )
  
  let vaultAtaUsdc: PublicKey
  const Payer = anchor.web3.Keypair.generate()
  const tokenMintAuth = anchor.web3.Keypair.generate()    
  let tokenMintKeypair: Keypair    
  let tokenMint: PublicKey
  let quartzAta: PublicKey
  const splTokenAmount = 100

  async function mintUsdcToVault() {
    await mintTo(
      connection,
      wallet.payer,
      tokenMint,
      vaultAtaUsdc,
      tokenMintAuth,
      splTokenAmount * 1000
    )
  }

  before(async () => {
    let data = fs.readFileSync(
      path.resolve(__dirname, "./keys/envrJbV6GbhBTi8Pu6h9MwNViLuAmu3mFFRq7gE9Cp3.json")
    )
    tokenMintKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(data))
    )

    vaultAtaUsdc = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("ata"), wallet.publicKey.toBuffer(), tokenMintKeypair.publicKey.toBuffer()],
      program.programId
    )[0]

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
      2,
      tokenMintKeypair,
      undefined,
      TOKEN_PROGRAM_ID
    )
  
    // Initialise ATA for Quartz wallet
    quartzAta = (await getOrCreateAssociatedTokenAccount(
        connection,
        Payer,
        tokenMint,
        quartzAddress
    )).address
  })

  it("init_account", async () => {
    const tx = await program.methods
      .initAccount()
      .accounts({ tokenMint: tokenMint })
      .rpc()

    const account = await program.account.vault.fetch(vaultPda)
    expect(account.owner === wallet.publicKey)
  })

  it("spend_lamports", async () => {
    const initialBalance = await provider.connection.getBalance(quartzAddress)

    // Send SOL to vaultPda
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPda,
        lamports: LAMPORTS_PER_SOL * 2,
      })
    )
    await provider.sendAndConfirm(transaction)

    // Call PDA to spend SOL
    const tx = await program.methods
      .spendLamports(new anchor.BN(LAMPORTS_PER_SOL))
      .accounts({
        vault: vaultPda, 
        receiver: quartzAddress
      })
      .rpc()

    // Check SOL is received
    const newBalance = await provider.connection.getBalance(quartzAddress)
    expect(newBalance - initialBalance).to.equal(LAMPORTS_PER_SOL)
  })

  it("spend_lamports insufficient funds", async () => {
    const desiredErrorCode = "InsufficientFunds"

    try {
      const tx = await program.methods
        .spendLamports(new anchor.BN(LAMPORTS_PER_SOL * 100)) // Insufficient funds for transaction (instruction should fail)
        .accounts({
          vault: vaultPda, 
          receiver: quartzAddress
        })
        .rpc()
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)

      return
    }

    assert.fail(0, 1, "transferLamports instruction call should have failed")
  })

  it("spend_lamports incorrect receiver address", async () => {
    const desiredErrorCode = "ConstraintAddress"

    // Send SOL to vaultPda
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPda,
        lamports: LAMPORTS_PER_SOL * 2,
      })
    )
    await provider.sendAndConfirm(transaction)

    // Call PDA to spend SOL, with incorrect address
    try {
      const tx = await program.methods
        .spendLamports(new anchor.BN(LAMPORTS_PER_SOL))
        .accounts({
          vault: vaultPda, 
          receiver: Keypair.generate().publicKey  // Incorrect receiver address (instruction should fail)
        })
        .rpc()
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)

      return
    }

    assert.fail(0, 1, "spendLamports instruction call should have failed")
  })

  it("transfer_lamports", async () => {
    const destinationAccount = Keypair.generate().publicKey
    expect(
      await provider.connection.getBalance(destinationAccount)
    ).to.equal(0)

    // Send SOL to vaultPda
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPda,
        lamports: LAMPORTS_PER_SOL * 2,
      })
    )
    await provider.sendAndConfirm(transaction);

    // Call PDA to transfer SOL
    const tx = await program.methods
      .transferLamports(new anchor.BN(LAMPORTS_PER_SOL))
      .accounts({
        vault: vaultPda, 
        receiver: destinationAccount
      })
      .rpc()

    // Check SOL is received
    expect(
      await provider.connection.getBalance(destinationAccount)
    ).to.equal(LAMPORTS_PER_SOL)
  })

  it("transfer_lamports insufficient funds", async () => {
    const desiredErrorCode = "InsufficientFunds"
    const destinationAccount = Keypair.generate()

    try {
      const tx = await program.methods
        .transferLamports(new anchor.BN(LAMPORTS_PER_SOL * 1000)) // Insufficient funds for transaction (instruction should fail)
        .accounts({
          vault: vaultPda, 
          receiver: destinationAccount.publicKey
        })
        .rpc()
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)

      return
    }

    assert.fail(0, 1, "transferLamports instruction call should have failed")
  })

  it("spend_spl", async () => {
    mintUsdcToVault()
    const initialBalance = Number(
      (await connection.getTokenAccountBalance(quartzAta)).value.amount
    )

    // Call PDA to send spl tokens to quartzAta
    const tx = await program.methods
      .spendSpl(new anchor.BN(splTokenAmount))
      .accounts({
        owner: wallet.publicKey,
        vaultAtaUsdc: vaultAtaUsdc,
        vault: vaultPda,
        receiverAta: quartzAta,
        receiver: quartzAddress,
        tokenMint: tokenMint
      })
      .rpc()

    // Check SPL is received
    const newBalance = Number(
      (await connection.getTokenAccountBalance(quartzAta)).value.amount
    )
    expect(newBalance - initialBalance).to.equal(splTokenAmount)
  })

  it("spend_spl insufficient funds", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("spend_spl incorrect receiver address", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("transfer_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("transfer_spl insufficient funds", async () => {
    assert.fail(0, 1, "Not implemented")
  })
  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
})
