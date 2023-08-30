export function currencyToString(rawAmount: number, decimals: number) {
    return (
        rawAmount / (10 ** decimals)
    ).toFixed(decimals);    
}