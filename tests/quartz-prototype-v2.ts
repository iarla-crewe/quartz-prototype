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
  let quartzAta: PublicKey
  let vaultAta: PublicKey

  before(async () => {
    // SOL Top-ups for all accounts used
    { 
      const txPayer = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: Payer.publicKey,
          lamports: LAMPORTS_PER_SOL * 1000,
        })
      )
      await provider.sendAndConfirm(txPayer)

      const txTokenMintAuth = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: tokenMintAuth.publicKey,
          lamports: LAMPORTS_PER_SOL * 1000,
        })
      )
      await provider.sendAndConfirm(txTokenMintAuth)
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
    quartzAta = (await getOrCreateAssociatedTokenAccount(
        provider.connection,
        Payer,
        tokenMint,
        quartzRecievingAddress
    )).address
    

    // Initialize ATA for Vault

    // TODO - Tidy
    const [tmp] = anchor.web3.PublicKey.findProgramAddressSync(
      [vaultPda.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
      program.programId
    )
    vaultAta = tmp

    // vaultAta = await getOrCreateAssociatedTokenAccount(
    //   provider.connection,
    //   Payer,
    //   tokenMint,
    //   vaultPda,
    //   true
    // );
  });

  it("init_account", async () => {
    const tx = await program.methods.initAccount().rpc()

    const account = await program.account.vault.fetch(vaultPda)
    expect(account.initializer === provider.wallet.publicKey)
  })

  it("spend_spl", async () => {
    const initialBalance = await provider.connection.getBalance(quartzAta)
    const tokenCount = 100;

    console.log("minting...")

    let secret = new Uint8Array([249,159,32,245,180,151,45,253,13,150,133,225,46,230,64,177,80,113,33,188,200,237,79,91,193,246,225,188,126,55,224,186,121,150,192,1,119,31,215,244,64,92,76,223,210,231,224,237,118,235,158,203,112,250,196,3,142,3,227,15,170,15,38,70])


    let test: Signer = {
      publicKey: provider.wallet.publicKey,
      secretKey: Keypair.fromSecretKey(secret).secretKey
    }


    await mintTo(
      provider.connection,
      test,
      tokenMint,
      vaultAta,
      tokenMintAuth,
      tokenCount * 2,
      [],
      undefined,
      TOKEN_PROGRAM_ID
    )

    console.log("minted")
    console.log("calling spendSpl...")

    // Call PDA to send spl tokens to quartzAta
    const tx = await program.methods
      .spendSpl(new anchor.BN(tokenCount))
      .accounts({
        vaultInitializer: provider.wallet.publicKey,
        vaultAta: vaultAta,
        vault: vaultPda,
        receiverAta: quartzAta,
        receiver: quartzRecievingAddress,
        tokenMint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()
    
    console.log("transaction complete")

    // Check SOL is received
    const newBalance = await provider.connection.getBalance(quartzAta)
    expect(newBalance - initialBalance).to.equal(tokenCount);
  })

  it("transfer_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
});

