import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { QuartzPrototypeV2 } from "../target/types/quartz_prototype_v2";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert, expect } from "chai";
import { 
  Keypair, 
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram
} from "@solana/web3.js"

describe("quartz-prototype-v2", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>

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
    assert.fail(0, 1, "Not implemented")
  })

  it("transfer_lamports", async () => {
    const destinationAccount = Keypair.generate()
    expect(
      await provider.connection.getBalance(destinationAccount.publicKey)
    ).to.equal(0);

    // Send SOL to vaultPDA
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: vaultPDA,
        lamports: LAMPORTS_PER_SOL * 2,
      }),
    );
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
    ).to.equal(LAMPORTS_PER_SOL);
  })

  it("spend_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("transfer_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
});
