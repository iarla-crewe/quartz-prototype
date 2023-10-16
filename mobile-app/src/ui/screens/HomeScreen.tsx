import { 
    Text, 
    View, 
    ScrollView,
    RefreshControl,
    Image,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { theme, themeColor } from "../Styles";
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
import { getSolPrice, getUsdcPrice } from "../../utils";

export default function HomeScreen({navigation}:{navigation:any}) {

    const wallet = getTestWallet();

    const provider = getProvider(createConnection(), wallet);
    const program = getProgram(provider); 

    const [solBalance, setSolBalance] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const [solValue, setSolValue] = useState(0);
    const [usdcValue, setUsdcValue] = useState(0);

    const [initialLoading, setInitialLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);
    const refreshBalance = async () => {
        setRefreshing(true);
        try {
            const [sol, usdc, solPrice, usdcPrice] = await Promise.all([
                getVaultBalance(createConnection(), wallet.publicKey),
                getVaultUsdcBalance(createConnection(), wallet.publicKey),
                getSolPrice(),
                getUsdcPrice()
            ])

            setSolBalance(sol);
            setUsdcBalance(usdc);
            setSolValue(sol * solPrice);
            setUsdcValue(usdc * usdcPrice);
        } catch (err) {
            console.log(err);
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        const initialLoad = async () => {
            await refreshBalance();
            setInitialLoading(false);
        }
        initialLoad();
    }, []);

    if (initialLoading) {
        return (
            <View style={theme.mainContainer}>
                <View style={theme.centeredView}>
                    <ActivityIndicator size="large" color={themeColor.primary} />
                </View>
            </View>
        )
    }

    return (
        <View style={theme.mainContainer}>
            <ScrollView
                style={{
                    flex: 1, 
                    height: "100%",
                    width: "100%"
                }}
                contentContainerStyle={theme.centeredView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={async () => {await refreshBalance()}} />
                }
            >
                <View style={theme.centeredView}>
                    <View style={theme.logoPadding}>
                        <Image source={require("../../../assets/logo.png")} style={theme.quartzLogo} />
                    </View>

                    <View style={theme.headerPadding}>
                        <Text style={theme.h1}>€{(solValue + usdcValue).toFixed(2)}</Text>
                    </View>

                    <View style={theme.balance}>
                        <Image source={require("../../../assets/sol.png")} style={theme.tokenIcon} />
                        <View style={theme.standardPadding}>
                            <Text style={theme.h2}>{solBalance}</Text>
                        </View>
                        <View>
                            <Text style={theme.subP}>€{solValue.toFixed(2)}</Text>
                        </View>
                    </View>
                    

                    <View style={theme.balance}>
                        <Image source={require("../../../assets/usdc.png")} style={theme.tokenIcon} />
                        <View style={theme.standardPadding}>
                            <Text style={theme.h2}>{usdcBalance.toFixed(2)}</Text>
                        </View>
                        <View>
                            <Text style={theme.subP}>€{usdcValue.toFixed(2)}</Text>
                        </View>
                    </View>

                    
                    {/* <TouchableOpacity style = {theme.button} onPress={async () => { initAccount(program) }}>
                        <Text style={theme.buttonText}>DEBUG: init account</Text>
                    </TouchableOpacity>  */}
                   

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
                </View>
            </ScrollView>
        </View>
    );
}
