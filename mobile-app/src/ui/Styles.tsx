import { StyleSheet } from "react-native"
import { PixelRatio, Dimensions  } from "react-native";
const win = Dimensions.get('window');

export enum themeColor {
    primary = "#f4f4f4",
    secondary = "#153aa1",
    darkGrey = "#3a3a39",
    grey = "#575757",
    text = "#3c315b",
    green = "#67A115",
    red = "#A13015"
}

const fontScale = PixelRatio.getFontScale();
const getFontSize = (size: number) => size / fontScale;
export const theme = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
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
    logoPadding: {
        marginTop: -128,
        paddingBottom: 128
    },
    h1: {
        fontSize: getFontSize(44),
        textAlign: "center",
        color: themeColor.text,
        fontFamily: 'IBM Plex Sans Light'
    },
    h2: {
        fontSize: getFontSize(30),
        textAlign: "center",
        color: themeColor.text,
        fontFamily: 'IBM Plex Sans Light'
    },
    h2b: {
        fontSize: getFontSize(30),
        textAlign: "center",
        color: themeColor.text,
        fontWeight: 'bold',
        fontFamily: 'IBM Plex Sans Light'
    },
    h3: {
        fontSize: getFontSize(28),
        textAlign: "center",
        color: themeColor.text,
        fontFamily: 'IBM Plex Sans Light'
    },
    p: {
        fontSize: getFontSize(24),
        textAlign: "center",
        color: themeColor.darkGrey,
        fontFamily: 'IBM Plex Sans Light'
    },
    smallText: {
        fontSize: getFontSize(18),
        textAlign: "center",
        color: themeColor.grey,
        fontFamily: 'IBM Plex Sans Light'
    },
    subP: {
        fontSize: getFontSize(24),
        textAlign: "center",
        color: themeColor.grey,
        fontFamily: 'IBM Plex Sans Light'
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
        color: 'white',
        fontFamily: 'IBM Plex Sans Light'
    },
    textInput: {
        width: "100%",
        paddingHorizontal: 8,
        backgroundColor: "white",
        color: themeColor.darkGrey,
        fontFamily: 'IBM Plex Sans Light'
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
        width: getFontSize(30),
        height: getFontSize(30),
        borderRadius: 30/2
    },
    tokenIconBig: {
        width: getFontSize(100),
        height: getFontSize(100),
        borderRadius: 100/2
    },
    quartzLogo: {
        width: win.width * 0.66,
        height: 100,
        resizeMode: "contain"
    }
});
