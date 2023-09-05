import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "./Styles";
import { 
    USDC_MINT_ADDRESS,
    createConnection,
    getProgram, 
    getProvider, 
    getTestWallet, 
    getVault, 
    getVaultAta, 
    getVaultBalance, 
    getVaultUsdcBalance 
} from "../../program/program";
import { useState, useEffect } from 'react';

export default function HomeScreen( { navigation } : { navigation: any } ) {
    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    const [solBalance, setSolBalance] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const address = getVault(wallet.publicKey).toString();

    return (
        <View>
            <View>
                <View style={theme.standardPadding}>
                    <Text 
                        selectable={true} 
                        style={theme.p}
                    >
                        {address}
                    </Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>SOL: {solBalance.toString()}</Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>USDC: {usdcBalance.toFixed(2)}</Text>
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
                        try {
                            const tx = await program.methods
                                .initAccount()
                                .accounts({ tokenMint: USDC_MINT_ADDRESS })
                                .rpc();
                            console.log(tx);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            >
                <Text style={theme.buttonText}>DEBUG: init account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        try {
                            const tx = await connection.requestAirdrop(getVault(wallet.publicKey), 4e9);
                            console.log(tx);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            >
                <Text style={theme.buttonText}>DEBUG: airdrop sol</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        try {
                            setSolBalance(await getVaultBalance(connection, wallet.publicKey));
                            setUsdcBalance(await getVaultUsdcBalance(connection, wallet.publicKey));
                        } catch (err) {
                            console.log(err);
                        }   
                    }
                }
            >
                <Text style={theme.buttonText}>DEBUG: refresh</Text>
            </TouchableOpacity>
        </View>
    );
}
