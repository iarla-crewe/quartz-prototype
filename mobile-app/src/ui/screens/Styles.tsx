import { StyleSheet } from "react-native"

export enum themeColor {
    primary = "#f5f2ff",
    secondary = "#153aa1",
    darkGrey = "#3a3a39",
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
    h1: {
        fontSize: 32,
        color: themeColor.text
    },
    h2: {
        fontSize: 26,
        color: themeColor.text
    },
    h2b: {
        fontSize: 26,
        color: themeColor.text,
        fontWeight: 'bold'
    },
    p: {
        fontSize: 24,
        color: themeColor.darkGrey
    },
    button: {
        backgroundColor: 'lightgray',
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 16,
        padding: 16
    },
    buttonText: {
        color: 'black'
    },
    textInput: {
        width: "100%",
        paddingHorizontal: 8,
        backgroundColor: "white"
    },
    centeredView: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
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
    }
});
