export interface TokenType {
    name: string,
    decimals: number
} 
  
export class SOL implements TokenType {
    name = 'SOL';
    decimals = 9;
}

export class USDC implements TokenType {
    name = 'USDC';
    decimals = 2;
}