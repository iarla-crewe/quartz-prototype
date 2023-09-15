import { 
    Text,
    TouchableOpacity, 
    View, 
    ScrollView,
    RefreshControl
} from "react-native";
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
} from "../../program/program_utils";
import { useState, useEffect } from 'react';
import { airdropSol, initAccount } from "../../program/instructions";

export default function HomeScreen() {
    const wallet = getTestWallet();

    const [solBalance, setSolBalance] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const [solValue, setSolValue] = useState(0);
    const [usdcValue, setUsdcValue] = useState(0);

    const [refreshing, setRefreshing] = useState(false);
    const refreshBalance = async () => {
        setRefreshing(true);
        try {
            const [sol, usdc] = await Promise.all([
                getVaultBalance(createConnection(), wallet.publicKey),
                getVaultUsdcBalance(createConnection(), wallet.publicKey)
            ])

            setSolBalance(sol);
            setUsdcBalance(usdc);
        } catch (err) {
            console.log(err);
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        refreshBalance();
    }, []);

    return (
        <View style={theme.mainContainer}>
            <ScrollView
                style={{
                    flex: 1, 
                    height: "100%"
                }}
                contentContainerStyle={theme.centeredView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={async () => {await refreshBalance()}} />
                }
            >
                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>€{(solValue + usdcValue).toFixed(2)}</Text>
                </View>

                <View style={theme.standardPadding}>
                    <View>
                        <Text style={theme.h2}>SOL: {solBalance}</Text>
                    </View>
                </View>
                

                <View style={theme.standardPadding}>
                    <View>
                        <Text style={theme.h2}>USDC: {usdcBalance.toFixed(2)}</Text>
                    </View>
                </View>

                {/*
                <TouchableOpacity style = {theme.button} onPress={async () => { initAccount(program) }}
                    <Text style={theme.buttonText}>DEBUG: init account</Text>
                </TouchableOpacity> 
                */}

                {/*
                <TouchableOpacity style = {theme.button} onPress={async () => { airdropSol(connection, wallet.publicKey) }}>
                    <Text style={theme.buttonText}>DEBUG: airdrop sol</Text>
                </TouchableOpacity>
                */}

                {/*
                <TouchableOpacity style = {theme.button} onPress={() => navigation.navigate('Spend')}>
                    <Text style={theme.buttonText}>DEBUG: fake card spend</Text>
                </TouchableOpacity>
                */}
            </ScrollView>
        </View>
    );
}
