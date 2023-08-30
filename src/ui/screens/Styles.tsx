import { StyleSheet } from "react-native"

export const theme = StyleSheet.create({
    standardPadding: {
        padding: 16
    },
    h1: {
        fontSize: 32,
        color: 'black'
    },
    h2: {
        fontSize: 26,
        color: 'black'
    },
    h2b: {
        fontSize: 26,
        color: 'black',
        fontWeight: 'bold'
    },
    p: {
        fontSize: 24
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
    }
});
