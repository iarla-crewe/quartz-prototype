import {
    AnchorProvider, 
    Wallet,
    Program
} from '@coral-xyz/anchor'
import { 
    Connection, 
    Keypair,
    ConfirmOptions,
    PublicKey
} from '@solana/web3.js'
import { IDL, QuartzPrototypeV2 as QuartzPrototypeV2Program } from './quartz_prototype_v2';

const QUARTZ_PROGRAM_ID = new PublicKey("57U6PNi6ymKcsTTsoFRC18iA4Nuaw6KdTz52NHqo3ENt");       // Devnet Quartz address

const keypair = Keypair.generate();

const connection = new Connection('devnet');

const wallet = new Wallet(keypair);

const confirmOptions : ConfirmOptions = {
    commitment: 'confirmed'
}

const provider = new AnchorProvider(connection, wallet, confirmOptions);

const basicCounterProgram = new Program<QuartzPrototypeV2Program>(
    IDL as QuartzPrototypeV2Program,
    QUARTZ_PROGRAM_ID,
    provider,
);

