import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "./Styles";
import { 
    USDC_MINT_ADDRESS,
    getProgram, 
    getProvider, 
    getVault, 
    getVaultBalance, 
    getVaultUsdcBalance 
} from "../../program/utils";
import { useState } from 'react';

export default function HomeScreen( { route, navigation } : { route: any, navigation: any } ) {
    const { connection, wallet } = route.params;

    const [solBalance, setSolBalance] = useState(getVaultBalance(connection, wallet.publicKey));
    const [usdcBalance, setUsdcBalance] = useState(getVaultUsdcBalance(connection, wallet.publicKey));
    const [address, setAddress] = useState("00000000000000000000000000000000");

    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    return (
        <View>
            <View>
                <View style={theme.standardPadding}>
                    <Text style={theme.p}>{address}</Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>SOL: {solBalance.toString()}</Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>USDC: {usdcBalance.toString()}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate('TransferSelect')
                }
            >
                <Text style={theme.buttonText}>Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate('Spend')
                }
            >
                <Text style={theme.buttonText}>DEBUG: fake card spend</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        await program.methods
                            .initAccount()
                            .accounts({ tokenMint: USDC_MINT_ADDRESS })
                            .rpc()
                    }
                }
            >
                <Text style={theme.buttonText}>DEBUG: init account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        await connection.requestAirdrop(getVault(wallet.publicKey), 4e9);
                    }
                }
            >
                <Text style={theme.buttonText}>DEBUG: airdrop sol</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        const vaultInstance = await program.account.vault.fetch(getVault(wallet.publicKey))

                        setAddress(vaultInstance.owner.toString());
                        setSolBalance(getVaultBalance(connection, wallet.publicKey));
                        setUsdcBalance(getVaultUsdcBalance(connection, wallet.publicKey));
                    }
                }
            >
                <Text style={theme.buttonText}>DEBUG: refresh</Text>
            </TouchableOpacity>
        </View>
    );
}
