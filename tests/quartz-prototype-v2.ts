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
  PublicKey
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
} from "@solana/spl-token";

describe("quartz-prototype-v2", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.QuartzPrototypeV2 as Program<QuartzPrototypeV2>

  const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("vault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  )

  const quartzRecievingAddress = new PublicKey("jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G")
  const Payer = anchor.web3.Keypair.generate()
  const tokenMintAuth = anchor.web3.Keypair.generate()    
  const tokenMintKeypair = anchor.web3.Keypair.generate()        
  let tokenMint: PublicKey
  let quartzATA;
  let vaultPdaAta;

  before(async () => {
    // SOL Top-ups for all accounts used
    { 
        await provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(
              Payer.publicKey,
              2 * LAMPORTS_PER_SOL
          )
      );

        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                tokenMintAuth.publicKey,
                2 * LAMPORTS_PER_SOL
            )
        );
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                quartzRecievingAddress,
                2 * LAMPORTS_PER_SOL
            )
        );  
    } 
  });

  it("init_account", async () => {
    const tx = await program.methods.initAccount().rpc()

    const account = await program.account.vault.fetch(vaultPDA)
    expect(account.initializer === provider.wallet.publicKey)
  })

  it("spend_spl", async () => {
    // Stablecoin mint
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
  
    // Initialise ATA for Quartz and Anchor wallet
    quartzATA = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        Payer,
        tokenMint,
        quartzRecievingAddress
    ); 

    vaultPdaAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      Payer,
      tokenMint,
      vaultPDA
    );
    
    const destinationAddress = quartzATA
    expect(
      await provider.connection.getBalance(destinationAddress)
    ).to.equal(0)

    //mint spl tokens into vaultPDAata
    await mintTo(
      provider.connection,
      Payer,
      tokenMint,
      vaultPdaAta,
      tokenMintAuth,
      100,
      [],
      undefined,
      TOKEN_PROGRAM_ID
  );

    // Call PDA to send SOL to destinationAccount
    const tx = await program.methods
      .transferSpl(new anchor.BN(100))
      .accounts({
        sender: vaultPDA,
        senderAta: vaultPdaAta,
        receiverAta: destinationAddress,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .rpc()

    // Check SOL is received
    expect(
      await provider.connection.getBalance(destinationAddress)
    ).to.equal(100);
  })

  it("transfer_spl", async () => {
    assert.fail(0, 1, "Not implemented")
  })

  it("close_account", async () => {
    const tx = await program.methods.closeAccount().rpc()
  })
});

