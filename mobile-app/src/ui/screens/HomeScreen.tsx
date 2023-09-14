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

export default function HomeScreen( { navigation } : { navigation: any } ) {

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    const [solBalance, setSolBalance] = useState("loading...");
    const [usdcBalance, setUsdcBalance] = useState("loading...");
    const address = getVault(wallet.publicKey).toString();

    const [refreshing, setRefreshing] = useState(false);
    const refreshBalance = async () => {
        setRefreshing(true);
        try {
            const sol = await getVaultBalance(createConnection(), wallet.publicKey);
            const usdc = await getVaultUsdcBalance(createConnection(), wallet.publicKey);

            setSolBalance(sol.toString());
            setUsdcBalance(usdc.toFixed(2));
        } catch (err) {
            console.log(err);

            setSolBalance("error");
            setUsdcBalance("error");
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
                style={{flex: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={async () => {await refreshBalance()}} />
                }
            >
                <View>
                    <View style={theme.standardPadding}>
                        <Text selectable={true} style={theme.p}>
                            {address}
                        </Text>
                    </View>

                    <View style={theme.standardPadding}>
                        <Text style={theme.h1}>SOL: {solBalance}</Text>
                    </View>

                    <View style={theme.standardPadding}>
                        <Text style={theme.h1}>USDC: {usdcBalance}</Text>
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

                {/*
                <TouchableOpacity 
                    style = {theme.button}
                    onPress={
                        async () => { initAccount(program) }
                    }
                >
                    <Text style={theme.buttonText}>DEBUG: init account</Text>
                </TouchableOpacity> 
                */}

                {/*
                <TouchableOpacity 
                    style = {theme.button}
                    onPress={
                        async () => { airdropSol(connection, wallet.publicKey) }
                    }
                >
                    <Text style={theme.buttonText}>DEBUG: airdrop sol</Text>
                </TouchableOpacity>
                */}

                {/*
                <TouchableOpacity 
                    style = {theme.button}
                    onPress={
                        () => navigation.navigate('Spend')
                    }
                >
                    <Text style={theme.buttonText}>DEBUG: fake card spend</Text>
                </TouchableOpacity>
                */}
            </ScrollView>
        </View>
    );
}
