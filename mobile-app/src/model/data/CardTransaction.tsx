import { TokenType } from "./Tokens";


export class CardTransactionData {
    amountFiat: number;
    fiatCurrency: string;
    amountToken: number;
    tokenType: TokenType;
    timestamp: string;
    vendor: string;
    location?: string;
  
    constructor(
      { amountFiat, fiatCurrency, amountToken, tokenType, timestamp, vendor, location } :
      { amountFiat: number, fiatCurrency: string, amountToken: number, tokenType: TokenType, timestamp: string, vendor: string, location: string | undefined }
    ) {
      this.amountFiat = amountFiat;
      this.fiatCurrency = fiatCurrency;
      this.amountToken = amountToken;
      this.tokenType = tokenType; 
      this.timestamp = timestamp; 
      this.vendor = vendor;
      this.location = location; 
    }
  }