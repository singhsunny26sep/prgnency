import React from "react";
import { View,Text } from "react-native";
import { Container } from "../../../Components/Container/Container";
import { AllColors } from "../../../Constants/COLORS";

export default function LMPScreen() {
    return(
        <Container  
        statusBarStyle={'dark-content'}
        statusBarBackgroundColor={AllColors.white}
        backgroundColor={AllColors.white}>

        </Container>
    )
}