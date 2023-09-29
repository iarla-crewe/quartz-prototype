import { StyleSheet, useWindowDimensions } from "react-native"

export enum themeColor {
    primary = "#f5f2ff",
    secondary = "#153aa1",
    darkGrey = "#3a3a39",
    grey = "#575757",
    text = "#3c315b"
}

const { fontScale } = useWindowDimensions();
export const theme = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        padding: 16,
        backgroundColor: themeColor.primary
    },
    halfPadding: {
        padding: 8
    },
    standardPadding: {
        padding: 16
    },
    extraPadding: {
        padding: 32
    },
    headerPadding: {
        padding: 16,
        paddingBottom: 32
    },
    h1: {
        fontSize: 44 / fontScale,
        textAlign: "center",
        color: themeColor.text
    },
    h2: {
        fontSize: 30 / fontScale,
        textAlign: "center",
        color: themeColor.text
    },
    h2b: {
        fontSize: 30 / fontScale,
        textAlign: "center",
        color: themeColor.text,
        fontWeight: 'bold'
    },
    h3: {
        fontSize: 28 / fontScale,
        textAlign: "center",
        color: themeColor.text
    },
    p: {
        fontSize: 24 / fontScale,
        textAlign: "center",
        color: themeColor.darkGrey
    },
    subP: {
        fontSize: 24 / fontScale,
        textAlign: "center",
        color: themeColor.grey
    },
    button: {
        backgroundColor: themeColor.secondary,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 16,
        padding: 16
    },
    buttonText: {
        color: 'white'
    },
    textInput: {
        width: "100%",
        paddingHorizontal: 8,
        backgroundColor: "white",
        color: themeColor.darkGrey
    },
    centeredView: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    verticalCenteredView: {
        flex: 1,
        height: "100%",
        justifyContent: "center"
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    balance: {
        flexDirection: "row",
        alignItems: "center"
    },
    tokenIcon: {
        width: 30 / fontScale,
        height: 30 / fontScale,
        borderRadius: (30/2) / fontScale
    },
    tokenIconBig: {
        width: 100 / fontScale,
        height: 100 / fontScale,
        borderRadius: (100/2) / fontScale
    }
});
