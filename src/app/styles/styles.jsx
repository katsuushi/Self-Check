import { StyleSheet } from "react-native";
export const getStyles = () =>
    StyleSheet.create({
        body: {
            backgroundColor: "#303030",
            width: "100%",
            height: "100%",
        },
        header: {
            backgroundColor: "#000",
        },
        text: {
            color: "#fff",
            fontFamily: "Roboto", // doesnt work lmao
            fontSize: 16,
            marginTop: "auto",
            padding: 16,
        },
        bigtext: {
            fontWeight: "bold",
            fontSize: 32,
        },
    });
