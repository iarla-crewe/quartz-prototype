import { PublicKey } from "@solana/web3.js";
import { TokenType } from "./Tokens";


export class CardTransactionData {
    amountFiat: number;
    fiatCurrency: string;
    amountToken: number;
    tokenType: TokenType;
    timestamp: string;
    vendor: string;
    location?: string;
    reference?: PublicKey[];
  
    constructor(
      { amountFiat, fiatCurrency, amountToken, tokenType, timestamp, vendor, location, reference } :
      { amountFiat: number, fiatCurrency: string, amountToken: number, tokenType: TokenType, timestamp: string, vendor: string, location: string | undefined, reference: PublicKey[] | undefined }
    ) {
      this.amountFiat = amountFiat;
      this.fiatCurrency = fiatCurrency;
      this.amountToken = amountToken;
      this.tokenType = tokenType; 
      this.timestamp = timestamp; 
      this.vendor = vendor;
      this.location = location; 
      this.reference = reference;
    }
  }