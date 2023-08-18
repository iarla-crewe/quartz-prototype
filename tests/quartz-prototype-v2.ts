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
  Keypair
} from "@solana/web3.js"
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token"

describe("quartz-prototype-v2 tests", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  const connection = provider.connection
  const wallet = anchor.workspace.QuartzPrototypeV2.provider.wallet
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>
  
  const quartzAddress = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G")
  let quartzAtaUsdc: PublicKey

  // Set up all required accounts
  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("vault"), wallet.publicKey.toBuffer()],
    program.programId
  )
  let vaultAtaUsdc: PublicKey

  const usdcAuth = anchor.web3.Keypair.generate()    
  let usdcKeypair: Keypair    
  let usdcMint: PublicKey
  const CENT_PER_USDC = 2

  async function mintUsdcToVault(amount: number) {
    await mintTo(
      connection,
      wallet.payer,
      usdcMint,
      vaultAtaUsdc,
      usdcAuth,
      CENT_PER_USDC * amount
    )
  }

  before(async () => {
    // Get local testing USDC keypair
    usdcKeypair = Keypair.fromSecretKey(
      new Uint8Array(
        JSON.parse(
          fs.readFileSync(path.resolve(__dirname, "./keys/envrJbV6GbhBTi8Pu6h9MwNViLuAmu3mFFRq7gE9Cp3.json"))
        )
      )
    )

    // Get Vault USDC ATA
    vaultAtaUsdc = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("ata"), wallet.publicKey.toBuffer(), usdcKeypair.publicKey.toBuffer()],
      program.programId
    )[0]

    // Top-up SOL for USDC mint authority
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: usdcAuth.publicKey,
        lamports: LAMPORTS_PER_SOL * 1000,
      })
    )
    await provider.sendAndConfirm(tx)

    // Create USDC mint
    usdcMint = await createMint(
      connection,
      wallet.payer,
      usdcAuth.publicKey,
      usdcAuth.publicKey,
      2,
      usdcKeypair
    )
  
    // Initialise USDC ATA for Quartz wallet
    quartzAtaUsdc = (await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.payer,
        usdcMint,
        quartzAddress
    )).address
  })

  it("init_account", async () => {
    const tx = await program.methods
      .initAccount()
      .accounts({ tokenMint: usdcMint })
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

      assert.fail(0, 1, "transferLamports instruction call should have failed")
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }
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

      assert.fail(0, 1, "spendLamports instruction call should have failed")
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }
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

      assert.fail(0, 1, "transferLamports instruction call should have failed")
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }
  })

  it("spend_spl", async () => {
    await mintUsdcToVault(10)
    const initialBalance = Number(
      (await connection.getTokenAccountBalance(quartzAtaUsdc)).value.amount
    )

    // Call PDA to spend USDC
    const tx = await program.methods
      .spendSpl(new anchor.BN(CENT_PER_USDC))
      .accounts({
        owner: wallet.publicKey,
        vaultAtaUsdc: vaultAtaUsdc,
        vault: vaultPda,
        receiverAta: quartzAtaUsdc,
        receiver: quartzAddress,
        tokenMint: usdcMint
      })
      .rpc()

    // Check USDC is received
    const newBalance = Number(
      (await connection.getTokenAccountBalance(quartzAtaUsdc)).value.amount
    )
    expect(newBalance - initialBalance).to.equal(CENT_PER_USDC)
  })

  it("spend_spl insufficient funds", async () => {
    const desiredErrorCode = "InsufficientFunds"

    // Call PDA to send spl tokens to quartzAta
    try {
      const tx = await program.methods 
        .spendSpl(new anchor.BN(CENT_PER_USDC * 100000)) // Insufficient funds for transaction (instruction should fail)
        .accounts({
          owner: wallet.publicKey,
          vaultAtaUsdc: vaultAtaUsdc,
          vault: vaultPda,
          receiverAta: quartzAtaUsdc,
          receiver: quartzAddress,
          tokenMint: usdcMint
        })
        .rpc()

      assert.fail(0, 1, "spendSpl instruction call should have failed")
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }
  })

  it("spend_spl incorrect receiver address", async () => {
    const desiredErrorCode = "ConstraintAddress"
    await mintUsdcToVault(100)

    // Initialize a random ATA
    const destinationAddress = Keypair.generate().publicKey
    const destinationAta = (await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      usdcMint,
      destinationAddress
    )).address

    // Call PDA to spend USDC, with incorrect receiver address 
    try {
      const tx = await program.methods
        .spendSpl(new anchor.BN(CENT_PER_USDC))
        .accounts({
          owner: wallet.publicKey,
          vaultAtaUsdc: vaultAtaUsdc,
          vault: vaultPda,
          receiverAta: destinationAta,      // Incorrect receiverATA (instruction should fail)
          receiver: destinationAddress,     // Incorrect receiver (instruction should fail)
          tokenMint: usdcMint
        })
        .rpc()

      assert.fail(0, 1, "spendSol instruction call should have failed")
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }

    // Call PDA to spend USDC, with correct ATA but incorrect owner
    try {
      const tx = await program.methods
        .spendSpl(new anchor.BN(CENT_PER_USDC))
        .accounts({
          owner: wallet.publicKey,
          vaultAtaUsdc: vaultAtaUsdc,
          vault: vaultPda,
          receiverAta: quartzAtaUsdc,      
          receiver: destinationAddress,     // Incorrect receiver (instruction should fail)
          tokenMint: usdcMint
        })
        .rpc()

      assert.fail(0, 1, "spendSol instruction call should have failed")
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }
  })

  it("spend_spl mismatched ata owner", async () => {
    const desiredErrorCode = "ConstraintTokenOwner"
    await mintUsdcToVault(100)

    // Initialize a random ATA
    const destinationAta = (await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      usdcMint,
      Keypair.generate().publicKey
    )).address

    // Call PDA to spend USDC, with correct owner but incorrect ATA
    try {
      const tx = await program.methods
        .spendSpl(new anchor.BN(CENT_PER_USDC))
        .accounts({
          owner: wallet.publicKey,
          vaultAtaUsdc: vaultAtaUsdc,
          vault: vaultPda,
          receiverAta: destinationAta,      // Incorrect receiverATA (instruction should fail)
          receiver: quartzAddress,
          tokenMint: usdcMint
        })
        .rpc()

      assert.fail(0, 1, "spendSol instruction call should have failed")
    } catch(err) {
      expect(err).to.be.instanceOf(AnchorError)
      expect((err as AnchorError).error.errorCode.code).to.equal(desiredErrorCode)
    }
  })

  it("transfer_spl", async () => {
    await mintUsdcToVault(100)
    
    // Initialize a random ATA
    const destinationAddress = Keypair.generate().publicKey
    const destinationAta = (await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      usdcMint,
      destinationAddress
    )).address

    // Call PDA to spend USDC
    const tx = await program.methods
      .transferSpl(new anchor.BN(CENT_PER_USDC))
      .accounts({
        owner: wallet.publicKey,
        vaultAtaUsdc: vaultAtaUsdc,
        vault: vaultPda,
        receiverAta: destinationAta,
        receiver: destinationAddress,
        tokenMint: usdcMint
      })
      .rpc()

    // Check USDC is received
    const balance = Number(
      (await connection.getTokenAccountBalance(destinationAta)).value.amount
    )
    expect(balance).to.equal(CENT_PER_USDC)
  })

  // it("transfer_spl insufficient funds", async () => {
  //   assert.fail(0, 1, "Not implemented")
  // })

  // it("transfer_spl mismatched ata owner", async () => {
  //   assert.fail(0, 1, "Not implemented")
  // })

  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
})
