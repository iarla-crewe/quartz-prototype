export interface TokenType {
    name: string,
    decimals: number
} 
  
export const SOL: TokenType = {
    name: 'SOL',
    decimals: 9
}

export const USDC: TokenType = {
    name: 'USDC',
    decimals: 6
}