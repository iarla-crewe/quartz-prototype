import { SOL, USDC, TokenType } from "./Tokens";
import { PublicKey } from "@solana/web3.js";


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

    static fromJSON(json: string) {
      const data = JSON.parse(json);
      const amountFiat = Number(data.amountFiat);
      const fiatCurrency = data.fiatCurrency;
      const amountToken = Number(data.amountToken);
      const timestamp = data.timestamp;
      const vendor = data.vendor;
      const location = data.location;

      let tokenType = JSON.parse(data.tokenType);
      if (tokenType.name === "SOL") tokenType = SOL;
      else if (tokenType.name === "USDC") tokenType = USDC;
      else {
        console.log("Error: Could not deserialize - invalid TokenType");
        return undefined;
      }

      return new CardTransactionData({
        amountFiat, fiatCurrency, amountToken, tokenType, timestamp, vendor, location
      });
    }

    toJSON() {
      return JSON.stringify(
        {
          amountFiat: this.amountFiat,
          fiatCurrency: this.fiatCurrency,
          amountToken: this.amountToken,
          tokenType: JSON.stringify(this.tokenType),
          timestamp: this.timestamp,
          vendor: this.vendor,
          location: this.location
        }
      );
    }
  }