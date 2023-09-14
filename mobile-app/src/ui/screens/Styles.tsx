import { StyleSheet } from "react-native"

export const theme = StyleSheet.create({
    mainContainer: {
        height: "100%",
        backgroundColor: "#2a2a2a"
    },
    standardPadding: {
        padding: 16
    },
    h1: {
        fontSize: 32,
        color: 'white'
    },
    h2: {
        fontSize: 26,
        color: 'white'
    },
    h2b: {
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold'
    },
    p: {
        fontSize: 24,
        color: '#c9c9c9'
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
        alignItems: 'center',
        marginTop: 50
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
