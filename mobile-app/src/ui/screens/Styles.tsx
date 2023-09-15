import { StyleSheet } from "react-native"

export enum themeColor {
    primary = "#f5f2ff",
    secondary = "#153aa1",
    darkGrey = "#3a3a39",
    grey = "#575757",
    text = "#3c315b"
}
export const theme = StyleSheet.create({
    mainContainer: {
        height: "100%",
        backgroundColor: themeColor.primary
    },
    standardPadding: {
        padding: 16
    },
    headerPadding: {
        padding: 16,
        paddingBottom: 32
    },
    h1: {
        fontSize: 44,
        color: themeColor.text
    },
    h2: {
        fontSize: 30,
        color: themeColor.text
    },
    h2b: {
        fontSize: 30,
        color: themeColor.text,
        fontWeight: 'bold'
    },
    p: {
        fontSize: 24,
        color: themeColor.darkGrey
    },
    subP: {
        fontSize: 24,
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
        width: 30,
        height: 30,
        borderRadius: 30/2
    },
    tokenIconBig: {
        width: 100,
        height: 100,
        borderRadius: 100/2
    }
});
