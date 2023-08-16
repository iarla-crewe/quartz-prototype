import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError } from "@coral-xyz/anchor";
import { QuartzPrototypeV2 } from "../target/types/quartz_prototype_v2";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert, expect } from "chai";
import { 
  Keypair, 
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey
} from "@solana/web3.js"

describe("quartz-prototype-v2", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>
  
  const quartzAddress = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G")

  const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("vault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  )

  it("init_account", async () => {
    const tx = await program.methods.initAccount().rpc()

    const account = await program.account.vault.fetch(vaultPDA)
    expect(account.initializer === provider.wallet.publicKey)
  })

  it("spend_lamports", async () => {
    const initialBalance = await provider.connection.getBalance(quartzAddress)

    // Send SOL to vaultPDA
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPDA,
        lamports: LAMPORTS_PER_SOL * 2,
      })
    )
    await provider.sendAndConfirm(transaction)

    // Call PDA to spend SOL
    const tx = await program.methods
      .spendLamports(new anchor.BN(LAMPORTS_PER_SOL))
      .accounts({
        sendingWallet: vaultPDA, 
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
          sendingWallet: vaultPDA, 
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

    // Send SOL to vaultPDA
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPDA,
        lamports: LAMPORTS_PER_SOL * 2,
      })
    )
    await provider.sendAndConfirm(transaction)

    // Call PDA to spend SOL, with incorrect address
    try {
      const tx = await program.methods
        .spendLamports(new anchor.BN(LAMPORTS_PER_SOL))
        .accounts({
          sendingWallet: vaultPDA, 
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
    const destinationAccount = Keypair.generate()
    expect(
      await provider.connection.getBalance(destinationAccount.publicKey)
    ).to.equal(0)

    // Send SOL to vaultPDA
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPDA,
        lamports: LAMPORTS_PER_SOL * 2,
      })
    )
    await provider.sendAndConfirm(transaction);

    // Call PDA to send SOL to destinationAccount
    const tx = await program.methods
      .transferLamprts(new anchor.BN(LAMPORTS_PER_SOL))
      .accounts({
        sendingWallet: vaultPDA, 
        receiver: destinationAccount.publicKey
      })
      .rpc()

    // Check SOL is received
    expect(
      await provider.connection.getBalance(destinationAccount.publicKey)
    ).to.equal(LAMPORTS_PER_SOL)
  })

  it("transfer_lamports insufficient funds", async () => {
    const desiredErrorCode = "InsufficientFunds"
    const destinationAccount = Keypair.generate()

    try {
      const tx = await program.methods
        .transferLamprts(new anchor.BN(LAMPORTS_PER_SOL * 100)) // Insufficient funds for transaction (instruction should fail)
        .accounts({
          sendingWallet: vaultPDA, 
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
    assert.fail(0, 1, "Not implemented")
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
});
